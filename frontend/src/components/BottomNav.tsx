import Link from "next/link";
import { Home, Bot, Gamepad2, Book, User, Users } from "lucide-react";

import { cn } from "@/libs/utils";
import { Button } from "@/components/ui/Button";

const navItems = [
  {
    name: "홈",
    href: "/home",
    icon: Home,
  },
  {
    name: "타로봇",
    href: "/tarot",
    icon: Bot,
  },
  {
    name: "미니게임",
    href: "/game",
    icon: Gamepad2,
  },
  {
    name: "다이어리",
    href: "/diary",
    icon: Book,
  },
  {
    name: "마이페이지",
    href: "/my-page",
    icon: User,
  },
  {
    name: "커뮤니티",
    href: "/community",
    icon: Users,
  },
];

export default function BottomNav({ currentPath }: { currentPath: string }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t backdrop-blur-lg bg-opacity-90 shadow-lg">
      <nav className="flex h-16 items-center justify-around px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href;

          return (
            <Button
              key={item.href}
              variant="ghost"
              className={cn(
                "relative flex h-full w-full flex-col items-center justify-center gap-1 p-0 font-normal",
                isActive && "text-[var(--text-color)] font-medium"
              )}
              asChild
            >
              <Link href={item.href} className="relative px-2 py-1 rounded-lg">
                <Icon className={cn("h-5 w-5", isActive && "text-[var(--text-color)]")} />
                <span className="text-[var(--text-color)] text-xs">{item.name}</span>
              </Link>
            </Button>
          );
        })}
      </nav>
    </div>
  );
}
