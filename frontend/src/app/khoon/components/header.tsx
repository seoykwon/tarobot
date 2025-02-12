export default function Header() {
    return (
      <div className="w-full h-14 p-6 bg-gray-100 shadow-md flex items-center justify-between px-6">
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
  