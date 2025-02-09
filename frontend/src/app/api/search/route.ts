// app/api/search/route.ts
import { NextResponse } from "next/server";
import { API_URLS } from "@/config/api";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  try {
    // Spring Boot 검색 API 호출 (환경변수에서 가져오기)
    const response = await fetch(API_URLS.SEARCH(query || ""), {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch search results");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Search failed:", error);
    return NextResponse.json({ error: "Failed to search posts" }, { status: 500 });
  }
}
