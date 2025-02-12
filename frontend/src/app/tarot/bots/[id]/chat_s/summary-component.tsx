"use client";

import Image from "next/image";
import html2canvas from "html2canvas";
import { useRef } from "react";

interface SummaryProps {
  cardImage?: string;
  content: string;
  onClose: () => void;
}

const SummaryComponent = ({ cardImage, content, onClose }: SummaryProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleSaveScreenshot = async () => {
    if (contentRef.current) {
      try {
        // 요소의 크기와 스타일을 조정하여 전체 내용을 캡처
        const canvas = await html2canvas(contentRef.current, {
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#1F2937", // bg-gray-800과 동일한 색상
          scale: 2, // 고해상도 이미지 생성
          scrollX: 0, // 스크롤 위치 초기화
          scrollY: 0,
        });

        const image = canvas.toDataURL("image/png", 1.0);
        const link = document.createElement("a");
        link.href = image;
        link.download = "tarot-summary.png";
        link.click();
      } catch (error) {
        console.error("스크린샷 저장 중 오류 발생:", error);
      }
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
      <div
        ref={contentRef}
        className="flex flex-col items-center space-y-4 p-4 overflow-y-auto"
        style={{ maxHeight: "500px" }} // 스크롤 가능하도록 높이 제한
      >
        {/* 뽑은 카드 이미지 표시 */}
        {cardImage && (
          <div className="w-48 h-64 relative mb-4">
            <Image
              src={cardImage}
              alt="Selected tarot card"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        )}
        {/* 요약 내용 */}
        <div className="text-white whitespace-pre-wrap text-lg">
          {content}
        </div>
      </div>
      {/* 저장 및 닫기 버튼 */}
      <div className="flex flex-col space-y-2 mt-6">
        <button
          onClick={handleSaveScreenshot}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          저장하기
        </button>
        <button
          onClick={onClose}
          className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default SummaryComponent;
