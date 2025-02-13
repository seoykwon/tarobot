import { useState, useEffect, useRef } from "react";
import ProfileOverlay from "./ProfileOverlay";
import NotificationOverlay from "./NotificationOverlay";

export default function Header({ isSidebarOpen }: { isSidebarOpen: boolean }) {
  const [activeOverlay, setActiveOverlay] = useState<"profile" | "notification" | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const toggleOverlay = (overlay: "profile" | "notification") => {
    setActiveOverlay((prev) => (prev === overlay ? null : overlay));
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
      setActiveOverlay(null);
    }
  };

  useEffect(() => {
    if (activeOverlay) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeOverlay]);

  return (
    <div
      className={`fixed top-0 right-0 h-14 bg-gray-100 shadow-md flex items-center justify-between px-6 z-50 transition-all duration-300 ${
        isSidebarOpen ? "w-[calc(100%-16rem)] ml-64" : "w-[calc(100%-4rem)] ml-16"
      }`}
    >
      {/* 좌측: "미루" 텍스트 */}
      <h1 className="text-xl font-bold">미루</h1>

      {/* 우측: 알림 & 프로필 버튼 */}
      <div className="relative flex gap-4" ref={overlayRef}>
        {/* 알림 버튼 */}
        <NotificationOverlay
          isActive={activeOverlay === "notification"}
          toggle={() => toggleOverlay("notification")}
        />

        {/* 프로필 버튼 */}
        <ProfileOverlay
          isActive={activeOverlay === "profile"}
          toggle={() => toggleOverlay("profile")}
        />
      </div>
    </div>
  );
}
