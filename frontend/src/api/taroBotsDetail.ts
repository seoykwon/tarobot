// src/api/tarobotDetails.ts
import { API_URLS } from "@/config/api";

export interface Review {
  id: number;
  author: string;
  rating: number;
  content: string;
  date: string;
}

export interface TarobotDetails {
  id: number;
  name: string;
  description: string;
  concept: string;
  mbti: string;
  profileImage: string;
  expertise: string[];
  reviews: Review[];
}

// 더미 데이터
const dummyTarobotDetails: TarobotDetails = {
  id: 1,
  name: "테스트 타로봇",
  description: "당신의 고민을 함께 나눌 준비가 되어있습니다.",
  concept: "따뜻한 상담가",
  mbti: "INFJ",
  profileImage: "/example.jpg",
  expertise: ["연애", "진로", "인간관계"],
  reviews: [
    {
      id: 1,
      author: "테스트 유저",
      rating: 5,
      content: "정말 도움이 많이 되었습니다!",
      date: "2024-02-07",
    },
    {
      id: 2,
      author: "테스트 유저",
      rating: 5,
      content: "정말 도움이 많이 되었습니다!",
      date: "2024-02-07",
    },
    {
      id: 3,
      author: "테스트 유저",
      rating: 5,
      content: "정말 도움이 많이 되었습니다!",
      date: "2024-02-07",
    },
  ],
};

// Spring Boot API에서 챗봇 상세 정보 가져오기
export const fetchTarobotDetails = async (
  id: number
): Promise<TarobotDetails | null> => {
  try {
    const response = await fetch(API_URLS.TAROTBOTS.DETAILS(id),
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch chatbot details for ID ${id}`);
      return dummyTarobotDetails; // 테스트를 위해 API 호출 실패 시 더미 데이터 반환
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching chatbot details:", error);
    return dummyTarobotDetails; // 테스트를 위해 에러 발생 시 더미 데이터 반환
  }
};
