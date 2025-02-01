// 로그인 요청
export const loginRequest = async (id: string, password: string) => {
    const response = await fetch("http://localhost:8080/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // HttpOnly 쿠키 포함
      body: JSON.stringify({ id, password }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "로그인 실패");
    }
  
    return response.json(); // Access Token 등 응답 데이터 반환
  };