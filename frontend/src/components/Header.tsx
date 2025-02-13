export default function Header({ isSidebarOpen }: { isSidebarOpen: boolean }) {
  return (
    <div
      className={`fixed top-0 right-0 h-14 bg-gray-100 shadow-md flex items-center justify-between px-6 z-50 transition-all duration-300 ${
        isSidebarOpen ? "w-[calc(100%-16rem)] ml-64" : "w-[calc(100%-4rem)] ml-16"
      }`}
    >
      {/* 좌측: "미루" 텍스트 */}
      <h1 className="text-xl font-bold">미루</h1>

      {/* 우측: 알림 & 프로필 버튼 */}
      <div className="flex gap-4">
        <button className="bg-gray-200 px-4 py-1 rounded-lg">🔔 알림</button>
        <button className="bg-gray-200 px-4 py-1 rounded-lg">👤 Profile</button>
      </div>
    </div>
  );
}
