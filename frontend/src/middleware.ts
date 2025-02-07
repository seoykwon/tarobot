import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";



// Middleware 함수
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // `/tarot/chat/[id]`와 같은 동적 경로 처리
  if (pathname.startsWith("/tarot/chat")) {
    // const token = req.cookies.get("access_token");

    // // JWT 토큰이 없으면 로그인 페이지로 리다이렉트
    // if (!token) {
    //   const loginUrl = new URL("/auth/login", req.url); // 로그인 페이지 경로
    //   return NextResponse.redirect(loginUrl);
    // }

    // ✅ 검증 및 재발급
    const redirectResponse = await validateAndRefresh(req);
    if (redirectResponse) return redirectResponse;
  }

  // 다른 보호된 경로 처리 (예: 마이페이지, 글 작성, 다이어리)
  const protectedRoutes = [
    "/my-page",
    "/community/write",
    "/diary",
  ];

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    // const token = req.cookies.get("access_token");
    // //const token = req.cookies.get("refresh_token");

    // if (!token) {
    //   const loginUrl = new URL("/auth/login", req.url);
    //   return NextResponse.redirect(loginUrl);
    // }

    // ✅ 검증 및 재발급
    const redirectResponse = await validateAndRefresh(req);
    if (redirectResponse) return redirectResponse;
  }

  return NextResponse.next(); // 요청을 그대로 전달
}

// 토큰이 없을 경우 실행 될 유효성 검증 & 리프레쉬 토큰으로 재발급 함수
async function validateAndRefresh(req: NextRequest) {
  // 원래 요청의 쿠키 헤더 추출
  const cookie = req.headers.get("cookie") ?? "";

  // access_token 검증 요청 (쿠키 헤더 전달)
  const validateResponse = await fetch(`http://127.0.0.1:8080/api/v1/token/validate`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Cookie": cookie,
    },
  });

  // access_token이 유효하지 않으면 refresh 요청
  if (!validateResponse.ok) {
    // 아래 refresh_token도 동일하게 전달 (쿠키에 저장되어 있다면)
    const refreshToken = req.cookies.get("refresh_token")?.value;
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    
    const refreshResponse = await fetch(`http://127.0.0.1:8080/api/v1/token/refresh`, {
      method: "POST",
      credentials: "include", // 필수!
      headers: {
        "Content-Type": "application/json",
        // "Cookie": cookie,
      },
      // refresh API는 JSON body를 요구합니다.
      body: JSON.stringify({ refreshToken }),
    });

    if (!refreshResponse.ok) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  return null; // 토큰이 유효한 경우 그대로 진행
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
