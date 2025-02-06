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
        const canvas = await html2canvas(contentRef.current, {
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#1F2937", // bg-gray-800과 동일한 색상
          scale: 2, // 해상도를 높이기 위해 스케일 조정
          logging: true,
          onclone: (document, element) => {
            // 클론된 요소의 스타일을 조정하여 이미지와 텍스트가 모두 보이도록 함
            element.style.width = '100%';
            element.style.height = 'auto';
            element.style.position = 'relative';
          }
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
        className="flex flex-col items-center space-y-4 p-4"
        style={{ minHeight: '400px' }} // 최소 높이 설정
      >
        {cardImage && (
          <div className="w-48 h-64 relative mb-4">
            <Image
              src={cardImage}
              alt="Selected tarot card"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
        )}
        <div className="text-white whitespace-pre-wrap text-lg">
          {content}
        </div>
      </div>
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
