import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "타로봇",
  description: "AI 타로봇과 함께 운세를 확인해보세요!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 현재 경로 가져오기 (Next.js App Router에서 headers 사용)
  const referer = headers().get("referer"); // 이전 페이지의 URL
  let currentPath = "/"; // 기본값


  if (referer) {
    try {
      const url = new URL(referer);
      currentPath = url.pathname; // 절대 경로 추출
    } catch (error) {
      console.error("Invalid referer:", referer);
    }
  }
  return (
    <html lang="ko">
      <body>
        {children}
        {/* BottomNav에 서버에서 가져온 currentPath 전달 */}
        <BottomNav currentPath={currentPath} />
      </body>
    </html>
  );
}
