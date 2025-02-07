"use client"

import { useState } from "react"
import StarryBackground from "@/components/StarryBackground"

export default function TestStarryPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userConstellation, setUserConstellation] = useState<keyof typeof constellations | undefined>(undefined)

  const constellations = [
    "aries",
    "taurus",
    "gemini",
    "cancer",
    "leo",
    "virgo",
    "libra",
    "scorpio",
    "sagittarius",
    "capricorn",
    "aquarius",
    "pisces",
  ] as const

  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn)
    if (!isLoggedIn) {
      // 로그인 시 랜덤한 별자리 선택
      const randomConstellation = constellations[Math.floor(Math.random() * constellations.length)]
      setUserConstellation(randomConstellation)
    } else {
      setUserConstellation(undefined)
    }
  }

  const changeConstellation = () => {
    if (isLoggedIn) {
      const currentIndex = constellations.indexOf(userConstellation!)
      const nextIndex = (currentIndex + 1) % constellations.length
      setUserConstellation(constellations[nextIndex])
    }
  }

  return (
    <div className="relative min-h-screen">
      <StarryBackground isLoggedIn={isLoggedIn} userConstellation={userConstellation} />
      <div className="absolute top-4 left-4 space-y-4">
        <button onClick={toggleLogin} className="px-4 py-2 bg-blue-500 text-white rounded">
          {isLoggedIn ? "Logout" : "Login"}
        </button>
        {isLoggedIn && (
          <button onClick={changeConstellation} className="px-4 py-2 bg-green-500 text-white rounded">
            Change Constellation
          </button>
        )}
        <div className="text-white">Status: {isLoggedIn ? "Logged In" : "Logged Out"}</div>
        {isLoggedIn && <div className="text-white">Current Constellation: {userConstellation}</div>}
      </div>
    </div>
  )
}

