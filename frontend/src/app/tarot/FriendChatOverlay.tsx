"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_URLS } from "@/config/api";

export default function FriendChatOverlay() {
  const router = useRouter();
  const [showOverlay, setShowOverlay] = useState(false);
  const [joinSessionId, setJoinSessionId] = useState("");

  // 6자리 랜덤 세션 ID 생성 함수
  const generateRandomSessionId = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // 방 생성하기 버튼 클릭 시: 랜덤 세션 번호 생성 후 이동
  const handleCreateRoom = () => {
    const sessionId = generateRandomSessionId();
    setShowOverlay(false);
    router.push(API_URLS.WEBRTC.ROOM(sessionId));
  };

  // 방 참여하기 폼 제출 시: 입력한 세션 번호로 이동
  const handleJoinRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (joinSessionId.trim()) {
      setShowOverlay(false);
      router.push(API_URLS.WEBRTC.ROOM(joinSessionId.trim()));
    }
  };

  return (
    <>
      {/* "친구와 상담" 버튼을 누르면 오버레이를 활성화함 */}
      <button
        onClick={() => setShowOverlay(true)}
        className="w-full bg-fuchsia-500 hover:bg-fuchsia-600 text-white py-3 px-4 rounded-lg transition-colors"
      >
        친구와 상담
      </button>

      {/* 오버레이(모달) */}
      {showOverlay && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center">친구와 상담</h2>
            <div className="space-y-4">
              <button
                onClick={handleCreateRoom}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                방 생성하기
              </button>
              <form onSubmit={handleJoinRoom} className="space-y-3">
                <input
                  type="text"
                  value={joinSessionId}
                  onChange={(e) => setJoinSessionId(e.target.value)}
                  placeholder="세션 번호를 입력하세요"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  참여하기
                </button>
              </form>
              <button
                onClick={() => setShowOverlay(false)}
                className="w-full bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
