import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { API_URLS } from "@/config/api";

// Middleware 함수
export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  // Access Token이 없고 Refresh Token도 없으면 로그인 페이지로 리다이렉트
  if (!accessToken && !refreshToken) {
    const redirectUrl = new URL("/", request.url);
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname); // 현재 경로 저장
    return NextResponse.redirect(redirectUrl);
  }

  // Access Token 검증 및 Refresh Token 활용 로직
  const redirectResponse = await validateAndRefresh(request, accessToken, refreshToken);
  if (redirectResponse) return redirectResponse;

  // Access Token이 유효하면 요청 진행
  return NextResponse.next();
}

// 토큰 검증 및 Refresh Token으로 재발급 함수
async function validateAndRefresh(req: NextRequest, accessToken: string | undefined, refreshToken: string | undefined) {
  // 원래 요청의 쿠키 헤더 추출
  const cookie = req.headers.get("cookie") ?? "";

  // Access Token 검증
  if (accessToken) {
    const validateResponse = await fetch(API_URLS.TOKEN.VALIDATE, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
    });

    // Access Token이 유효하면 그대로 진행
    if (validateResponse.ok) return null;
  }

  // Refresh Token으로 Access Token 재발급 요청
  if (refreshToken) {
    try {
      const refreshResponse = await fetch(API_URLS.TOKEN.REFRESH, {
        method: "POST",
        credentials: "include", // 필수!
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshResponse.ok) {
        // 새 Access Token을 쿠키에 설정
        const setCookieHeader = refreshResponse.headers.get("set-cookie");
        const response = NextResponse.next();
        if (setCookieHeader) {
          response.headers.append("set-cookie", setCookieHeader);
        }
        return response;
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  }

  // Refresh Token도 유효하지 않으면 로그인 페이지로 리다이렉트
  const loginUrl = new URL("/", req.url);
  loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

// Middleware가 적용될 경로 설정
export const config = {
  matcher: [
    "/chat/:path*", // 동적 채팅 경로
  ],
};
