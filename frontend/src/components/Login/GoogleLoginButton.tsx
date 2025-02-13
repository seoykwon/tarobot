// app/components/GoogleLoginButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { API_URLS } from "@/config/api";

export default function GoogleLoginButton() {
  const router = useRouter();

  const handleGoogleLogin = () => {
    const popup = window.open("", "_blank", "width=500,height=600");
    if (!popup) {
      alert("팝업이 차단되었습니다. 브라우저 설정을 확인해주세요.");
      return;
    }

    popup.location.href = `${API_URLS.AUTH.GOOGLE}`;

    // 팝업 창 닫힘 감지 및 결과 처리
    const checkPopup = setInterval(async () => {
      if (popup.closed) {
        clearInterval(checkPopup);
        
        //access token 발급 후 검증된 토큰인지 확인하기
        try {
          const response = await fetch(API_URLS.TOKEN.VALIDATE, {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          });

          // 응답이 성공적이면 홈으로 리다이렉트
          if (response.ok) {
            router.push("/home");
          } else {
            alert("로그인에 실패했습니다. 다시 시도해주세요.");
          }
        } catch (error) {
          console.error("토큰 검증 중 에러 발생:", error);
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
