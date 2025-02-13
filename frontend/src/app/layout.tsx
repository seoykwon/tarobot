"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth < 768
      setIsMobile(mobileView)
      setIsSidebarOpen(!mobileView)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <html lang="ko">
      <body className="flex min-h-screen bg-[#f8f9fa]">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        {/* Main Content */}
        <div
          className={`flex flex-col flex-1 transition-all duration-300 ${
            isMobile ? "w-full ml-0" : isSidebarOpen ? "ml-[240px]" : "ml-[72px]"
          }`}
        >
          {/* Header */}
          <Header isSidebarOpen={isSidebarOpen} />

          {/* Content Area */}
          <div className="flex-1 pt-14 overflow-hidden">{children}</div>
        </div>
      </body>
    </html>
  )
}

