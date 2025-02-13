import ChatWindow from "@/app/khoon/components/ChatWindow";

export default function Hoon() {
  return (
    <div className="h-screen bg-gray-100 flex flex-col md:grid md:grid-cols-3">
      {/* ✅ 모바일: 이미지가 위에 가로 2줄 */}
      <div className="grid grid-cols-2 md:grid-cols-1 md:col-span-1 gap-4 p-4">
        <div className="flex-1 bg-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
          <img src="/images/dummy1.png" alt="이미지 1" className="w-full h-full object-contain" />
        </div>
        <div className="flex-1 bg-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
          <img src="/images/dummy2.png" alt="이미지 2" className="w-full h-full object-contain" />
        </div>
      </div>

      {/* ✅ 우측 ChatWindow (PC에서는 고정된 위치, 모바일에서는 풀스크린) */}
      <div className="flex-1 md:col-span-2">
        <ChatWindow />
      </div>
    </div>
  );
}
