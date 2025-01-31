import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');
  
  try {
    // Spring Boot 검색 API 호출
    const response = await fetch(`http://localhost:8080/api/posts/search?query=${query}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Search failed:", error);
    return NextResponse.json({ error: "Failed to search posts" }, { status: 500 });
  }
}
