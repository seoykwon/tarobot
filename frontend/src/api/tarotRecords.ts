// src/api/tarotRecords.ts
import { API_URLS } from "@/config/api";

export async function fetchTarotRecords() {
  try {
    const response = await fetch(API_URLS.TAROT.RECORDS, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // 항상 최신 데이터 가져오기
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tarot records");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching tarot records:", error);
    return { error: "Failed to fetch tarot records" };
  }
}
