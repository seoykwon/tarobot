// libs/api.ts
import { API_URLS } from "@/config/api";

export async function getTarotMasters() {
  try {
    const response = await fetch(API_URLS.TAROTBOTS.LIST, {
      method: "GET",
      credentials: "include", // 인증 쿠키 등을 사용한다면 필요
    });
    
    if (!response.ok) {
      throw new Error("타로 마스터 데이터를 불러오지 못했습니다.");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("타로 마스터 불러오기 에러:", error);
    return [];
  }
}

export async function getSessionList(botId?: string) {
  try {
    // botId가 전달되면 URL 쿼리 파라미터로 포함시킵니다.
    const url = botId
      ? `${API_URLS.USER.SESSIONLIST}/${botId}`
      : API_URLS.USER.SESSIONLIST;

    const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      }
    );
    
    if (!response.ok) {
      throw new Error("세션 리스트 데이터를 불러오지 못했습니다.");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("세션 리스트 불러오기 에러:", error);
    return [];
  }
}