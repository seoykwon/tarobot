"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { API_URLS } from "@/config/api";
import { useParams } from "next/navigation";

export default function FriendChatOverlay() {
  const router = useRouter();
  const [showOverlay, setShowOverlay] = useState(false);
  const [joinSessionId, setJoinSessionId] = useState("");
  const [randomSessionId, setRandomSessionId] = useState("");
  const { id: tarobotId } = useParams(); // [id] 값 가져오기

  // 6자리 랜덤 세션 ID 생성 함수
  const generateRandomSessionId = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // 오버레이가 열릴 때 랜덤 세션 번호 생성
  useEffect(() => {
    if (showOverlay) {
      const newSessionId = generateRandomSessionId();
      setRandomSessionId(newSessionId);
    } else {
      setRandomSessionId("");
    }
  }, [showOverlay]);

  // 방 생성하기 버튼 클릭 시: 미리 생성된 randomSessionId로 방 생성 및 이동
  const handleCreateRoom = () => {
    if (randomSessionId) {
      setShowOverlay(false);
      // 예시: API_URLS.WEBRTC.ROOM에서 tarobotId와 randomSessionId를 사용하는 방식
      router.push(API_URLS.WEBRTC.ROOM(tarobotId as string, randomSessionId));
    }
  };

  // 방 참여하기 폼 제출 시: 입력한 세션 번호로 이동
  const handleJoinRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (joinSessionId.trim()) {
      setShowOverlay(false);
      router.push(API_URLS.WEBRTC.ROOM(tarobotId as string, joinSessionId.trim()));
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
            {/* 미리 생성된 랜덤 세션 번호 표시 */}
            <h3 className="text-center mb-4">
              세션 번호: <span className="font-bold">{randomSessionId}</span>
            </h3>
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
