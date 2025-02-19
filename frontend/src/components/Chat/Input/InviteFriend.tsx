"use client";

import { useState, useEffect } from "react";
import Image from "next/image"; // next/image 임포트

interface InviteFriendProps {
  onClose: () => void;
  className?: string;
}

export default function InviteFriend({ onClose, className }: InviteFriendProps) {
  const [currentURL, setCurrentURL] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [kakaoLoaded, setKakaoLoaded] = useState(false);

  // 현재 URL 가져오기
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentURL(window.location.href);
    }
  }, []);

  // 카카오톡 SDK 동적 로드
  useEffect(() => {
    if (!kakaoLoaded) {
      const script = document.createElement("script");
      script.src = "https://developers.kakao.com/sdk/js/kakao.min.js";
      script.onload = () => {
        if (window.Kakao && !window.Kakao.isInitialized()) {
          window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_API_KEY!); // 환경 변수에서 API 키 가져오기
        }
        setKakaoLoaded(true);
      };
      document.body.appendChild(script);
    }
  }, [kakaoLoaded]);

  // URL 복사 핸들러
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentURL);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500); // 복사 완료 메시지 표시
    } catch (error) {
      console.error("복사 실패:", error);
    }
  };

  // 카카오톡 공유 핸들러
  const shareKakao = () => {
    if (window.Kakao) {
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: "채팅방 초대",
          description: "친구와 함께 채팅에 참여하세요!",
          imageUrl: "https://ifh.cc/g/hMJsnc.jpg", // 유효
          link: {
            mobileWebUrl: currentURL,
            webUrl: currentURL,
          },
        },
      });
    } else {
      console.error("카카오톡 SDK가 로드되지 않았습니다.");
    }
  };

  return (
    <div className={`p-6 bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* 상단 아이콘 섹션 */}
      <div className="flex justify-center items-center mb-6">
        <button
          onClick={shareKakao}
          className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-md hover:bg-yellow-500 transition"
          disabled={!kakaoLoaded} // SDK 로드 전에는 버튼 비활성화
        >
          <Image
            src="/kakao_logo.svg" // public 폴더에 저장된 카카오톡 아이콘 경로
            alt="카카오톡 공유"
            width={32} // 이미지 크기 지정 (px 단위)
            height={32}
            className="w-8 h-8" // Tailwind 스타일링 유지 가능
            priority // 성능 최적화를 위해 우선 로드 설정
          />
        </button>
      </div>
      {/* 닫기 버튼 추가 */}
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
        닫기
      </button>

      {/* 하단 링크 및 복사 버튼 섹션 */}
      <div className="mb-4">
        <input
          type="text"
          value={currentURL}
          readOnly
          className="w-full p-2 border rounded-lg focus:outline-none text-gray-700"
        />
      </div>
      <button
        onClick={handleCopy}
        className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        {isCopied ? "복사 완료" : "URL 복사"}
      </button>
    </div>
  );
}
