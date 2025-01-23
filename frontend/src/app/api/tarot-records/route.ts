import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Spring Boot API 호출
    const response = await fetch("http://localhost:8080/api/tarot-records", {
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
