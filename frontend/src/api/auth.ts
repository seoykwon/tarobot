// src/api/auth.ts
import { API_URLS } from "@/config/api";

export const googleLoginRequest = async () => {
  try {
    const response = await fetch(API_URLS.AUTH.GOOGLE, {
      method: "GET",
      credentials: "include", // HttpOnly 쿠키 포함
    });

    if (!response.ok) {
      throw new Error("Google 로그인 실패");
    }

    return response.json(); // 백엔드에서 처리된 결과 반환
  } catch (error) {
    console.error("Error during Google login request:", error);
    throw error;
  }
};

export const kakaoLoginRequest = async () => {
  try {
    const response = await fetch(API_URLS.AUTH.KAKAO, {
      method: "GET",
      credentials: "include", // HttpOnly 쿠키 포함
    });

    if (!response.ok) {
      throw new Error("Kakao 로그인 실패");
    }

    return response.json(); // 백엔드에서 처리된 결과 반환
  } catch (error) {
    console.error("Error during Kakao login request:", error);
    throw error;
  }
};

export const loginRequest = async (id: string, password: string) => {
  try {
    const response = await fetch(API_URLS.AUTH.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // HttpOnly 쿠키 포함
      body: JSON.stringify({ id, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "로그인 실패");
    }

    return response.json(); // Access Token 등 응답 데이터 반환
  } catch (error) {
    console.error("Error during login request:", error);
    throw error;
  }
};
