import { API_URLS } from "@/config/api";
import { NextResponse } from "next/server";

export async function sendChatMessage(sessionId: string, message: string, type: string) {
  try {
    const response = await fetch(API_URLS.CHAT.STREAM(sessionId, message, type), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch response from server");
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending chat message:", error);
    return { answer: "오류가 발생했습니다." };
  }
}

export async function closeChatSession(userId: number) {
  try {
    const response = await fetch(API_URLS.CHAT.CLOSE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    return response.ok;
  } catch (error) {
    console.error("Error closing chat session:", error);
    return false;
  }
}

/** Next.js API Route 핸들러 (서버용) */
export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const response = await fetch(API_URLS.CHAT.SEND_MESSAGE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch from Spring Boot");
    }

    const data = await response.json();
    return NextResponse.json({ reply: data.reply });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json({ error: "Failed to process the request" }, { status: 500 });
  }
}
