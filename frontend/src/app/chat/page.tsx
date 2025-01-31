"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ChevronLeft, Video, UserPlus, Send } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card } from "@/components/ui/Card"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

interface Participant {
  id: string
  name: string
  imageUrl: string
}

const ChatPage = () => {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteId, setInviteId] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: "bot",
      name: "AI Tarot Master",
      imageUrl: "/placeholder.svg",
    },
  ])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setInputMessage("")

    // API 호출
    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
      // const response = await fetch("http://0.0.0.0:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputMessage, // 백엔드에서 요구하는 "message" 필드만 포함
        }),
      });
    
      if (!response.ok) {
        throw new Error("Failed to fetch chatbot response");
      }
    
      const data = await response.json();
    
      // 응답 데이터 처리
      const botMessage: Message = {
        id: Date.now().toString(),
        content: data.chatbot_response,
        sender: "bot",
        timestamp: new Date(),
      };
    
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Error: Unable to fetch response from the chatbot.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  }

  const handleInvite = () => {
    if (participants.length >= 2) {
      alert("더 이상 초대할 수 없습니다.")
      return
    }

    // 실제 구현에서는 여기에 초대 로직 추가
    const newParticipant: Participant = {
      id: inviteId,
      name: "Invited User",
      imageUrl: "/placeholder.svg",
    }
    setParticipants((prev) => [...prev, newParticipant])
    setInviteId("")
    setShowInviteModal(false)
  }

  // 초대 모달
  const InviteModal = () => {
    if (!showInviteModal) return null

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md p-4 space-y-4">
          <h2 className="text-lg font-semibold">친구 초대하기</h2>
          <Input placeholder="친구 ID를 입력하세요" value={inviteId} onChange={(e) => setInviteId(e.target.value)} />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowInviteModal(false)}>
              취소
            </Button>
            <Button onClick={handleInvite}>초대하기</Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* 헤더 */}
      <div className="flex items-center gap-3 p-4 border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Image src="/placeholder.svg" alt="Tarot Master" width={40} height={40} className="rounded-full" />
        <div className="flex-1">
          <h1 className="font-semibold">AI Tarot Master</h1>
          <p className="text-sm text-muted-foreground">Online</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            /* 화상통화 로직 */
          }}
        >
          <Video className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setShowInviteModal(true)}>
          <UserPlus className="h-6 w-6" />
        </Button>
      </div>

      {/* 채팅 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 mb-16">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[66%] rounded-lg px-4 py-2 shadow-md ${
                message.sender === "user" ? "bg-[#5A90FF] text-white" : "bg-secondary text-secondary-foreground"
              }`}
            >
              <p className="break-words">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 메시지 입력 */}
      <div className="fixed bottom-16 left-0 right-0 bg-background border-t p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            type="text"
            placeholder="Type your question for the Tarot Master..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {/* 초대 모달 */}
      <InviteModal />
    </div>
  )
}

export default ChatPage


