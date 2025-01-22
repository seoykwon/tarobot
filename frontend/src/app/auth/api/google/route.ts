import { NextResponse } from "next/server";

export async function GET() {
  const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const redirectUri = "http://localhost:3000/api/auth/google/callback";

  return NextResponse.redirect(
    `${googleAuthUrl}?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=email profile`
  );
}
