import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import DarkModeToggle from "@/components/DarkModeToggle";
import StarryBackground from "@/components/StarryBackground";
import CherryBlossomBackground from "@/components/CherryBlossomBackground";
import SummerBackground from "@/components/SummerBackground";
import AutumnBackground from "@/components/AutumnBackground";
import WinterBackground from "@/components/WinterBackground";
import { cookies, headers } from "next/headers";
import type React from "react";

export const metadata: Metadata = {
  title: "타로봇",
  description: "AI 타로봇과 함께 운세를 확인해보세요!",
};

// 🟢 `getCurrentSeason`을 활용하여 계절 결정
function getCurrentSeason(): string {
  const now = new Date();
  const month = now.getMonth() + 1; // getMonth()는 0-11을 반환하므로 1을 더함

  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

// 🟢 `cookies()` 및 `headers()`를 사용하여 초기 데이터 설정
function getInitialProps() {
  const theme = cookies().get("theme")?.value || "light";
  let currentPath = "/";

  const referer = headers().get("referer");
  if (referer) {
    try {
      const url = new URL(referer);
      currentPath = url.pathname;
    } catch (error) {
      console.error("Invalid referer:", referer, error);
    }    
  }

  return { theme, currentPath };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { theme, currentPath } = getInitialProps();
  const season = getCurrentSeason();

  const getSeasonalBackground = () => {
    if (theme === "dark") return <StarryBackground />;

    switch (season) {
      case "spring":
        return <CherryBlossomBackground />;
      case "summer":
        return <SummerBackground />;
      case "autumn":
        return <AutumnBackground />;
      case "winter":
        return <WinterBackground />;
      default:
        return <CherryBlossomBackground />;
    }
  };

  return (
    <html lang="ko" className={theme === "dark" ? "dark" : ""}>
      <body className="bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
        {getSeasonalBackground()}
        <header className="p-4 relative flex items-center bg-accent-color">
          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-lg font-login-title">
            🌟 Tarot AI
          </h1>
          <div className="ml-auto">
            {/* DarkModeToggle은 클라이언트 사이드에서 테마 상태를 관리해야 함 */}
            <DarkModeToggle initialTheme={theme}/>
          </div>
        </header>
        <main className="p-6">{children}</main>
        <BottomNav currentPath={currentPath} />
      </body>
    </html>
  );
}
