// app/components/ProfileModal/LogoutModal.tsx
"use client";

import { useRouter } from "next/navigation"; // logoutUser 함수 경로에 맞게 수정해주세요.
import { API_URLS } from "@/config/api";

interface LogoutModalProps {
  onClose: () => void;
}

export default function LogoutModal({ onClose }: LogoutModalProps) {
  const router = useRouter();

  const logoutUser = async () => {
    try {
      const response = await fetch(API_URLS.AUTH.LOGOUT, {
        method: "POST",
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Failed to log out");
      }
  
      return true;
    } catch (error) {
      console.error("Error logging out:", error);
      return false;
    }
  };

  const handleLogout = async () => {
    const success = await logoutUser();
    if (success) {
      // 필요에 따라 다른 로그인 관련 정보도 삭제할 수 있습니다.
      localStorage.removeItem("userId");
      router.push("/");
    } else {
      alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-lg">
      <h2 className="text-lg font-bold mb-4">로그아웃 하시겠습니까?</h2>
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
          취소
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
