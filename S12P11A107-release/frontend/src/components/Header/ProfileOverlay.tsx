"use client";

import { useState, useEffect } from "react";
import { FaCog, FaSignOutAlt } from "react-icons/fa";
import SettingModal from "../ProfileModal/SettingModal";
import LogoutModal from "../ProfileModal/LogoutModal";
import Image from "next/image";
import { API_URLS } from "@/config/api";

export default function ProfileOverlay({
  isActive,
  toggle,
}: {
  isActive: boolean;
  toggle: () => void;
}) {
  const [isSettingModalOpen, setSettingModalOpen] = useState(false);
  const [isPlanUpgradeModalOpen, setPlanUpgradeModalOpen] = useState(false);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string>("/favicon.ico"); // 기본 이미지 설정

  // 백엔드에서 프로필 데이터 가져오기
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(API_URLS.USER.ME, {
          method: "GET",
          credentials: "include", // 쿠키 포함
        });

        if (response.ok) {
          const data = await response.json();
          setProfileImage(data.profileImage || "/favicon.ico"); // 프로필 이미지가 없으면 기본 이미지 사용
        } else {
          console.error("프로필 데이터를 불러오는 데 실패했습니다.");
        }
      } catch (error) {
        console.error("프로필 데이터 요청 중 오류 발생:", error);
      }
    };

    fetchProfileData();
  }, []);

  // 모달 열기 시 프로필 메뉴는 닫힘
  const openSetting = () => {
    setSettingModalOpen(true);
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
      <button onClick={toggle} className="w-10 h-10 rounded-full overflow-hidden bg-gray-300">
        <Image
          src={profileImage}
          alt="Profile"
          width={40}
          height={40}
          className="object-cover"
        />
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
            {isLogoutModalOpen && (
              <LogoutModal onClose={closeAllModals} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
