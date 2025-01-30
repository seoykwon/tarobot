  // Kakao 로그인 요청
  export const kakaoLoginRequest = async () => {
    const response = await fetch("http://localhost:8080/api/auth/kakao", {
      method: "GET",
      credentials: "include", // HttpOnly 쿠키 포함
    });
  
    if (!response.ok) {
      throw new Error("Kakao 로그인 실패");
    }
  
    return response.json(); // 백엔드에서 처리된 결과 반환
  };