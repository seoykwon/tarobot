import { NextResponse } from "next/server";

export async function GET() {
  const kakaoAuthUrl = "https://kauth.kakao.com/oauth/authorize";
  const redirectUri = "http://localhost:3000/api/auth/kakao/callback";
  
  return NextResponse.redirect(
    `${kakaoAuthUrl}?client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code`
  );
}
