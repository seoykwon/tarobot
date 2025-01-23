// app/api/chat/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Spring Boot API 호출
    const response = await fetch("http://localhost:8080/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch from Spring Boot");
    }

    const data = await response.json();
    return NextResponse.json({ reply: data.reply });
  } catch (error) {
    console.error("Error in chat API route:", error);
    return NextResponse.json({ error: "Failed to process the request" }, { status: 500 });
  }
}
