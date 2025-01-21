"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { LoadingSpinner } from "@/components/Loading"
import { User, Settings, History, LogOut } from "lucide-react"

export default function MyPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 실제 API 호출 대신 localStorage 체크
        const isLoggedIn = localStorage.getItem("isLoggedIn")

        // 의도적 지연
        await new Promise((resolve) => setTimeout(resolve, 500))

        if (!isLoggedIn) {
          router.push("/login")
          return
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    router.push("/login")
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <main className="min-h-screen pb-16">
      <div className="p-4">
        {/* Profile Section */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">사용자님</h1>
            <p className="text-sm text-muted-foreground">example@email.com</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <h2 className="font-semibold">나의 활동</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/my-page/history")}>
                <History className="mr-2 h-4 w-4" />
                타로 히스토리
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/my-page/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                설정
              </Button>
              <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                로그아웃
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="font-semibold">최근 타로 기록</h2>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">아직 타로 기록이 없습니다.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

