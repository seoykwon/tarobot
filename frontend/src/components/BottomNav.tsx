"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Bot, Gamepad2, Book, User, MessageCircle, Users } from 'lucide-react'

import { cn } from "@/libs/utils"
import { Button } from "@/components/ui/Button"

const navItems = [
  {
    name: "홈",
    href: "/home",
    icon: Home
  },
  {
    name: "타로봇",
    href: "/tarot",
    icon: Bot
  },
  {
    name: "미니게임",
    href: "/game",
    icon: Gamepad2
  },
  {
    name: "다이어리",
    href: "/diary",
    icon: Book
  },
  {
    name: "마이페이지",
    href: "/my-page",
    icon: User
  },
  {
    name: "채팅",
    href: "/chat",
    icon: MessageCircle
  },
  {
    name: "커뮤니티",
    href: "/community",
    icon: Users
  }
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background">
      <nav className="flex h-16 items-center justify-around px-4">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.href}
              variant="ghost"
              className={cn(
                "flex h-full w-full flex-col items-center justify-center gap-1 p-0 font-normal",
                pathname === item.href && "text-primary font-medium"
              )}
              asChild
            >
              <Link href={item.href}>
                <Icon className="h-5 w-5" />
                <span className="text-xs">{item.name}</span>
              </Link>
            </Button>
          )
        })}
      </nav>
    </div>
  )
}

