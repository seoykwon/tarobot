"use client";

import { useState, useEffect, useCallback } from "react";
import { API_URLS } from "@/config/api";
import Image from "next/image";

export default function ProfileSettings() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [nickname, setNickname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  // userId는 실제 로그인정보 혹은 인증 토큰을 통해 가져오는 값으로 대체
  const userId = "mgh123rg@gmail.com";

  // 내 프로필 데이터를 백엔드에서 가져오는 함수
  const fetchProfileData = useCallback(async () => {
    try {
      const res = await fetch(API_URLS.USER.BY_ID(userId), {    // ME로 내 정보 가져오도록 바꿀 예정
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setProfileImage(data.profileIcon || null);
        setNickname(data.nickname || "");
        setBirthDate(data.birthDate || "");
        setGender(data.gender || "");
        setEmail(data.email || "");
      } else {
        console.error("프로필 데이터를 불러오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("프로필 데이터 요청 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // 컴포넌트 마운트 시 프로필 데이터 불러오기
  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  // 이미지 업로드 핸들러 (파일 선택 시 미리보기 표시)
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  // 저장 버튼 클릭 핸들러: PATCH 요청 후 최신 데이터를 다시 불러옴
  const handleSaveChanges = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch(API_URLS.USER.BY_ID(userId), {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, gender, email, profileImage, birthDate }),
      });

      if (!response.ok) {
        throw new Error("프로필 업데이트 실패");
      }
      alert("프로필이 성공적으로 업데이트되었습니다!");
      // 페이지 이동 없이 최신 데이터를 다시 불러와 컴포넌트를 새로고침
      fetchProfileData();
    } catch (error) {
      console.error("프로필 업데이트 중 오류:", error);
      alert("프로필 업데이트 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-2">내 정보 수정</h2>
      <form onSubmit={handleSaveChanges} className="space-y-4">
        {/* 이미지 변경 영역 */}
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden mb-4">
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Profile"
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <span className="text-gray-400">No Image</span>
            )}
          </div>
          <label
            htmlFor="profile-image"
            className="px-4 py-2 bg-fuchsia-500 hover:bg-fuchsia-600 text-white rounded-lg cursor-pointer"
          >
            Change Image
          </label>
          <input
            type="file"
            id="profile-image"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        {/* 닉네임 입력 */}
        <div>
          <label htmlFor="nickname" className="block text-sm font-medium mb-2">
            Nickname
          </label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Enter your nickname"
            className="w-full p-2 rounded-lg text-black placeholder-gray-500 border"
          />
        </div>
        {/* 생년월일 입력 */}
        <div>
          <label htmlFor="birth-date" className="block text-sm font-medium mb-2">
            Birth Date
          </label>
          <input
            type="date"
            id="birth-date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full p-2 rounded-lg text-black placeholder-gray-500 border"
          />
        </div>
        {/* 성별 선택 */}
        <div>
          <label htmlFor="gender" className="block text-sm font-medium mb-2">
            Gender
          </label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full p-2 rounded-lg text-black placeholder-gray-500 border"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        {/* 이메일 입력 */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full p-2 rounded-lg text-black placeholder-gray-500 border"
          />
        </div>
        {/* 저장 버튼 */}
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-semibold transition-colors"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
