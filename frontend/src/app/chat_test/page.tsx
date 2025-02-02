"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import CardSelector from "./card-selector"
import Image from "next/image"

type MessageType = {
  sender: "bot" | "user"
  text: string
  options?: string[]
  isCardSelection?: boolean
  cardImage?: string
}

export default function ChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<MessageType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<1 | 2>(1) // Changed to only 1 | 2
  const [showCardSelector, setShowCardSelector] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    startChat()
  }, [])

  const startChat = async () => {
    setIsLoading(true)
    try {
      const initialMessage: MessageType = {
        sender: "bot",
        text: "안녕하세요! 아래 보기 중 원하시는 상담을 선택해주세요.",
        options: ['연애운', '취업운' , '금전운'],
      }
      setMessages([initialMessage])
    } catch (error) {
      console.error("Error starting chat:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOptionSelect = async (option: string) => {
    setIsLoading(true)

    const userMessage: MessageType = {
      sender: "user",
      text: `${option}을 선택했습니다.`,
    }
    setMessages((prev) => [...prev, userMessage])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ option }),
      })

      const data = await response.json()

      const botMessage: MessageType = {
        sender: "bot",
        text: data.message || "타로 카드를 통해 알아보도록 하겠습니다. 아래 버튼을 눌러 카드를 선택해주세요.",
        isCardSelection: true,
      }
      setMessages((prev) => [...prev, botMessage])
      setCurrentStep(2)
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "오류가 발생했습니다. 다시 시도해주세요.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCardSelect = async (cardNumber: number) => {
    setShowCardSelector(false)
    setIsLoading(true)

    const userMessage: MessageType = {
      sender: "user",
      text: "카드를 선택했습니다.",
      cardImage: `/basic/maj${cardNumber}.svg`,
    }
    setMessages((prev) => [...prev, userMessage])

    // 카드 선택 후 그 카드의 번호를 전달, 메이저 카드에 대한것만 현재 전달 중
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardNumber }),   
      })

      const data = await response.json()

      const botMessage: MessageType = {
        sender: "bot",
        text: data.message || "선택하신 카드로 상담을 마무리하겠습니다.",
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "오류가 발생했습니다. 다시 시도해주세요.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatContainerRef]) //Corrected dependency

  return (
    <div className="min-h-screen bg-gray-900 p-4 pb-24 flex flex-col">
      <div ref={chatContainerRef} className="flex flex-col space-y-4 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="flex flex-col">
            <div
              className={`max-w-[80%] p-4 rounded-2xl ${
                msg.sender === "user"
                  ? "bg-purple-600 self-end rounded-tr-none"
                  : "bg-gray-700 self-start rounded-tl-none"
              }`}
            >
              <p className="text-white">{msg.text}</p>
              {msg.cardImage && (
                                <Image
                                src={msg.cardImage || "/placeholder.svg"}
                                alt="Selected tarot card"
                                width={192}
                                height={268}
                                className="mt-2"
                              />
              )}
            </div>

            {currentStep === 1 && msg.options && (
              <div className="flex gap-2 mt-2">
                {msg.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOptionSelect(option)}
                    disabled={isLoading}
                    className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white px-6 py-2 rounded-lg"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {currentStep === 2 && msg.isCardSelection && (
              <button
                onClick={() => setShowCardSelector(true)}
                disabled={isLoading}
                className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white px-6 py-2 rounded-lg mt-2 self-start"
              >
                타로 카드 선택하기
              </button>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="bg-gray-700 self-start p-4 rounded-2xl rounded-tl-none">
            <p className="text-white">입력 중...</p>
          </div>
        )}
      </div>

      {showCardSelector && <CardSelector onCardSelect={handleCardSelect} onClose={() => setShowCardSelector(false)} />}

      <div className="fixed bottom-4 left-0 right-0 px-4">
        <button
          onClick={() => router.push("/home")}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
        >
          상담 종료하기
        </button>
      </div>
    </div>
  )
}

