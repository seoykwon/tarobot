// app/api/set-cookie/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.json({ message: 'Cookie has been set' });

  // 쿠키 설정
  response.cookies.set('hasVisited', 'true', {
    maxAge: 60 * 60 * 24 * 365, // 1년 (초 단위)
    path: '/', // 모든 경로에서 유효
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}
