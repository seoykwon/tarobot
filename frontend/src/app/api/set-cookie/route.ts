// app/api/set-cookie/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL('/daily', request.url)); // 절대 URL 사용

  // 쿠키 설정 (HttpOnly, Secure 옵션 포함)
  response.cookies.set('isVisited', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // 프로덕션 환경에서만 Secure 설정
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1주일 동안 유효
  });

  return response;
}
