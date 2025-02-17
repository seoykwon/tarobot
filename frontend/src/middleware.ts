// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { API_URLS } from "@/config/api";

// // Middleware 함수
// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // `/tarot/chat/[id]`와 같은 동적 경로 처리
//   if (pathname.startsWith("/tarot/chat")) {
//     // const token = req.cookies.get("access_token");

//     // // JWT 토큰이 없으면 로그인 페이지로 리다이렉트
//     // if (!token) {
//     //   const loginUrl = new URL("/auth/login", req.url); // 로그인 페이지 경로
//     //   return NextResponse.redirect(loginUrl);
//     // }

//     // ✅ 검증 및 재발급
//     const redirectResponse = await validateAndRefresh(req);
//     if (redirectResponse) return redirectResponse;
//   }

//   // 다른 보호된 경로 처리 (예: 마이페이지, 글 작성, 다이어리)
//   const protectedRoutes = [
//     "/my-page",
//     "/community/write",
//     "/diary",
//   ];

//   if (protectedRoutes.some((route) => pathname.startsWith(route))) {
//     // const token = req.cookies.get("access_token");
//     // //const token = req.cookies.get("refresh_token");

//     // if (!token) {
//     //   const loginUrl = new URL("/auth/login", req.url);
//     //   return NextResponse.redirect(loginUrl);
//     // }

//     // ✅ 검증 및 재발급
//     const redirectResponse = await validateAndRefresh(req);
//     if (redirectResponse) return redirectResponse;
//   }

//   return NextResponse.next(); // 요청을 그대로 전달
// }

// // 토큰이 없을 경우 실행 될 유효성 검증 & 리프레쉬 토큰으로 재발급 함수
// async function validateAndRefresh(req: NextRequest) {
//   // 원래 요청의 쿠키 헤더 추출
//   const cookie = req.headers.get("cookie") ?? "";

//   // access_token 검증 요청 (쿠키 헤더 전달)
//   const validateResponse = await fetch(API_URLS.TOKEN.VALIDATE, {
//     method: "GET",
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//       "Cookie": cookie,
//     },
//   });

//   // access_token이 유효하지 않으면 refresh 요청
//   if (!validateResponse.ok) {
//     // 아래 refresh_token도 동일하게 전달 (쿠키에 저장되어 있다면)
//     const refreshToken = req.cookies.get("refresh_token")?.value;
//     if (!refreshToken) {
//       return NextResponse.redirect(new URL("/auth/login", req.url));
//     }
    
//     const refreshResponse = await fetch(API_URLS.TOKEN.REFRESH, {
//       method: "POST",
//       credentials: "include", // 필수!
//       headers: {
//         "Content-Type": "application/json",
//         // "Cookie": cookie,
//       },
//       // refresh API는 JSON body를 요구합니다.
//       body: JSON.stringify({ refreshToken }),
//     });

//     if (!refreshResponse.ok) {
//       return NextResponse.redirect(new URL("/auth/login", req.url));
//     }

//     // 백엔드가 새 access token을 쿠키에 설정한 Set-Cookie 헤더 추출
//     const setCookieHeader = refreshResponse.headers.get("set-cookie");

//     // Edge에서 최종 응답에 쿠키 헤더를 포함시켜 브라우저에 전달
//     const response = NextResponse.next();
//     if (setCookieHeader) {
//       response.headers.append("set-cookie", setCookieHeader);
//     }
//     return response;
//   }

//   return null; // 토큰이 유효한 경우 그대로 진행
// }


// // Middleware가 작동할 경로 설정
// export const config = {
//   matcher: [
//     "/tarot/chat/:path*", // 동적 채팅 경로
//     "/my-page/:path*", // 마이페이지 관련 모든 경로
//     "/community/write", // 글 작성 페이지
//     "/diary/:path*", // 다이어리 관련 모든 경로
//   ],
// };


import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { API_URLS } from "@/config/api";

// Middleware 함수
export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  // Access Token이 없고 Refresh Token도 없으면 로그인 페이지로 리다이렉트
  if (!accessToken && !refreshToken) {
    const redirectUrl = new URL("/", request.url);
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname); // 현재 경로 저장
    return NextResponse.redirect(redirectUrl);
  }

  // Access Token 검증 및 Refresh Token 활용 로직
  const redirectResponse = await validateAndRefresh(request, accessToken, refreshToken);
  if (redirectResponse) return redirectResponse;

  // Access Token이 유효하면 요청 진행
  return NextResponse.next();
}

// 토큰 검증 및 Refresh Token으로 재발급 함수
async function validateAndRefresh(req: NextRequest, accessToken: string | undefined, refreshToken: string | undefined) {
  // 원래 요청의 쿠키 헤더 추출
  const cookie = req.headers.get("cookie") ?? "";

  // Access Token 검증
  if (accessToken) {
    const validateResponse = await fetch(API_URLS.TOKEN.VALIDATE, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
    });

    // Access Token이 유효하면 그대로 진행
    if (validateResponse.ok) return null;
  }

  // Refresh Token으로 Access Token 재발급 요청
  if (refreshToken) {
    try {
      const refreshResponse = await fetch(API_URLS.TOKEN.REFRESH, {
        method: "POST",
        credentials: "include", // 필수!
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshResponse.ok) {
        // 새 Access Token을 쿠키에 설정
        const setCookieHeader = refreshResponse.headers.get("set-cookie");
        const response = NextResponse.next();
        if (setCookieHeader) {
          response.headers.append("set-cookie", setCookieHeader);
        }
        return response;
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  }

  // Refresh Token도 유효하지 않으면 로그인 페이지로 리다이렉트
  const loginUrl = new URL("/", req.url);
  loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

// Middleware가 적용될 경로 설정
export const config = {
  matcher: [
    "/chat/:path*", // 동적 채팅 경로
  ],
};
