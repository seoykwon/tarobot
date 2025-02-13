import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa"; // 삭제 아이콘

export default function NotificationOverlay({
  isActive,
  toggle,
}: {
  isActive: boolean;
  toggle: () => void;
}) {
  const [notifications, setNotifications] = useState([
    { id: 1, name: "Name", message: "Supporting line text lorem...", time: "10 min" },
    { id: 2, name: "Name", message: "Supporting line text lorem...", time: "10 min" },
    { id: 3, name: "Name", message: "Supporting line text lorem...", time: "10 min" },
    { id: 4, name: "Name", message: "Supporting line text lorem...", time: "10 min" },
    { id: 5, name: "Name", message: "Supporting line text lorem...", time: "10 min" },
  ]);

  const clearAll = () => {
    setNotifications([]);
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  return (
    <div className="relative">
      {/* 알림 버튼 */}
      <button onClick={toggle} className="bg-gray-200 px-4 py-1 rounded-lg">
        🔔 알림
      </button>

      {/* 오버레이 메뉴 */}
      {isActive && (
        <div className="absolute top-full right-10 mt-2 w-96 bg-white shadow-lg rounded-lg border border-gray-200 z-50 translate-x-4">
       {/* 헤더 */}
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <span className="font-bold">메시지</span>
            <button onClick={clearAll} className="text-red-500 text-sm hover:text-red-700">
              모두 지우기
            </button>
          </div>

          {/* 알림 리스트 */}
          {/* <ul className="max-h-64 overflow-y-auto custom-scrollbar"> */}
          <ul className="max-h-64 overflow-y-auto scrollbar-none">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <li
                  key={notification.id}
                  className="flex items-center justify-between px-4 py-2 hover:bg-gray-100"
                >
                  {/* 왼쪽 아이콘 및 텍스트 */}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      {/* Placeholder for an avatar */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-gray-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 9A3.75 3.75 0 1112 5.25M12 12a7.5 7.5 0 00-7.5 7.5v.75h15v-.75a7.5 7.5 0 00-7.5-7.5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold">{notification.name}</p>
                      <p className="text-sm text-gray-500 truncate">{notification.message}</p>
                    </div>
                  </div>

                  {/* 오른쪽 삭제 버튼 및 시간 */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">{notification.time}</span>
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-center text-gray-500">알림이 없습니다.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
