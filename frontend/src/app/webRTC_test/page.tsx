'use client'

import { useEffect, useState, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { OpenVidu } from 'openvidu-browser'

export default function ChatAndVideoPage() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [roomId, setRoomId] = useState('test-room')
  const [message, setMessage] = useState('')
  const [chatLog, setChatLog] = useState<string[]>([])
  const [session, setSession] = useState<any>(null)
  const [publisher, setPublisher] = useState<any>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const newSocket = io("http://127.0.0.1:8000", { path: "/socket.io/", transports: ["websocket", "polling"] })
    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on("room_joined", (data) => {
        setChatLog(prev => [...prev, `Joined room: ${data.room_id}`])
      })
      socket.on("chat_message", (data) => {
        setChatLog(prev => [...prev, `[USER] ${data.message}`])
      })
      socket.on("chatbot_message", (data) => {
        setChatLog(prev => [...prev, `[BOT] ${data.message}`])
      })
    }
  }, [socket])

  const joinRoom = () => {
    if (socket) {
      socket.emit("join_room", { room_id: roomId })
    }
  }

  const sendMessage = () => {
    if (socket && message) {
      socket.emit("chat_message", { room_id: roomId, message })
      setMessage('')
    }
  }

  const startVideo = async () => {
    try {
      const sessionResponse = await fetch("http://localhost:8000/openvidu/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      const sessionData = await sessionResponse.json()
      const sessionId = sessionData.id

      await fetch("http://localhost:8000/openvidu/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ custom_session_id: sessionId })
      })

      const tokenResponse = await fetch("http://localhost:8000/openvidu/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId })
      })
      const tokenData = await tokenResponse.json()
      const token = tokenData.token

      const OV = new OpenVidu()
      const session = OV.initSession()

      session.on("streamCreated", (event) => {
        session.subscribe(event.stream, videoContainerRef.current)
      })

      await session.connect(token, { clientData: "UserNickname" })

      const publisher = OV.initPublisher(videoContainerRef.current, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true
      })
      await session.publish(publisher)

      setSession(session)
      setPublisher(publisher)
    } catch (error) {
      console.error("Error starting video:", error)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">1) Real-time Chat (Socket.IO)</h1>
      <div className="mb-4">
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Room ID"
          className="border p-2 mr-2"
        />
        <button onClick={joinRoom} className="bg-blue-500 text-white p-2 rounded">Join Room</button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
          className="border p-2 mr-2"
        />
        <button onClick={sendMessage} className="bg-green-500 text-white p-2 rounded">Send</button>
      </div>
      <div className="border p-2 h-64 overflow-y-auto mb-8">
        {chatLog.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>

      <h1 className="text-2xl font-bold mb-4">2) Video/Audio (OpenVidu)</h1>
      <button onClick={startVideo} className="bg-red-500 text-white p-2 rounded mb-4">Start Video</button>
      <div ref={videoContainerRef} className="border w-full h-96"></div>
    </div>
  )
}
