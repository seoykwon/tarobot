// src/types/global.d.ts
export {};

declare global {
  interface Window {
    Kakao: KakaoJS;
  }
}

interface KakaoJS {
  isInitialized: () => boolean;
  init: (key: string) => void;
  Share: {
    sendDefault: (options: KakaoShareOptions) => void;
  };
}

interface KakaoShareOptions {
  objectType: string;
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  };
  // 추가 옵션이 필요하면 여기에 정의합니다.
}
