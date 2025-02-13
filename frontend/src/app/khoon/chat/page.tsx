import ChatWindow from "@/app/khoon/components/ChatWindow";

export default function Hoon() {
  return (
    <div className="grid grid-cols-3 h-screen bg-gray-100">
      {/* ✅ 좌측 이미지 영역 */}
      <div className="col-span-1 min-w-[200px] md:min-w-[300px] p-4 flex flex-col gap-4">
        <div className="flex-1 bg-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
          <img src="/images/dummy1.png" alt="이미지 1" className="w-full h-full object-contain min-h-0" />
        </div>
        <div className="flex-1 bg-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
          <img src="/images/dummy2.png" alt="이미지 2" className="w-full h-full object-contain min-h-0" />
        </div>
      </div>

      {/* ✅ 우측 ChatWindow */}
      <div className="col-span-2 flex-1">
        <ChatWindow />
      </div>
    </div>
  );
}
