"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { LoadingSpinner } from "@/components/Loading"
import { User, Settings, LogOut } from "lucide-react"
import { cookies } from "next/headers";

interface TarotRecord {
  id: number
  date: string
  question: string
  result: string
}

export default function MyPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [tarotRecords, setTarotRecords] = useState<TarotRecord[]>([])

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        // 실제 API 호출 대신 localStorage 체크
        const isLoggedIn = localStorage.getItem("isLoggedIn")
        

        // 의도적 지연
        await new Promise((resolve) => setTimeout(resolve, 500))

        if (!isLoggedIn) {
          router.push("/auth/login")
          return
        }
        // 타로 기록 가져오기
        try {
          const response = await fetch("/api/tarot-records", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })

          if (response.ok) {
            const data = await response.json()
            setTarotRecords(data)
          }
        } catch (error) {
          console.error("Failed to fetch tarot records:", error)
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push("/auth/login")
      }
    }

    checkAuthAndFetchData()
  }, [router])

  const handleLogout = async () => {
    try {
      // 백엔드로 로그아웃 요청청
    const response = await fetch('http://localhost:8080/api/auth/logout', {
      method: 'POST',
      credentials: 'include', // 쿠키 포함
    });
    if (response.ok) {
      // 로그아웃 성공 시 로그인인으로 리다이렉트
      router.push('/auth/login');
    } else {
      console.error('Failed to log out');
    }
    } catch (error) {
      console.error('Error logging out:', error);
    }
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
            <h1 className="font-tarobot-title">사용자님</h1>
            <p className="font-article-author text-muted-foreground">example@email.com</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <h2 className="font-tarobot-title">나의 활동</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="ghost"
                className="w-full justify-start font-tarobot-description"
                onClick={() => router.push("/my-page/editprofile")}
              >
                <LogOut className="mr-2 h-4 w-4" />
                개인정보 수정
              </Button>
              <Button variant="ghost" className="w-full justify-start font-tarobot-description" onClick={() => router.push("/my-page/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                설정
              </Button>
              <Button variant="ghost" className="w-full justify-start font-tarobot-description" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                로그아웃
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="font-tarobot-title">최근 타로 기록</h2>
                <Button
                  variant="link"
                  className="p-0 h-auto font-normal font-article-author"
                  onClick={() => router.push("/diary")}
                >
                  [더보기]
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {tarotRecords.length > 0 ? (
                <div className="space-y-4">
                  {tarotRecords.slice(0, 5).map((record) => (
                    <div key={record.id} className="border-b pb-2 last:border-0">
                      <div className="flex justify-between items-center">
                        <p className="font-medium">{record.question}</p>
                        <span className="text-sm text-muted-foreground">
                          {new Date(record.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{record.result}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-tarobot-description text-muted-foreground">아직 타로 기록이 없습니다.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

