// src/types/global.d.ts
export {};

declare global {
  interface Window {
    Kakao: any; // Kakao 객체를 any 타입으로 선언
  }
}
