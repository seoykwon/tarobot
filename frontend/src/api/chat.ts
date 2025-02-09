import { API_URLS } from "@/config/api";

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
