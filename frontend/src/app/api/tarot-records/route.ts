// app/api/tarot-records/route.ts
import { NextResponse } from "next/server";
import { API_URLS } from "@/config/api";

export async function GET() {
  try {
    // Spring Boot API 호출 (환경변수에서 가져오기)
    const response = await fetch(API_URLS.TAROT_RECORDS, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tarot records");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in tarot records API route:", error);
    return NextResponse.json({ error: "Failed to fetch tarot records" }, { status: 500 });
  }
}
