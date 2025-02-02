import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import DarkModeToggle from "@/components/DarkModeToggle";
import { cookies, headers } from "next/headers";

export const metadata: Metadata = {
  title: "타로봇",
  description: "AI 타로봇과 함께 운세를 확인해보세요!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // SSR에서 다크 모드 상태 확인
  const theme = cookies().get("theme")?.value || "light";

  // 서버에서 이전 페이지 URL 가져오기 (Referer 헤더 확인)
  let currentPath = "/";
  const referer = headers().get("referer");

  if (referer) {
    try {
      const url = new URL(referer);
      currentPath = url.pathname; // 절대 경로 추출
    } catch (error) {
      console.error("Invalid referer:", referer);
    }
  }

  return (
    <html lang="ko" className={theme === "dark" ? "dark" : ""}>
      <body>
        <header className="p-4 relative flex items-center bg-accent-color dark:bg-gray-900">
          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-lg font-login-title">
          🌟 Tarot AI
          </h1>
          <div className="ml-auto">
            <DarkModeToggle initialTheme={theme} />
          </div>
        </header>
        <main className="p-6">{children}</main>
        {/* BottomNav에 서버에서 가져온 currentPath 전달 */}
        <BottomNav currentPath={currentPath} />
      </body>
    </html>
  );
}
