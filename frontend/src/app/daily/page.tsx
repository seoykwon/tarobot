"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CardSelector from "./card-selector";
import Image from "next/image";
import html2canvas from "html2canvas";
import { API_URLS } from "@/config/api";

// 토큰 유효성 검증 및 리프레시 함수
async function validateAndRefresh() {
  try {
    const validateResponse = await fetch(API_URLS.TOKEN.VALIDATE, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!validateResponse.ok) {
      const refreshResponse = await fetch(API_URLS.TOKEN.REFRESH, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!refreshResponse.ok) {
        throw new Error("Token refresh failed");
      }
    }

    return true;
  } catch (error) {
    console.error("Error during token validation or refresh:", error);
    return false;
  }
}

interface SummaryProps {
  cardImage?: string;
  content: string;
  onClose: () => void;
}

const SummaryComponent = ({ cardImage, content, onClose }: SummaryProps) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
      <div className="flex flex-col items-center space-y-4">
        {cardImage && (
          <div className="w-48 h-64 relative">
            <Image
              src={cardImage}
              alt="Selected tarot card"
              layout="fill"
              objectFit="contain"
            />
          </div>
        )}
        <div className="text-white whitespace-pre-wrap">{content}</div>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default function FirstVisitPage() {
  const [showCardSelector, setShowCardSelector] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  // 기존에는 selectedCard가 number 타입이었으나, 이미지 경로를 지정할 때는
  // 향후 카드 선택 로직에 따라 문자열(id)를 사용하거나 number를 문자열화하여 사용합니다.
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const isValid = await validateAndRefresh();
      setIsLoggedIn(isValid);
    };

    checkLoginStatus();
  }, []);

  const handleDirectSave = async () => {
    if (!selectedCard || !result) return;

    const virtualElement = document.createElement("div");
    virtualElement.style.position = "absolute";
    virtualElement.style.left = "-9999px";
    virtualElement.innerHTML = `
      <div style="
        background-color: rgb(31, 41, 55);
        padding: 24px;
        border-radius: 8px;
        width: 400px;
        display: flex;
        flex-direction: column;
        align-items: center;
      ">
        <div style="width: 192px; height: 256px; position: relative; margin-bottom: 16px;">
          <img src="/basic/maj${selectedCard}.svg" alt="Tarot card" style="width: 100%; height: 100%; object-fit: contain;" />
        </div>
        <div style="color: white; white-space: pre-wrap; text-align: center; font-size: 16px;">
          ${result}
        </div>
      </div>
    `;
    
    document.body.appendChild(virtualElement);

    try {
      const canvas = await html2canvas(virtualElement, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#1F2937",
        scale: 2,
      });

      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = image;
      link.download = "tarot-summary.png";
      link.click();
    } catch (error) {
      console.error("스크린샷 저장 중 오류 발생:", error);
    } finally {
      document.body.removeChild(virtualElement);
    }
  };

  const handleCardSelect = async (cardNumber: number) => {
    setShowCardSelector(false);
    setSelectedCard(cardNumber);
    setIsLoading(true);

    try {
      const response = await fetch(API_URLS.CHAT.STREAM("12345", `majortarotcard_${cardNumber}`), {
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

      const userId = document.cookie
        .split("; ")
        .find((row) => row.startsWith("user_id="))
        ?.split("=")[1];

      await fetch(API_URLS.TAROT.SAVE_RESULT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardNumber,
          result: botMessageText,
          userId: userId || null,
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

          <div className="flex flex-col gap-2 mt-6">
            <button
              onClick={handleDirectSave}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              결과 저장하기
            </button>

            {isLoggedIn ? (
              <button
                onClick={handleExit}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg"
              >
                종료하기
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <span className="text-sm text-white">
                  로그인하고 더 많은 점을 봐보세요!
                </span>
                <button
                  onClick={() => router.push("/auth/login")}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg"
                >
                  로그인
                </button>
              </div>
            )}
          </div>
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

      {showSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <SummaryComponent
            cardImage={selectedCard ? `/basic/maj${selectedCard}.svg` : undefined}
            content={result || ""}
            onClose={() => setShowSummary(false)}
          />
        </div>
      )}
    </div>
  );
}

// 종료 버튼 핸들러 (예시)
function handleExit() {
  // 대화 내용을 서버에 저장 등 필요한 처리를 하고
  // 홈으로 이동 또는 다른 종료 동작을 수행합니다.
  console.log("종료하기 처리");
}
