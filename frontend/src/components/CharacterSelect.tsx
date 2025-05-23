// "use client"

// import { useState } from "react"
// import { Flame, Star, Target, X } from "lucide-react"

// const characters = [
//   {
//     id: 1,
//     name: "미루",
//     role: "타로리스트",
//     description: "캐릭터 설명이 길어지면 스크롤이 가능해야 합니다.",
//     roleDescription: "어느 분야에 특화되어 있는지 설명하는 영역입니다.",
//     image: "/images/dummy1.png",
//     specialties: ["INFO", "C", "Q", "E", "X"],
//     thumbnail: "/images/dummy1.png",
//   },
//   {
//     id: 2,
//     name: "소라",
//     role: "타로리스트",
//     description: "이 캐릭터는 타로를 보는 특별한 능력을 가지고 있습니다.",
//     roleDescription: "어느 분야에 특화되어 있는지 설명하는 영역입니다.",
//     image: "/images/dummy2.png",
//     specialties: ["INFO", "C", "Q", "E", "X"],
//     thumbnail: "/images/dummy2.png",
//   },
// ]

// interface CharacterSelectProps {
//   isOpen: boolean
//   onClose: () => void
// }

// export default function CharacterSelect({ isOpen, onClose }: CharacterSelectProps) {
//   const [selectedCharacter, setSelectedCharacter] = useState(characters[0])

//   if (!isOpen) return null

//   return (
//     <div
//       className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]"
//       onClick={(e) => {
//         if (e.target === e.currentTarget) {
//           onClose()
//         }
//       }}
//     >
//       <div className="bg-gray-900 w-full max-w-lg rounded-lg overflow-hidden">
//         <div className="flex min-h-[600px]">
//           {/* Left side - Character Selection */}
//           <div className="w-auto border-r border-gray-800 overflow-y-auto">
//             <div className="flex flex-col p-4 gap-4">
//               {characters.map((character) => (
//                 <button
//                   key={character.id}
//                   onClick={() => setSelectedCharacter(character)}
//                   className={`flex items-center gap-4 p-2 rounded-lg transition-colors ${
//                     selectedCharacter.id === character.id ? "bg-gray-800" : "hover:bg-gray-800"
//                   }`}
//                 >
//                   <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
//                     <img
//                       src={character.thumbnail || "/placeholder.svg"}
//                       alt={character.name}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Right side - Character Info */}
//           <div className="flex flex-[3] flex-col p-6">
//             <button onClick={onClose} className="self-end text-gray-400 hover:text-gray-200">
//               ✕
//             </button>
//             <div className="flex flex-col flex-grow">
//               <h1 className="mb-1 text-sm font-medium text-gray-400">{selectedCharacter.role}</h1>
//               <h2 className="mb-6 text-4xl font-bold text-yellow-300">{selectedCharacter.name}</h2>

//               {/* Specialty icons */}
//               <div className="mb-6 flex gap-4">
//                 {selectedCharacter.specialties.map((specialty, index) => (
//                   <div key={index} className="flex h-12 w-12 items-center justify-center bg-gray-800 rounded-md">
//                     {specialty === "INFO" && <Target className="h-6 w-6 text-yellow-300" />}
//                     {specialty === "C" && <Flame className="h-6 w-6 text-yellow-300" />}
//                     {specialty === "Q" && <Star className="h-6 w-6 text-yellow-300" />}
//                     {specialty === "E" && <Flame className="h-6 w-6 text-yellow-300" />}
//                     {specialty === "X" && <X className="h-6 w-6 text-yellow-300" />}
//                   </div>
//                 ))}
//               </div>

//               {/* Character descriptions */}
//               <div className="flex flex-col flex-grow">
//                 <div className="flex-grow-[2] overflow-y-auto p-2 rounded-md">
//                   <p className="text-sm text-gray-300">{selectedCharacter.description}</p>
//                 </div>
//                 <div className="flex-grow overflow-y-auto p-2 rounded-md mt-4">
//                   <h3 className="mb-2 text-sm font-medium text-gray-400">{selectedCharacter.role}</h3>
//                   <p className="text-sm text-gray-300">{selectedCharacter.roleDescription}</p>
//                 </div>
//               </div>

//               {/* Rating */}
//               <div className="mt-4 flex items-center gap-1">
//                 {Array.from({ length: 5 }).map((_, index) => (
//                   <span key={index} className="text-yellow-300">
//                     ★
//                   </span>
//                 ))}
//               </div>
//             </div>

//             {/* Chat button */}
//             <button className="mt-4 w-full py-2 bg-yellow-300 text-black font-bold rounded hover:bg-yellow-400 transition-colors">
//               채팅 시작
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
// import { Flame, Star, Target, X } from "lucide-react"
import { API_URLS } from "@/config/api"
import { useSession } from "@/context/SessionContext"

interface TarotBot {
  id: number
  createdAt: string
  updatedAt: string
  name: string
  description: string
  concept: string
  profileImage: string
  mbti: string
  expertise: string[]
}

interface CharacterSelectProps {
  isOpen: boolean
  onClose: () => void
}

export default function CharacterSelect({ isOpen, onClose }: CharacterSelectProps) {
  const [tarotBots, setTarotBots] = useState<TarotBot[]>([])
  const [selectedBot, setSelectedBot] = useState<TarotBot | null>(null)
  const [isComing, setIsClosing] = useState(false)
  const router = useRouter()
  const { setBotId, triggerSessionUpdate } = useSession()

  useEffect(() => {
    const fetchTarotBots = async () => {
      try {
        const response = await fetch(API_URLS.TAROTBOTS.LIST, {
          credentials: "include",
        })
        if (!response.ok) throw new Error("Failed to fetch tarot bots")
        const data = await response.json()
        setTarotBots(data);
        // 첫 번째 타로 마스터 자동 선택
        if (data.length > 0 && !selectedBot) {
          setSelectedBot(data[0]);
        }
      } catch (error) {
        console.error("Error fetching tarot bots:", error)
      }
    };

    fetchTarotBots()
  }, [selectedBot]);

  useEffect(() => {
    if (tarotBots.length > 0 && !selectedBot) {
      setSelectedBot(tarotBots[0]);
    }
  }, [tarotBots, selectedBot]);

  useEffect(()=>{
    console.log(`isComing: ${isComing}`);
  }, [isComing])

  const handleStartChat = async () => {
    if (!selectedBot) return

    localStorage.setItem("botId", selectedBot.id.toString())
    setBotId(selectedBot.id.toString())
    triggerSessionUpdate()
    setIsClosing(true) // 패널 닫기 애니메이션 시작

    setTimeout(() => {
      setSelectedBot(null) // 선택된 봇 초기화
      setIsClosing(false)
      onClose() // 모달 닫기
      router.push("/chat") // 채팅화면으로 이동
    }, 200)
  }
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsClosing(true)
          setTimeout(() => {
            onClose()
            setIsClosing(false)
          }, 200)
        }
      }}
    >
      <div className="bg-purple-100 w-full max-w-lg rounded-lg overflow-hidden">
        <div className="flex min-h-[600px]">
          {/* Left side - Character Selection */}
          <div className="w-auto border-r border-gray-800 overflow-y-auto">
            <div className="flex flex-col p-4 gap-4">
              {tarotBots.map((bot) => (
                <button
                  key={bot.id}
                  onClick={() => setSelectedBot(bot)}
                  className={`flex items-center gap-4 p-2 rounded-lg transition-colors ${
                    selectedBot?.id === bot.id ? "bg-purple-200" : "hover:bg-purple-200"
                  }`}
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={bot.profileImage || "/placeholder.svg"}
                      alt={bot.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right side - Character Info */}
          <div className="flex flex-[3] flex-col p-6">
          <button
              onClick={() => {
                setIsClosing(true)
                setTimeout(() => {
                  onClose()
                  setIsClosing(false)
                }, 200)
              }}
              className="self-end text-gray-400 hover:text-gray-200"
            >
              ✕
            </button>
            {selectedBot && (
              <div className="flex flex-col flex-grow">
                <h1 className="mb-1 text-sm font-medium text-purple-400">{selectedBot.concept}</h1>
                <h2 className="mb-6 text-4xl font-bold text-purple-700">{selectedBot.name}</h2>



                {/* Character descriptions */}
                <div className="flex flex-col flex-grow">
                  <div className="flex-grow-[2] overflow-y-auto p-2 rounded-md">
                    <p className="text-sm text-gray-600">{selectedBot.description}</p>
                  </div>
                  <div className="flex-grow overflow-y-auto p-2 rounded-md mt-4">
                    <h3 className="mb-2 text-sm font-medium text-purple-400">{selectedBot.concept}</h3>
                    <p className="text-sm text-gray-600">{selectedBot.concept}</p>
                  </div>
                </div>

                {/* Rating */}
                {/* <div className="mt-4 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={index} className="text-yellow-300">
                      ★
                    </span>
                  ))}
                </div> */}
              </div>
            )}

            {/* Chat button */}
            <button
              className="mt-4 w-full py-2 bg-purple-400 text-white font-bold rounded hover:bg-purple-500 transition-colors"
              onClick={handleStartChat}
            >
              채팅 시작
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

