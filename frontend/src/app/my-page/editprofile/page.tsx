"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Next.js의 useRouter 훅

export default function UpdateProfilePage() {
  const [profileImage, setProfileImage] = useState<string | null>(null); // 프로필 이미지
  const [nickname, setNickname] = useState(""); // 닉네임
  const [birthDate, setBirthDate] = useState(""); // 생년월일
  const [gender, setGender] = useState(""); // 성별
  const [email, setEmail] = useState(""); // 이메일
  const router = useRouter(); // 라우터 객체 생성

  // 이미지 업로드 핸들러
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file); // 이미지 URL 생성
      setProfileImage(imageUrl);
    }
  };

  // 저장 버튼 클릭 핸들러
  const handleSaveChanges = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      // API 호출
      // 임시로 민경훈 프로필 사용 => 인자로 받아서 사용하거나, JWT로 인증 받아 사용하자
      const userId = "mgh123rg@gmail.com";
      const response = await fetch(`http://localhost:8080/api/v1/user-profiles/${userId}`, {
        method: "PATCH",
        credentials: "include", // 쿠키 포함
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, gender, email, profileImage, birthDate }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      // 저장 완료 알림
      alert("프로필이 성공적으로 업데이트되었습니다!");

      // mypage로 이동
      router.push("/my-page");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("프로필 업데이트 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gray-900 pb-16">
      {/* 헤더 */}
      <header className="w-full max-w-md text-center mb-6">
        <h1 className="text-2xl font-bold">Update Your Profile</h1>
        <p className="text-gray-400">Keep your information up to date</p>
      </header>

      {/* 폼 */}
      <form onSubmit={handleSaveChanges} className="w-full max-w-md space-y-6">
        {/* 이미지 변경 */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden mb-4">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
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

        {/* 닉네임 변경 */}
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

        {/* 생년월일 변경 */}
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

        {/* 성별 변경 */}
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

        {/* 이메일 변경 */}
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
