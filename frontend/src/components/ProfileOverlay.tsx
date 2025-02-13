"use client";

import { useState } from "react";
import { FaCog, FaGem, FaSignOutAlt } from "react-icons/fa";
import SettingModal from "./ProfileModal/SettingModal";
import PlanUpgradeModal from "./ProfileModal/PlanUpgradeModal";
import LogoutModal from "./ProfileModal/LogoutModal";
export default function ProfileOverlay({
  isActive,
  toggle,
}: {
  isActive: boolean;
  toggle: () => void;
}) {
  // 각 모달의 열림 상태를 별도로 관리
  const [isSettingModalOpen, setSettingModalOpen] = useState(false);
  const [isPlanUpgradeModalOpen, setPlanUpgradeModalOpen] = useState(false);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);

  // 모달 열기 시 프로필 메뉴는 닫힘
  const openSetting = () => {
    setSettingModalOpen(true);
    toggle();
  };

  const openPlanUpgrade = () => {
    setPlanUpgradeModalOpen(true);
    toggle();
  };

  const openLogout = () => {
    setLogoutModalOpen(true);
    toggle();
  };

  // 오버레이 및 모든 모달 닫기
  const closeAllModals = () => {
    setSettingModalOpen(false);
    setPlanUpgradeModalOpen(false);
    setLogoutModalOpen(false);
  };

  return (
    <div className="relative">
      {/* 프로필 버튼 */}
      <button onClick={toggle} className="bg-gray-200 px-4 py-1 rounded-lg">
        👤 Profile
      </button>

      {/* 오버레이 메뉴 */}
      {isActive && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
          <ul className="flex flex-col">
            <li
              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={openSetting}
            >
              <FaCog className="mr-2 text-gray-600" />
              <span>설정</span>
            </li>
            <li
              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={openPlanUpgrade}
            >
              <FaGem className="mr-2 text-blue-500" />
              <span>플랜 업그레이드</span>
            </li>
            <li
              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
              onClick={openLogout}
            >
              <FaSignOutAlt className="mr-2" />
              <span>로그아웃</span>
            </li>
          </ul>
        </div>
      )}

      {/* 모달 오버레이와 컨테이너: 어느 하나라도 활성화되어 있으면 렌더링 */}
      {(isSettingModalOpen || isPlanUpgradeModalOpen || isLogoutModalOpen) && (
        <>
          {/* 배경 오버레이 */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[99]"
            onClick={closeAllModals}
          ></div>
          {/* 모달 컨테이너 */}
          <div className="fixed inset-0 flex items-center justify-center z-[100]">
            {isSettingModalOpen && (
              <SettingModal onClose={closeAllModals} />
            )}
            {isPlanUpgradeModalOpen && (
              <PlanUpgradeModal onClose={closeAllModals} />
            )}
            {isLogoutModalOpen && (
              <LogoutModal onClose={closeAllModals} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
