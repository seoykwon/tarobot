import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware 함수
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // `/tarot/chat/[id]`와 같은 동적 경로 처리
  if (pathname.startsWith("/tarot/chat")) {
    const token = req.cookies.get("jwtToken");

    // JWT 토큰이 없으면 로그인 페이지로 리다이렉트
    if (!token) {
      const loginUrl = new URL("/auth/login", req.url); // 로그인 페이지 경로
      return NextResponse.redirect(loginUrl);
    }
  }

  // 다른 보호된 경로 처리 (예: 마이페이지, 글 작성, 다이어리)
  const protectedRoutes = [
    "/my-page",
    "/community/write",
    "/diary",
  ];

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const token = req.cookies.get("access_token");
    //const token = req.cookies.get("refresh_token");
    // access_token은 없는데 refresh_token은 있으면 /api/token으로 재발급 요청 보내는 로직 추가

    if (!token) {
      const loginUrl = new URL("/auth/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next(); // 요청을 그대로 전달
}

// Middleware가 작동할 경로 설정
export const config = {
  matcher: [
    "/tarot/chat/:path*", // 동적 채팅 경로
    "/my-page/:path*", // 마이페이지 관련 모든 경로
    "/community/write", // 글 작성 페이지
    "/diary/:path*", // 다이어리 관련 모든 경로
  ],
};
