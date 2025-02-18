// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { getTarotMasters } from "@/libs/api"
// import Image from "next/image"
// import { useSession } from "@/context/SessionContext";

// interface TarotMaster {
//   id: number
//   name: string
//   description: string
//   concept: string
//   profileImage: string
//   mbti: string
// }

// interface TarotMasterListProps {
//   onOpenCharacterSelect: () => void
// }

// export default function TarotMasterList({ onOpenCharacterSelect }: TarotMasterListProps) {
//   const [tarotMasters, setTarotMasters] = useState<TarotMaster[]>([])
//   const router = useRouter()
//   const { setBotId, triggerSessionUpdate } = useSession();

//   useEffect(() => {
//     const fetchTarotMasters = async () => {
//       try {
//         const masters = await getTarotMasters()
//         setTarotMasters(masters.slice(0, 3))
//       } catch (error) {
//         console.error("타로 마스터 불러오기 실패:", error)
//       }
//     }

//     fetchTarotMasters()
//   }, [])

//   const handleSelectMaster = (masterId: number) => {
//     localStorage.setItem("botId", masterId.toString())
//     setBotId(masterId.toString());
//     triggerSessionUpdate();
//     router.push("/chat")
//   }

//   return (
//     <>
//       <ul className="space-y-4">
//         {tarotMasters.map((master) => (
//           <li
//             key={master.id}
//             className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-[#0D0D0D] cursor-pointer"
//             onClick={() => handleSelectMaster(master.id)}
//           >
//             {master.profileImage && (
//               <Image
//                 src={master.profileImage || "/placeholder.svg"}
//                 alt={`타로 마스터 ${master.name}`}
//                 width={40}
//                 height={40}
//                 className="rounded-full"
//               />
//             )}
//             <span className="truncate whitespace-nowrap overflow-hidden text-ellipsis min-w-0">
//               {master.name || `타로마스터 ${master.id}`}
//             </span>
//           </li>
//         ))}
//       </ul>
//       <button
//         onClick={onOpenCharacterSelect}
//         className="mt-4 w-full py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 p-3 rounded-lg flex items-center justify-start transition-colors"
//       >
//         더 많은 마스터 보기
//       </button>
//     </>
//   )
// }



// "use client";

// import { useState, useEffect, useRef } from "react";
// import Image from "next/image";
// import { Star } from "lucide-react";

// interface TarotMaster {
//   id: number;
//   name: string;
//   description: string;
//   concept: string;
//   profileImage: string;
//   mbti: string;
//   rating?: number;
// }

// interface TarotMasterListProps {
//   onOpenCharacterSelect: () => void;
// }

// // 더미 데이터
// const dummyTarotMasters: TarotMaster[] = [
//   {
//     id: 1,
//     name: "미스틱 세이지",
//     description:
//       "세상의 모든 것에는 고유한 의미가 있습니다. 제가 타로를 통해 진실된 의미를 찾아드리겠습니다.",
//     concept: "지혜로운 조언자",
//     profileImage: "/placeholder.svg",
//     mbti: "INFJ",
//     rating: 4,
//   },
//   {
//     id: 2,
//     name: "루나 드림웨이버",
//     description:
//       "당신의 꿈과 희망을 타로카드로 비춰드립니다. 함께 미래를 그려보아요.",
//     concept: "꿈의 안내자",
//     profileImage: "/placeholder.svg",
//     mbti: "ENFP",
//     rating: 5,
//   },
//   {
//     id: 3,
//     name: "크로노스 타임키퍼",
//     description:
//       "시간의 흐름 속에서 당신의 운명을 읽어드립니다. 과거, 현재, 미래를 연결하는 시간 여행을 시작해보세요.",
//     concept: "시간의 안내자",
//     profileImage: "/placeholder.svg",
//     mbti: "INTJ",
//     rating: 4,
//   },
// ];

// export default function TarotMasterList({ onOpenCharacterSelect }: TarotMasterListProps) {
//   const [tarotMasters] = useState<TarotMaster[]>(dummyTarotMasters);
//   const [selectedMaster, setSelectedMaster] = useState<TarotMaster | null>(null);
//   const [isClosing, setIsClosing] = useState(false); // 닫기 애니메이션 상태 추가
//   const sidePanelRef = useRef<HTMLDivElement>(null);

//   /** 🔹 마스터 클릭 시 패널 열거나 닫기 */
//   const handleSelectMaster = (master: TarotMaster) => {
//     if (selectedMaster?.id === master.id) {
//       setIsClosing(true); // 닫기 애니메이션 실행
//       setTimeout(() => {
//         setSelectedMaster(null);
//         setIsClosing(false);
//       }, 200); // 200ms 후 실제로 패널 닫기
//     } else {
//       setSelectedMaster(master);
//     }
//   };

//   /** 🔹 패널 외부 클릭 시 닫기 */
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (sidePanelRef.current && !sidePanelRef.current.contains(event.target as Node)) {
//         setIsClosing(true);
//         setTimeout(() => {
//           setSelectedMaster(null);
//           setIsClosing(false);
//         }, 200);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <div className="relative">
//       <div className="space-y-4">
//         {tarotMasters.map((master) => (
//           <button
//             key={master.id}
//             onClick={() => handleSelectMaster(master)}
//             className={`flex items-center w-full p-3 rounded-lg hover:bg-gray-100 text-[#0D0D0D] ${
//               selectedMaster?.id === master.id ? "bg-gray-100" : ""
//             }`}
//           >
//             <Image
//               src={master.profileImage || "/placeholder.svg"}
//               alt={`타로 마스터 ${master.name}`}
//               width={40}
//               height={40}
//               className="rounded-full mr-3"
//             />
//             <span className="flex-grow text-left">{master.name}</span>
//           </button>
//         ))}
//         <button
//           onClick={onOpenCharacterSelect}
//           className="mt-4 w-full py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 p-3 rounded-lg flex items-center justify-start transition-colors"
//         >
//           더 많은 마스터 보기
//         </button>
//       </div>

//       {selectedMaster && (
//         <div
//           ref={sidePanelRef}
//           className={`fixed left-64 top-1/2 -translate-y-1/2 h-[250px] w-[420px] bg-[#1a1a1a] text-white p-2 z-10 overflow-y-auto rounded-lg transition-transform duration-300 ${
//             isClosing ? "opacity-0 translate-x-10" : "opacity-100 translate-x-0"
//           }`}
//           style={{ maxHeight: "90vh" }}
//         >
//           <div className="space-y-4">
//             <div>
//               <h3 className="text-sm text-gray-400 mb-1">소개</h3>
//               <h2 className="text-2xl font-bold text-yellow-400">{selectedMaster.name}</h2>
//             </div>

//             <p className="text-sm text-gray-300 leading-relaxed">{selectedMaster.description}</p>

//             <div className="flex items-center gap-1">
//               {Array.from({ length: 5 }).map((_, index) => (
//                 <Star
//                   key={index}
//                   className={`h-5 w-5 ${
//                     index < (selectedMaster.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
//                   }`}
//                 />
//               ))}
//             </div>

//             <button
//               onClick={() => console.log(`채팅 시작: 마스터 ID ${selectedMaster.id}`)}
//               className="w-full py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors mt-8"
//             >
//               채팅 시작
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


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
    router.push("/chat")
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
            className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-[#0D0D0D] cursor-pointer ${
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
        className="mt-4 w-full py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 p-3 rounded-lg flex items-center justify-start transition-colors"
      >
        더 많은 마스터 보기
      </button>

      {selectedMaster && (
        <div
          ref={sidePanelRef}
          className={`fixed left-64 top-1/2 -translate-y-1/2 h-[250px] w-[420px] bg-[#1a1a1a] text-white p-2 z-10 overflow-y-auto rounded-lg transition-transform duration-300 ${
            isClosing ? "opacity-0 translate-x-10" : "opacity-100 translate-x-0"
          }`}
          style={{ maxHeight: "90vh" }}
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-sm text-gray-400 mb-1">{selectedMaster.concept}</h3>
              <h2 className="text-2xl font-bold text-yellow-400">{selectedMaster.name}</h2>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed">{selectedMaster.description}</p>

            <div className="flex flex-wrap gap-2">
              {selectedMaster.expertise.map((exp, index) => (
                <span key={index} className="px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300">
                  {exp}
                </span>
              ))}
            </div>

            <button
              onClick={() => handleStartChat(selectedMaster.id)}
              className="w-full py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors mt-8"
            >
              채팅 시작
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

