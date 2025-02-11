import { API_URLS } from "@/config/api";

// src/api/chatbots.ts
export interface Review {
    id: number;
    author: string;
    rating: number;
    content: string;
    date: string;
  }
  
  export interface tarobotDetails {
    id: number;
    name: string;
    description: string;
    concept: string;
    mbti: string;
    profileImage: string;
    expertise: [string];
    reviews: Review[];
  }
  
  // Spring Boot API에서 챗봇 상세 정보 가져오기
  export const fetchTarobotDetails = async (id: number): Promise<tarobotDetails | null> => {
    try {
      const response = await fetch(API_URLS.TAROTBOTS.DETAILS(id), {
        cache: "no-store", // 매 요청마다 최신 데이터 가져오기
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        console.error(`Failed to fetch chatbot details for ID ${id}`);
        return null;
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error fetching chatbot details:", error);
      return null;
    }
  };
  