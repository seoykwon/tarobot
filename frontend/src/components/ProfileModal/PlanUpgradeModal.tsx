"use client";

export default function PlanUpgradeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-xl font-bold mb-4">플랜 업그레이드</h2>
      <p>플랜 업그레이드 관련 내용을 여기에 입력하세요.</p>
      <button
        onClick={onClose}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        닫기
      </button>
    </div>
  );
}
