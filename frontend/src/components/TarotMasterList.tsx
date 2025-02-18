"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getTarotMasters } from "@/libs/api"
import Image from "next/image"

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
  const router = useRouter()

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

  const handleSelectMaster = (masterId: number) => {
    localStorage.setItem("botId", masterId.toString())
    router.push("/chat")
  }

  return (
    <>
      <ul className="space-y-4">
        {tarotMasters.map((master) => (
          <li
            key={master.id}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-[#0D0D0D] cursor-pointer"
            onClick={() => handleSelectMaster(master.id)}
          >
            {master.profileImage && (
              <Image
                src={master.profileImage || "/placeholder.svg"}
                alt={`타로 마스터 ${master.name}`}
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
            <span className="truncate whitespace-nowrap overflow-hidden text-ellipsis min-w-0">
              {master.name || `타로마스터 ${master.id}`}
            </span>
          </li>
        ))}
      </ul>
      <button
        onClick={onOpenCharacterSelect}
        className="mt-4 w-full py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 p-3 rounded-lg flex items-center justify-start transition-colors"
      >
        더 많은 마스터 보기
      </button>
    </>
  )
}

