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
      console.error("Failed to fetch tarot records, using fallback data.");
      return []; // ✅ 실패 시 빈 배열 반환
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching tarot records:", error);
    return []; // ✅ 네트워크 오류 발생 시 빈 배열 반환
  }
}