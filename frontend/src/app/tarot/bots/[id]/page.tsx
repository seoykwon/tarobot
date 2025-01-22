"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { MessageCircle } from "lucide-react"

export default function TarotBotPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Tarot Bot Details</h1>
      <p className="mb-4">현재 선택된 타로 상담사 ID: {params.id}</p>

      <Button onClick={() => router.push(`/chat?botId=${params.id}`)} className="bg-fuchsia-500 hover:bg-fuchsia-600">
        <MessageCircle className="w-4 h-4 mr-2" />
        채팅 시작하기
      </Button>
    </div>
  )
}

