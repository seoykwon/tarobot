// chat/page.tsx
"use client"

// import { useState, useEffect } from "react";
import ChatStandby from "@/components/ChatStandby";

export default function ChatPage() {
  // const [isMobile, setIsMobile] = useState<boolean>(false);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setIsMobile(window.innerWidth < 768);
  //   };

  //   handleResize();
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  // if (isMobile) {
  //   // 모바일 화면일 경우: 좌측 이미지 영역의 첫 번째 이미지를 ChatStandby 백그라운드로 사용
  //   return (
  //     <div className="relative h-screen bg-purple-100">
  //       {/* 백그라운드 이미지 */}
  //       <div className="absolute inset-0">
  //         <Image
  //           src="/images/dummy1.png"
  //           alt="배경 이미지"
  //           fill
  //           className="object-cover"
  //         />
  //       </div>
  //       {/* 채팅 창은 백그라운드 위에 오도록 상대적 z-index를 부여 */}
  //       <div className="relative z-10 h-full">
  //         <ChatStandby />
  //       </div>
  //     </div>
  //   );
  // }

  // // 데스크탑 등 모바일이 아닐 경우 기존 좌측, 우측 레이아웃 출력
  // return (
  //   <div className="grid grid-cols-3 h-screen bg-purple-100">
  //     {/* 좌측 이미지 영역 - 최소 너비 제거 */}
  //     <div className="col-span-1 w-full p-4 flex flex-col gap-4">
  //       {/* 이미지 컨테이너에 aspect ratio 적용 */}
  //       <div className="relative flex-1 bg-purple-100 rounded-lg overflow-hidden aspect-[3/2]">
  //         <Image
  //           src="/images/dummy1.png"
  //           alt="이미지 1"
  //           fill
  //           className="object-contain"
  //         />
  //       </div>
  //       <div className="relative flex-1 bg-purple-100 rounded-lg overflow-hidden aspect-[3/2]">
  //         <Image
  //           src="/images/dummy2.png"
  //           alt="이미지 2"
  //           fill
  //           className="object-contain"
  //         />
  //       </div>
  //     </div>

  //     {/* 우측 채팅 창: Standby 모드 */}
  //     <div className="col-span-2 flex-1">
  //       <ChatStandby />
  //     </div>
  //   </div>
  // );

  return (
    <div className="relative h-screen">
      {/* 배경 이미지 및 오버레이 */}

      {/* 채팅창을 화면 중앙에 배치 */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="w-full max-w-3xl p-2 bg-purple-50">
          <ChatStandby />
        </div>
      </div>
    </div>
  );
}
