// "use client";

// import { useState } from "react";
// import { Flame, Star, Target, X } from "lucide-react";

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
// ];

// export default function CharacterSelect() {
//   const [selectedCharacter, setSelectedCharacter] = useState(characters[0]);

//   return (
//     <div className="flex w-full bg-gray-900 text-white" style={{ height: "calc(100dvh - 56px)" }}>
//       {/* Left side - Character Display */}
//       <div className="relative w-2/3 overflow-hidden">
//         {/* Character Image */}
//         <div className="absolute inset-0">
//           <img
//             src={selectedCharacter.image || "/placeholder.svg"}
//             alt={selectedCharacter.name}
//             className="h-full w-full object-cover"
//           />
//         </div>

//         {/* Character Selection Buttons - 이동된 부분 */}
//         <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-transparent p-2 rounded-lg">
//           {characters.map((character) => (
//             <button
//               key={character.id}
//               onClick={() => setSelectedCharacter(character)}
//               className={`w-20 h-20 rounded-md overflow-hidden ${
//                 selectedCharacter.id === character.id ? "ring-2 ring-yellow-300" : ""
//               }`}
//             >
//               <img
//                 src={character.thumbnail || "/placeholder.svg"}
//                 alt={character.name}
//                 className="w-full h-full object-cover"
//               />
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Right side - Character Info */}
//       <div className="flex w-1/3 flex-col p-6" style={{ height: "calc(100dvh - 56px)" }}>
//         <div className="mb-8 flex flex-col flex-grow">
//           <h1 className="mb-1 text-sm font-medium text-gray-400">{selectedCharacter.role}</h1>
//           <h2 className="mb-6 text-6xl font-bold text-yellow-300">{selectedCharacter.name}</h2>

//           {/* Specialty icons */}
//           <div className="mb-6 flex gap-4">
//             {selectedCharacter.specialties.map((specialty, index) => (
//               <div key={index} className="flex h-12 w-12 items-center justify-center bg-transparent rounded-md">
//                 {specialty === "INFO" && <Target className="h-6 w-6" />}
//                 {specialty === "C" && <Flame className="h-6 w-6" />}
//                 {specialty === "Q" && <Star className="h-6 w-6" />}
//                 {specialty === "E" && <Flame className="h-6 w-6" />}
//                 {specialty === "X" && <X className="h-6 w-6" />}
//               </div>
//             ))}
//           </div>

//           {/* Character descriptions */}
//           <div className="flex flex-col flex-grow">
//             <div className="flex-grow-[2] overflow-y-auto p-2 bg-transparent rounded-md">
//               <p className="text-sm text-gray-300">{selectedCharacter.description}</p>
//             </div>
//             <div className="flex-grow overflow-y-auto p-2 bg-transparent rounded-md mt-4">
//               <h3 className="mb-2 text-sm font-medium text-gray-400">{selectedCharacter.role}</h3>
//               <p className="text-sm text-gray-300">{selectedCharacter.roleDescription}</p>
//             </div>
//           </div>
//         </div>

//         {/* Chat button */}
//         <button className="mt-4 w-full py-2 bg-yellow-300 text-black font-bold rounded hover:bg-yellow-400 transition-colors">
//           채팅 시작
//         </button>
//       </div>
//     </div>
//   );
// }



// 채팅 시작 API 추가버전

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Flame, Star, Target, X } from 'lucide-react';
import Image from "next/image";
import { API_URLS } from "@/config/api";

const characters = [
  {
    id: 1,
    name: "미루",
    role: "타로리스트",
    description: "캐릭터 설명이 길어지면 스크롤이 가능해야 합니다.",
    roleDescription: "어느 분야에 특화되어 있는지 설명하는 영역입니다.",
    image: "/images/dummy1.png",
    specialties: ["INFO", "C", "Q", "E", "X"],
    thumbnail: "/images/dummy1.png",
  },
  {
    id: 2,
    name: "소라",
    role: "타로리스트",
    description: "이 캐릭터는 타로를 보는 특별한 능력을 가지고 있습니다.",
    roleDescription: "어느 분야에 특화되어 있는지 설명하는 영역입니다.",
    image: "/images/dummy2.png",
    specialties: ["INFO", "C", "Q", "E", "X"],
    thumbnail: "/images/dummy2.png",
  },
];

export default function CharacterSelect() {
  const [selectedCharacter, setSelectedCharacter] = useState(characters[0]);
  const router = useRouter();

  const handleStartChat = async () => {
    try {
      const initialMessage = "안녕하세요, 타로 상담을 시작하겠습니다.";
      const response = await fetch(API_URLS.CHAT.ENTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          botId: selectedCharacter.id, 
          title: initialMessage 
        }),
        credentials: "include",
      });

      if (!response.ok) throw new Error("세션 생성 실패");

      const data = await response.json();
      localStorage.setItem("sessionId", data.sessionId);
      localStorage.setItem("firstMessage", initialMessage);
      localStorage.setItem("botId", selectedCharacter.id.toString());

      router.push(`/chat/${data.sessionId}`);
    } catch (error) {
      console.error("채팅 시작 에러:", error);
      // 에러 처리 (예: 사용자에게 알림)
    }
  };

  return (
    <div className="flex w-full bg-gray-900 text-white" style={{ height: "calc(100dvh - 56px)" }}>
      {/* Left side - Character Display */}
      <div className="relative w-2/3 overflow-hidden">
        {/* Character Image */}
        <div className="absolute inset-0">
          <img
            src={selectedCharacter.image || "/placeholder.svg"}
            alt={selectedCharacter.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Character Selection Buttons - 이동된 부분 */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-transparent p-2 rounded-lg">
          {characters.map((character) => (
            <button
              key={character.id}
              onClick={() => setSelectedCharacter(character)}
              className={`w-20 h-20 rounded-md overflow-hidden ${
                selectedCharacter.id === character.id ? "ring-2 ring-yellow-300" : ""
              }`}
            >
              <img
                src={character.thumbnail || "/placeholder.svg"}
                alt={character.name}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Right side - Character Info */}
      <div className="flex w-1/3 flex-col p-6" style={{ height: "calc(100dvh - 56px)" }}>
        <div className="mb-8 flex flex-col flex-grow">
          <h1 className="mb-1 text-sm font-medium text-gray-400">{selectedCharacter.role}</h1>
          <h2 className="mb-6 text-6xl font-bold text-yellow-300">{selectedCharacter.name}</h2>

          {/* Specialty icons */}
          <div className="mb-6 flex gap-4">
            {selectedCharacter.specialties.map((specialty, index) => (
              <div key={index} className="flex h-12 w-12 items-center justify-center bg-transparent rounded-md">
                {specialty === "INFO" && <Target className="h-6 w-6" />}
                {specialty === "C" && <Flame className="h-6 w-6" />}
                {specialty === "Q" && <Star className="h-6 w-6" />}
                {specialty === "E" && <Flame className="h-6 w-6" />}
                {specialty === "X" && <X className="h-6 w-6" />}
              </div>
            ))}
          </div>

          {/* Character descriptions */}
          <div className="flex flex-col flex-grow">
            <div className="flex-grow-[2] overflow-y-auto p-2 bg-transparent rounded-md">
              <p className="text-sm text-gray-300">{selectedCharacter.description}</p>
            </div>
            <div className="flex-grow overflow-y-auto p-2 bg-transparent rounded-md mt-4">
              <h3 className="mb-2 text-sm font-medium text-gray-400">{selectedCharacter.role}</h3>
              <p className="text-sm text-gray-300">{selectedCharacter.roleDescription}</p>
            </div>
          </div>
        </div>

        {/* Chat button */}
        <button 
          className="mt-4 w-full py-2 bg-yellow-300 text-black font-bold rounded hover:bg-yellow-400 transition-colors"
          onClick={handleStartChat}
        >
          채팅 시작
        </button>
      </div>
    </div>
  );
}