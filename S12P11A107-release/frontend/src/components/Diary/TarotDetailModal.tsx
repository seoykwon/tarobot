"use client";

import React, { useRef, MouseEvent } from "react";
import html2canvas from "html2canvas";
import Image from "next/image";
import ImageShare from "./ImageShare"; // ImageShare 컴포넌트 임포트

export interface TarotSummary {
  id: number;
  consultDate: string;
  tag: string;
  title: string;
  summary: string;
  cardImageUrl: string;
  tarotBotId: number;
  createdAt: string;
  updatedAt: string;
}

interface TarotDetailModalProps {
  tarot: TarotSummary;
  onClose: () => void;
}

export default function TarotDetailModal({
  tarot,
  onClose,
}: TarotDetailModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Prevent event bubbling so that clicking inside the modal doesn’t close it
  const handleModalContentClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  // Formats the consultation date in Korean style
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Download handler using html2canvas
  const handleDownload = async () => {
    if (!contentRef.current) return;

    const canvas = await html2canvas(contentRef.current, { scale: 1 });
    const imageData = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = imageData;
    link.download = `${tarot.title}_요약.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg shadow-lg w-11/12 max-w-lg p-6"
        onClick={handleModalContentClick}
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 z-50 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Capture Content */}
        <div
          ref={contentRef}
          className="flex flex-col items-center justify-center bg-white p-4 rounded-md mx-auto"
          style={{
            width: "300px",
            textAlign: "center",
            margin: "0 auto",
          }}
        >
          {/* Image Section */}
          <div
            className="relative mb-4"
            style={{
              width: "200px",
              height: "300px",
            }}
          >
            <Image
              src={tarot.cardImageUrl}
              alt={tarot.title}
              fill
              className="object-contain rounded-md"
            />
          </div>

          {/* Details Section */}
          <div>
            <h2 className="text-xl font-bold mb-1">{tarot.title}</h2>
            <p className="text-sm text-gray-500 mb-3">{tarot.tag}</p>
            <p className="text-base text-gray-700 mb-3">{tarot.summary}</p>
            <p className="text-xs text-gray-500">
              상담일자: {formatDate(tarot.consultDate)}
            </p>
          </div>
        </div>

        {/* Button Area */}
        <div className="flex gap-4 mt-4 justify-center">
          {/* 다운로드 버튼 */}
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-lg focus:outline-none flex items-center gap-2"
          >
            <Image
              src="/download.svg"
              alt="다운로드"
              width={24}
              height={24}
            />
          </button>

          {/* 카카오톡 공유 버튼 */}
          <ImageShare contentRef={contentRef} />
        </div>
      </div>
    </div>
  );
}
