// pages/index.tsx
import ChatWindow from "@/app/khoon/components/chatwindow";

export default function Hoon() {
  return (
    <div className="flex h-screen bg-gray-100 flex-col">
      <ChatWindow />
      <div className="h-24"></div>
    </div>
  );
}