"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { LoadingSpinner } from "@/components/Loading"

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const hasVisited = localStorage.getItem("hasVisited")

        // Add intentional delay for smooth transition
        await new Promise((resolve) => setTimeout(resolve, 1000))

        if (hasVisited) {
          router.push("/home")
          return
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Auth check failed:", error)
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  // 로딩 중일 때
  if (isLoading) {
    return <LoadingSpinner />
  }

  // 첫 방문자를 위한 시작 화면
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[320px] flex flex-col items-center gap-6">
        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-zinc-900 flex items-center justify-center">
          <div className="text-6xl">🔮</div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white">Tarot Journey</h1>
          <p className="text-gray-400">Explore the mystical</p>
        </div>

        <Button
          className="w-full bg-fuchsia-500 hover:bg-fuchsia-600 text-white py-6"
          onClick={() => {
            localStorage.setItem("hasVisited", "true")
            router.push("/home")
          }}
        >
          시작하기
        </Button>
      </div>
    </div>
  )
}
