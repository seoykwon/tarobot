"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getTarotMasters } from "@/libs/api"
import Image from "next/image"
import { useSession } from "@/context/SessionContext";
import { ChevronUp, ChevronDown } from "lucide-react"

interface TarotMaster {
  id: number
  name: string
  description: string
  concept: string
  profileImage: string
  mbti: string
}

interface TarotMasterListProps {
  onOpenCharacterSelect: () => void
}

export default function TarotMasterList({ onOpenCharacterSelect }: TarotMasterListProps) {
  const [tarotMasters, setTarotMasters] = useState<TarotMaster[]>([])
  const [selectedMaster, setSelectedMasgter] = useState<TarotMaster | null>(null)
  const router = useRouter()
  // const { setBotId, triggerSessionUpdate } = useSession();

  useEffect(() => {
    const fetchTarotMasters = async () => {
      try {
        const masters = await getTarotMasters()
        setTarotMasters(masters.slice(0, 3))
      } catch (error) {
        console.error("타로 마스터 불러오기 실패:", error)
      }
    }

    fetchTarotMasters()
  }, [])

  const handleSelectMaster = (master: TarotMaster) => {
    if (selectedMaster?.id == master.id){
      setSelectedMasgter(null)
    } else {
      setSelectedMasgter(master)
    }
  }

  const handleStartChat = (masterId: number) => {
    // 채팅 시작 로직 구현
    router.push('/chat/${masterId}')
  }

  return (
    <div className="space-y-4">
      {tarotMasters.map((master) => (
        <div key={master.id} className="relative">
          <button 
          onClick={() => handleSelectMaster(master)}
          className="flex items-center w-full p-3 rounded-lg hover:bg-gray-100 text-[#0D0D0D]">
          <Image
            src={master.profileImage || "/placeholder.svg"}
            alt={`타로 마스터 ${master.name}`}
            width={40}
            height={40}
            className="rounded-full mr-3"
          />
          <span className="flex-grow text-left">{master.name}</span>
          {selectedMaster?.id === master.id ? <ChevronUp className= "h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
          {selectedMaster?.id === master.id && (
            <div className="absolute left-full ml-2 w-64 bg-white shadow-lg rounded-lg p-4 z-10">
              <h2 className="text-xl font-bold text-yellow-600 mb-2">{master.name}</h2>
              <p className="text-sm text-gray-600 mb-4">{master.concept}</p>
              <p className="text-sm text-gray-700 mb-4">{master.description}</p>
              <button
                onClick={() => handleStartChat(master.id)}
                className="w-full py-2 bg-yellow-500 text-white font-bold rounded hover:bg-yellow-600 transition-colors"
              >
                채팅 시작
              </button>
            </div>
          )}
        </div>
      ))}
      <button
        onClick={onOpenCharacterSelect}
        className="mt-4 w-full py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 p-3 rounded-lg flex items-center justify-start transition-colors"
      >
        더 많은 마스터 보기
      </button>
    </div>
  )
}

