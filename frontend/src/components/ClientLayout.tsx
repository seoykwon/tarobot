"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation" // 현재 경로 확인
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { SessionProvider } from "@/context/SessionContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  // 현재 경로 가져오기
  const pathname = usePathname()

  // 헤더와 사이드바를 숨길 경로 정의 (예: 로그인 페이지)
  const hideLayout = pathname === "/" || pathname === "/signup"

  useEffect(() => {
    setMounted(true)
    const handleResize = () => {
      const mobileView = window.innerWidth < 768
      setIsMobile(mobileView)
      if (mobileView) {
        setIsSidebarOpen(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev)
  }

  if (!mounted) {
    return null
  }

  // 특정 경로에서는 헤더와 사이드바를 숨김
  if (hideLayout) {
    return <div>{children}</div>
  }

  return (
    <SessionProvider> {/* ✅ 모든 컴포넌트에서 세션 업데이트를 감지할 수 있도록 감싸줌 */}
      <div className="flex min-h-screen bg-purple-100">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div
          className={`flex flex-col flex-1 transition-all duration-300 ${
            isMobile ? "w-full ml-0" : isSidebarOpen ? "ml-[240px]" : "ml-[72px]"
          }`}
        >
          <Header isSidebarOpen={isSidebarOpen} isMobile={isMobile} toggleSidebar={toggleSidebar} />
          <div className="flex-1 pt-14 overflow-hidden max-h-[100vh]">{children}</div>
        </div>
      </div>
    </SessionProvider>
  )
}
