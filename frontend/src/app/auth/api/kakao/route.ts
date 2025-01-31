import { NextResponse } from "next/server";

export async function GET() {
  const backendAuthUrl = "http://localhost:8080/api/auth/kakao"; // 백엔드의 kakao OAuth 엔드포인트

  // 백엔드로 리다이렉트
  return NextResponse.redirect(backendAuthUrl);
}
