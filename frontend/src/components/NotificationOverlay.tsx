import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import Image from "next/image";

interface Notification {
  id: number;
  name: string;
  message: string;
  time: string;
  profileIcon: string;
}

export default function NotificationOverlay({
  isActive,
  toggle,
}: {
  isActive: boolean;
  toggle: () => void;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      name: "Name",
      message:
        "Supporting line text loremadsfadsfasdffdasasdfasdfasfasafas loremadsfadsfasdffdasasdfasdfasfasasasdfasdasfasfas",
      time: "10 min",
      profileIcon: "/example.jpg",
    },
    {
      id: 2,
      name: "Name",
      message: "Supporting line text lorem...",
      time: "10 min",
      profileIcon: "/example.jpg",
    },
    {
      id: 3,
      name: "Name",
      message: "Suppas dfafdsfads afdszvcx asdfasfdrem...",
      time: "10 min",
      profileIcon: "/example.jpg",
    },
    {
      id: 4,
      name: "Name",
      message: "Supporting line text lorem...",
      time: "10 min",
      profileIcon: "/example.jpg",
    },
    {
      id: 5,
      name: "Name",
      message: "Supporting line text lorem...",
      time: "10 min",
      profileIcon: "/example.jpg",
    },
  ]);

  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedNotification(null);
    setIsModalOpen(false);
  };

  return (
    <div className="relative">
      {/* 알림 버튼 */}
      <button onClick={toggle} className="bg-gray-200 px-4 py-1 rounded-lg">
        🔔 알림
      </button>

      {/* 알림 오버레이 */}
      {isActive && (
        <div className="absolute top-full right-10 mt-2 w-80 bg-white shadow-lg rounded-lg border border-gray-200 z-50 translate-x-4">
          {/* 헤더 */}
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <span className="font-bold">메시지</span>
            <button
              onClick={() => setNotifications([])}
              className="text-red-500 text-sm hover:text-red-700"
            >
              모두 지우기
            </button>
          </div>

          {/* 알림 리스트 */}
          <ul className="max-h-64 overflow-y-auto scrollbar-none divide-y divide-gray-200">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => openModal(notification)}
              >
                {/* 왼쪽 아이콘 및 텍스트 영역 */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-gray-300">
                    <Image
                      src={notification.profileIcon}
                      alt={`${notification.name} profile`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 max-w-full">
                    <p className="font-bold">{notification.name}</p>
                    <p className="text-sm text-gray-500 line-clamp-1">
                      {notification.message}
                    </p>
                  </div>
                </div>

                {/* 오른쪽 시간 및 삭제 버튼 영역 */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="text-sm text-gray-400">{notification.time}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setNotifications((prev) =>
                        prev.filter((n) => n.id !== notification.id)
                      );
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 모달 */}
      {isModalOpen && selectedNotification && (
        <div className="fixed inset-0 flex items-center justify-center z-[60]">
          {/* 배경 */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={closeModal}
          ></div>

          {/* 모달 콘텐츠 */}
          <div className="relative bg-white w-[90%] max-w-lg p-6 rounded-lg shadow-lg z-[70]">
            {/* 모달 헤더 */}
            <div className="flex items-center gap-4 border-b pb-4 mb-4">
              <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
                <Image
                  src={selectedNotification.profileIcon}
                  alt={`${selectedNotification.name} profile`}
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-xl font-bold">{selectedNotification.name}</h2>
              <button
                onClick={closeModal}
                className="ml-auto text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* 모달 본문 */}
            <div>
              <p className="text-sm text-gray-700">{selectedNotification.message}</p>
            </div>

            {/* 모달 푸터 */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
