// app/components/GoogleLoginButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { API_URLS } from "@/config/api";
import NextImage from "next/image";

export default function GoogleLoginButton({ redirect }: { redirect: string }) {
  const router = useRouter();

  const handleGoogleLogin = () => {
    const popup = window.open("", "_blank", "width=500,height=600");
    if (!popup) {
      alert("팝업이 차단되었습니다. 브라우저 설정을 확인해주세요.");
      return;
    }

    popup.location.href = `${API_URLS.AUTH.GOOGLE}?prompt=login`;

    // 팝업 창 닫힘 감지 및 결과 처리
    const checkPopup = setInterval(async () => {
      if (popup.closed) {
        clearInterval(checkPopup);

        try {
          // Access Token 검증 요청
          const response = await fetch(API_URLS.TOKEN.VALIDATE, {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            const userId = data.userId; // 예시: userId가 포함된 응답
            localStorage.setItem("userId", userId);

            // Redirect 경로가 있으면 해당 경로로 이동, 없으면 "/home"으로 이동
            router.push(redirect);
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
  className="flex items-center justify-center gap-2 px-8 py-3 text-gray-700 rounded-lg shadow-md hover:bg-gray-300 transition mx-auto"
>
  {/* 구글 로고 추가 */}
  <NextImage src="/google_logo.svg" alt="Google Logo" width={24} height={24}className="w-6 h-6" />
  구글로 계속하기
</button>
  );
}
