"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      const mobileView = window.innerWidth < 768
      setIsMobile(mobileView)
      setIsSidebarOpen(!mobileView)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#f8f9fa]">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          isMobile ? "w-full ml-0" : isSidebarOpen ? "ml-[240px]" : "ml-[72px]"
        }`}
      >
        <Header isSidebarOpen={isSidebarOpen} />
        <div className="flex-1 pt-14 overflow-hidden">{children}</div>
      </div>
    </div>
  )
}