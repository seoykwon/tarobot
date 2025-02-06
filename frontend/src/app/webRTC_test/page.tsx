"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import io, { Socket } from "socket.io-client";

interface ChatMessage {
  sender: string;
  text: string;
}

const VideoChat = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    const newSocket = io("http://localhost:8080"); // Spring Boot WebSocket 서버 주소
    setSocket(newSocket);

    // RTCPeerConnection 설정
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    setPeerConnection(pc);

    // ICE candidate 이벤트
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        newSocket.emit("ice-candidate", event.candidate);
      }
    };

    // 원격 스트림 수신 이벤트
    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    newSocket.on("offer", async (offer) => {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      newSocket.emit("answer", answer);
    });
    
    newSocket.on("answer", async (answer) => {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    });

    newSocket.on("ice-candidate", async (candidate) => {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error("Error adding received ICE candidate", error);
      }
    });

    // 채팅 메시지 이벤트 처리: 서버에서 받은 메시지를 채팅방에 추가
    newSocket.on("chat-message", (data: ChatMessage) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      newSocket.disconnect();
      pc.close();
    };
  }, []);

  const startLocalStream = async () => {
    if (!peerConnection) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  };

  const createOffer = async () => {
    if (!peerConnection || !socket) return;
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit("offer", offer);
  };

  const sendChatMessage = (e: FormEvent) => {
    e.preventDefault();
    if (chatInput.trim() && socket) {
      const messageData: ChatMessage = { sender: "나", text: chatInput };
      setMessages((prev) => [...prev, messageData]);
      socket.emit("chat-message", messageData);
      setChatInput("");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* 비디오 영역 */}
      <div>
        <video ref={localVideoRef} autoPlay muted style={{ width: "300px", marginRight: "10px" }} />
        <video ref={remoteVideoRef} autoPlay style={{ width: "300px" }} />
      </div>
      <div style={{ margin: "10px" }}>
        <button onClick={startLocalStream}>Start Local Stream</button>
        {/* 소켓과 피어 연결이 준비되지 않은 경우 disabled 처리 */}
        <button onClick={createOffer} disabled={!socket || !peerConnection}>
          Call
        </button>
      </div>
      
      {/* 채팅방 영역 */}
      <div style={{ width: "100%", maxWidth: "500px", marginTop: "20px" }}>
        <h3>채팅방</h3>
        <ul style={{ border: "1px solid #ccc", padding: "10px", height: "200px", overflowY: "auto" }}>
          {messages.map((msg, index) => (
            <li key={index}>
              <strong>{msg.sender === "나" ? "나" : "상대방"}:</strong> {msg.text}
            </li>
          ))}
        </ul>
        <form onSubmit={sendChatMessage} style={{ display: "flex", marginTop: "10px" }}>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            style={{ flex: 1, marginRight: "5px" }}
          />
          <button type="submit">전송</button>
        </form>
      </div>
    </div>
  );
};

export default VideoChat;
