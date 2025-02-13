// app/components/GoogleLoginButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { API_URLS } from "@/config/api";

export default function GoogleLoginButton() {
  const router = useRouter();

  // 쿠키에서 JWT 토큰 확인 (예시)
  const getJwtCookie = () => {
    const cookies = document.cookie.split(';');
    const jwtCookie = cookies.find(cookie => cookie.trim().startsWith('jwt='));
    return jwtCookie ? jwtCookie.split('=')[1] : null;
  };

  const handleGoogleLogin = () => {
    const popup = window.open("", "_blank", "width=500,height=600");
    if (!popup) {
      alert("팝업이 차단되었습니다. 브라우저 설정을 확인해주세요.");
      return;
    }

    popup.location.href = `${API_URLS.AUTH.GOOGLE}`;

    // 팝업 창 닫힘 감지 및 결과 처리
    const checkPopup = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopup);
        
        const jwtToken = getJwtCookie(); // 쿠키 체크
        // 또는 localStorage.getItem("jwt"); // 로컬 스토리지 체크

        if (jwtToken) {
          router.push("/home");
        } else {
          alert("로그인에 실패했습니다. 다시 시도해주세요.");
        }
      }
    }, 1000);
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center justify-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-md shadow-md hover:bg-gray-300 transition mx-auto"
    >
      구글 로그인
    </button>
  );
}
