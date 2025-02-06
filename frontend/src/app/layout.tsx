import type { Metadata } from "next"
import "./globals.css"
import BottomNav from "@/components/BottomNav"
import DarkModeToggle from "@/components/DarkModeToggle"
import StarryBackground from "@/components/StarryBackground"
import CherryBlossomBackground from "@/components/CherryBlossomBackground"
import { cookies, headers } from "next/headers"
import type React from "react"

export const metadata: Metadata = {
  title: "타로봇",
  description: "AI 타로봇과 함께 운세를 확인해보세요!",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const theme = cookies().get("theme")?.value || "light"
  const isLoggedIn = cookies().get("access_token") !== undefined

  let currentPath = "/"
  const referer = headers().get("referer")

  if (referer) {
    try {
      const url = new URL(referer)
      currentPath = url.pathname
    } catch (error) {
      console.error("Invalid referer:", referer)
    }
  }

  return (
    <html lang="ko" className={theme === "dark" ? "dark" : ""}>
      <body className="bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
        {theme === "dark" ? <StarryBackground isLoggedIn={isLoggedIn} /> : <CherryBlossomBackground />}
        <header className="p-4 relative flex items-center bg-accent-color">
          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-lg font-login-title">🌟 Tarot AI</h1>
          <div className="ml-auto">
            <DarkModeToggle initialTheme={theme} />
          </div>
        </header>
        <main className="p-6">{children}</main>
        <BottomNav currentPath={currentPath} />
      </body>
    </html>
  )
}

