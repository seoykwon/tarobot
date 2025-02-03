"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CardSelector from "./card-selector";
import Image from "next/image";

// 토큰 유효성 검증 및 리프레시 함수
async function validateAndRefresh() {
  try {
    // access_token 검증 요청
    const validateResponse = await fetch(`http://127.0.0.1:8080/api/v1/token/validate`, {
      method: "GET",
      credentials: "include", // 쿠키 포함
      headers: {
        "Content-Type": "application/json",
      },
    });

    // access_token이 유효하지 않은 경우 refresh 요청
    if (!validateResponse.ok) {
      const refreshResponse = await fetch(`http://127.0.0.1:8080/api/v1/token/refresh`, {
        method: "POST",
        credentials: "include", // 쿠키 포함
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!refreshResponse.ok) {
        throw new Error("Token refresh failed");
      }
    }

    return true; // 토큰이 유효하거나 새로 발급된 경우
  } catch (error) {
    console.error("Error during token validation or refresh:", error);
    return false; // 유효하지 않은 경우
  }
}

export default function FirstVisitPage() {
  const [showCardSelector, setShowCardSelector] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 추가
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const isValid = await validateAndRefresh(); // 토큰 검증 및 갱신 호출
      setIsLoggedIn(isValid); // 로그인 상태 업데이트
    };

    checkLoginStatus();
  }, []);

  const handleCardSelect = async (cardNumber: number) => {
    setShowCardSelector(false);
    setSelectedCard(cardNumber);
    setIsLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8000/chat/stream?session_id=12345&user_input=majortarotcard_${cardNumber}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.body) throw new Error("ReadableStream not supported");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let botMessageText = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        botMessageText += decoder.decode(value);
      }

      setResult(botMessageText);

      // 결과를 백엔드로 전송하여 DB에 저장
      const userId = document.cookie
        .split("; ")
        .find((row) => row.startsWith("user_id="))
        ?.split("=")[1];

      await fetch("/api/save-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardNumber,
          result: botMessageText,
          userId: userId || null, // 로그인한 사용자 ID 또는 null
        }),
      });
    } catch (error) {
      console.error("Error:", error);
      setResult("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4 pb-40">
      {!result && (
        <>
          <h1 className="text-4xl mb-4 text-center">안녕하세요!</h1>
          <p className="text-lg mb-8 text-center">
            오늘의 타로 점을 봐 드릴게요!
          </p>
          <button
            onClick={() => setShowCardSelector(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg"
          >
            타로 점 보기
          </button>
        </>
      )}

      {result && (
        <div className="text-center">
          <h2 className="text-2xl mb-4">타로 점 결과</h2>
          {selectedCard !== null && (
            <Image
              src={`/basic/maj${selectedCard}.svg`}
              alt={`Selected tarot card ${selectedCard}`}
              width={192}
              height={268}
              className="mt-2 mx-auto"
            />
          )}
          <p className="text-lg mt-4">{result}</p>

          {isLoggedIn ? (
            <button
              onClick={() => router.push("/home")}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg mt-6"
            >
              홈으로 이동
            </button>
          ) : (
            <button
              onClick={() => router.push("/auth/login")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg mt-6"
            >
              로그인
            </button>
          )}
        </div>
      )}

      {isLoading && (
        <div className="mt-4">
          <p className="text-lg">결과를 가져오는 중입니다...</p>
        </div>
      )}

      {showCardSelector && (
        <CardSelector
          onCardSelect={handleCardSelect}
          onClose={() => setShowCardSelector(false)}
        />
      )}
    </div>
  );
}
