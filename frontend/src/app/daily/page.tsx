"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CardSelector from "./card-selector";
import Image from "next/image";

export default function FirstVisitPage() {
  const [showCardSelector, setShowCardSelector] = useState(false); // 카드 선택 창 표시 여부
  const [result, setResult] = useState<string | null>(null); // AI 응답 결과
  const [selectedCard, setSelectedCard] = useState<number | null>(null); // 선택된 카드 번호
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const router = useRouter();

  const handleCardSelect = async (cardNumber: number) => {
    setShowCardSelector(false); // 카드 선택 창 닫기
    setSelectedCard(cardNumber); // 선택된 카드 번호 저장
    setIsLoading(true);

    try {
      // AI에게 카드 번호를 전달하여 결과 요청
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

      // AI 응답 결과 저장
      setResult(botMessageText);

      // 타로 데이터 localStorage에 저장
      localStorage.setItem(
        "tarotData",
        JSON.stringify({
          cardNumber,
          result: botMessageText,
          expireAt: new Date().setHours(24, 0, 0, 0), // 오늘 자정의 타임스탬프
        })
      );
    } catch (error) {
      console.error("Error:", error);
      setResult("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4 pb-40">
      {/* 메시지 */}
      {!result && (
        <>
          <h1 className="text-4xl mb-4 text-center">안녕하세요!</h1>
          <p className="text-lg mb-8 text-center">
            오늘의 타로 점을 봐 드릴게요!
          </p>
          <button
            onClick={() => setShowCardSelector(true)} // 카드 선택 창 열기
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg"
          >
            타로 점 보기
          </button>
        </>
      )}

      {/* 결과 표시 */}
      {result && (
        <div className="text-center">
          <h2 className="text-2xl mb-4">타로 점 결과</h2>

          {/* 선택된 카드 이미지 표시 */}
          {selectedCard !== null && (
            <Image
              src={`/basic/maj${selectedCard}.svg`} // 선택된 카드 이미지 경로
              alt={`Selected tarot card ${selectedCard}`}
              width={192}
              height={268}
              className="mt-2 mx-auto"
            />
          )}

          <p className="text-lg mt-4">{result}</p>


          <p>로그인 하고 결과를 저장해보세요!</p>
          {/* 로그인 버튼 */}
          <button
            onClick={() => router.push("/auth/login")} // 로그인 페이지로 이동
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg mt-6"
          >
            로그인
          </button>
        </div>
      )}

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="mt-4">
          <p className="text-lg">결과를 가져오는 중입니다...</p>
        </div>
      )}

      {/* 카드 선택 창 */}
      {showCardSelector && (
        <CardSelector
          onCardSelect={handleCardSelect}
          onClose={() => setShowCardSelector(false)}
        />
      )}
    </div>
  );
}
