"use client";

import { useState } from "react";
import { FaTrashAlt, FaBell } from "react-icons/fa";
import Image from "next/image";

interface Announcement {
  announcementId: number;
  title: string;
  content: string;
  createdAt: string;
  profileIcon?: string;
}

export default function NotificationOverlay({
  isActive,
  toggle,
}: {
  isActive: boolean;
  toggle: () => void;
}) {
  // 예시 알림 1개를 초기 상태로 설정 (3일 전 날짜로 설정하려면 아래와 같이 수정 가능)
  const [notifications, setNotifications] = useState<Announcement[]>([
  ]);

  const [selectedNotification, setSelectedNotification] =
    useState<Announcement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 오늘 날짜인지 판별 후, 오늘이면 시간, 그렇지 않으면 날짜를 표시하는 함수
  const formatNotificationDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    if (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    ) {
      // 오늘 날짜인 경우 시간 표시
      return date.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      // 오늘이 아니면 날짜 표시
      return date.toLocaleDateString("ko-KR");
    }
  };

  const openModal = (notification: Announcement) => {
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
      <button
        onClick={toggle}
        className="w-10 h-10 flex items-center justify-center focus:outline-none"
      >
        <FaBell className="w-6 h-6 text-gray-600" />
      </button>

      {/* 알림 오버레이 */}
      {isActive && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border border-gray-200 z-50 translate-x-14">
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
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <li
                  key={notification.announcementId}
                  className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => openModal(notification)}
                >
                  {/* 왼쪽 아이콘 및 텍스트 영역 */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-gray-300">
                      <Image
                        src={notification.profileIcon || "/notice.svg"}
                        alt={`${notification.title} profile`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 max-w-full">
                      <p className="font-bold">{notification.title}</p>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {notification.content}
                      </p>
                    </div>
                  </div>

                  {/* 오른쪽 시간 및 삭제 버튼 영역 */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="text-sm text-gray-400">
                      {formatNotificationDate(notification.createdAt)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setNotifications((prev) =>
                          prev.filter(
                            (n) =>
                              n.announcementId !== notification.announcementId
                          )
                        );
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </li>
              ))
            ) : (
              // 알림이 없을 경우 표시할 문구
              <li className="px-4 py-2 text-center text-gray-500">
                알림이 없습니다.
              </li>
            )}
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
                  src={selectedNotification.profileIcon || "/notice.svg"}
                  alt={`${selectedNotification.title} profile`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <h2 className="text-xl font-bold">
                  {selectedNotification.title}
                </h2>
                <span className="text-sm text-gray-500">
                  작성일:{" "}
                  {new Date(selectedNotification.createdAt).toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <button
                onClick={closeModal}
                className="ml-auto text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* 모달 본문 */}
            <div>
              <p className="text-sm text-gray-700">
                {selectedNotification.content}
              </p>
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
