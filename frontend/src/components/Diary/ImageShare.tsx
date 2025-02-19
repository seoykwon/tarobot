"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface ShareImageProps {
  contentRef: React.RefObject<HTMLDivElement>; // 캡처할 영역의 참조
}

export default function ImageShare({ contentRef }: ShareImageProps) {
  const [kakaoLoaded, setKakaoLoaded] = useState(false);

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

  // 카카오톡 이미지 공유 핸들러
  const shareKakaoImage = async () => {
    if (!contentRef.current) return;
    
    try {
      if (window.Kakao) {
        window.Kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: "타로 상담",
            description: "지금 상담받고 내용을 확인하세요!",
            imageUrl: "https://ifh.cc/g/hMJsnc.jpg", // 캡처된 이미지를 직접 공유
            link: {
              mobileWebUrl: window.location.href,
              webUrl: window.location.href,
            },
          },
        });
      } else {
        console.error("카카오톡 SDK가 로드되지 않았습니다.");
      }
    } catch (error) {
      console.error("이미지 캡처 및 공유 실패:", error);
    }
  };

  return (
    <button
      onClick={shareKakaoImage}
      className="px-4 py-2 rounded-lg focus:outline-none flex items-center gap-2"
      disabled={!kakaoLoaded} // SDK 로드 전에는 버튼 비활성화
    >
      <Image
        src="/kakao_logo.svg" // public 폴더에 저장된 카카오톡 아이콘 경로
        alt="카카오톡 공유"
        width={24}
        height={24}
      />
    </button>
  );
}
