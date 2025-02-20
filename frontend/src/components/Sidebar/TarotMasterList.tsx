"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { getTarotMasters } from "@/libs/api"
import { useSession } from "@/context/SessionContext"

interface TarotMaster {
  id: number
  name: string
  description: string
  concept: string
  profileImage: string
  mbti: string
  expertise: string[]
}

interface TarotMasterListProps {
  onOpenCharacterSelect: () => void
}

export default function TarotMasterList({ onOpenCharacterSelect }: TarotMasterListProps) {
  const [tarotMasters, setTarotMasters] = useState<TarotMaster[]>([])
  const [selectedMaster, setSelectedMaster] = useState<TarotMaster | null>(null)
  const [isClosing, setIsClosing] = useState(false)
  const sidePanelRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { setBotId, triggerSessionUpdate } = useSession()

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

  /** 🔹 마스터 클릭 시 패널 열거나 닫기 */
  const handleSelectMaster = (master: TarotMaster) => {
    if (selectedMaster?.id === master.id) {
      setIsClosing(true)
      setTimeout(() => {
        setSelectedMaster(null)
        setIsClosing(false)
      }, 200)
    } else {
      setSelectedMaster(master)
    }
  }

  /** 🔹 채팅 시작 */
  const handleStartChat = (masterId: number) => {
    localStorage.setItem("botId", masterId.toString())
    setBotId(masterId.toString())
    triggerSessionUpdate()
    setIsClosing(true) // 패널 닫기 애니메이션 시작
    setTimeout(() => {
      setSelectedMaster(null) // 선택된 마스터 초기화
      setIsClosing(false)
      router.push("/chat") // 채팅화면으로 이동동
    }, 200)
  }

  /** 🔹 패널 외부 클릭 시 닫기 */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidePanelRef.current && !sidePanelRef.current.contains(event.target as Node)) {
        setIsClosing(true)
        setTimeout(() => {
          setSelectedMaster(null)
          setIsClosing(false)
        }, 200)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative">
      <ul className="space-y-4">
        {tarotMasters.map((master) => (
          <li
            key={master.id}
            onClick={() => handleSelectMaster(master)}
            className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200 text-[#0D0D0D] cursor-pointer ${
              selectedMaster?.id === master.id ? "bg-gray-100" : ""
            }`}
          >
            <Image
              src={master.profileImage || "/placeholder.svg"}
              alt={`타로 마스터 ${master.name}`}
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="truncate whitespace-nowrap overflow-hidden text-ellipsis min-w-0">
              {master.name || `타로마스터 ${master.id}`}
            </span>
          </li>
        ))}
      </ul>
      <button
        onClick={onOpenCharacterSelect}
        className="mt-4 w-full py-2 bg-[#f0f4f9] text-black rounded-lg hover:bg-gray-200 p-3 rounded-lg flex items-center justify-start transition-colors"
      >
        더 많은 마스터 보기
      </button>

      {selectedMaster && (
        <div
          ref={sidePanelRef}
          className={`fixed top-14 left-0 min-[420px]:w-[420px] max-[419px]:w-[320px] min-[675px]:left-64 h-[250px] bg-purple-200 text-white p-2 z-10 overflow-y-auto rounded-lg flex flex-col justify-between transition-transform duration-300 ${
            isClosing ? "opacity-0 translate-x-10" : "opacity-100 translate-x-0"
          }`}
          style={{ maxHeight: "90vh" }}
        >
          <div className="space-y-4 flex-greow overflow-y-auto">
            <div>
              <h3 className="text-sm text-purple-400 mb-1">{selectedMaster.concept}</h3>
              <h2 className="text-2xl font-bold text-purple-700">{selectedMaster.name}</h2>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">{selectedMaster.description}</p>
          </div>
          <button
            onClick={() => handleStartChat(selectedMaster.id)}
            className="w-full py-3 bg-purple-400 text-white font-bold rounded-lg hover:bg-purple-500 transition-colors mt-8"
          >
            채팅 시작
          </button>
        </div>
        
      )}
    </div>
  )
}

