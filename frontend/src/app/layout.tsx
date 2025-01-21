import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { BottomNav } from "@/components/BottomNav"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: '타로봇',
  description: 'AI 타로봇과 함께 운세를 확인해보세요!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        {children}
        <BottomNav />
      </body>
    </html>
  )
}

