"use client"

import { useState } from "react"
import { Flame, Star, Target, X } from "lucide-react"

const characters = [
  {
    id: 1,
    name: "미루",
    role: "타로리스트",
    description:
      "캐릭터 설명",
    roleDescription:
      "어느 분야에 특화되어 있는지지",
    image: "/images/dummy1.png",
    specialties: ["INFO", "C", "Q", "E", "X"],
    thumbnail: "/images/dummy1.png",
  },
  {
    id: 2,
    name: "소라",
    role: "타로리스트",
    description:
      "캐릭터 설명",
    roleDescription:
      "어느 부냥에 특화되어 있는지",
    image: "/images/dummy2.png",
    specialties: ["INFO", "C", "Q", "E", "X"],
    thumbnail: "/images/dummy2.png",
  },
]

export default function CharacterSelect() {
  const [selectedCharacter, setSelectedCharacter] = useState(characters[0])

  return (
    <div className="flex h-full w-full bg-gray-900 text-white">
      {/* Left side - Character Display */}
      <div className="relative w-2/3 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={selectedCharacter.image || "/placeholder.svg"}
            alt={selectedCharacter.name}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Right side - Character Info */}
      <div className="flex w-1/3 flex-col p-6">
        <div className="mb-8">
          <h1 className="mb-1 text-sm font-medium text-gray-400">{selectedCharacter.role}</h1>
          <h2 className="mb-6 text-6xl font-bold text-yellow-300">{selectedCharacter.name}</h2>

          {/* specialty icons */}
          <div className="mb-6 flex gap-4">
            {selectedCharacter.specialties.map((specialty, index) => (
              <div key={index} className="flex h-12 w-12 items-center justify-center bg-gray-800 rounded-md">
                {specialty === "INFO" && <Target className="h-6 w-6" />}
                {specialty === "C" && <Flame className="h-6 w-6" />}
                {specialty === "Q" && <Star className="h-6 w-6" />}
                {specialty === "E" && <Flame className="h-6 w-6" />}
                {specialty === "X" && <X className="h-6 w-6" />}
              </div>
            ))}
          </div>

          {/* Character descriptions */}
          <div className="space-y-4">
            <p className="text-sm text-gray-300">{selectedCharacter.description}</p>
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-400">{selectedCharacter.role}</h3>
              <p className="text-sm text-gray-300">{selectedCharacter.roleDescription}</p>
            </div>
          </div>
        </div>

        {/* Character grid */}
        <div className="mt-auto">
          <div className="flex gap-2 justify-center">
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

        {/* Chat button */}
        <button className="mt-4 w-full py-2 bg-yellow-300 text-black font-bold rounded hover:bg-yellow-400 transition-colors">
          채팅 시작
        </button>
      </div>
    </div>
  )
}

