"use client";

import React from "react";

export default function UpdateProfilePage() {
  return (
    <div className="min-h-screen text-white flex flex-col items-center p-4">
      {/* 헤더 */}
      <header className="w-full max-w-md text-center mb-6">
        <h1 className="text-2xl font-bold">Update Your Profile</h1>
        <p className="text-gray-400">Keep your information up to date</p>
      </header>

      {/* 폼 */}
      <form className="w-full max-w-md space-y-6">
        {/* 이름 입력 */}
        <div>
          <label htmlFor="full-name" className="block text-sm font-medium mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="full-name"
            placeholder="Enter your full name"
            className="w-full p-2 rounded-lg text-white placeholder-gray-500 border"
          />
        </div>

        {/* 직업 입력 */}
        <div>
          <label htmlFor="occupation" className="block text-sm font-medium mb-2">
            Occupation
          </label>
          <input
            type="text"
            id="occupation"
            placeholder="Enter your occupation"
            className="w-full p-2 rounded-lg text-white placeholder-gray-500 border"
          />
        </div>

        {/* 이메일 입력 */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email address"
            className="w-full p-2 rounded-lg text-white placeholder-gray-500 border"
          />
        </div>

        {/* 체크박스 */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="updates-promotions"
            className="h-5 w-5 accent-fuchsia-500"
          />
          <label htmlFor="updates-promotions" className="text-sm text-black">
            I agree to receive updates and promotions
          </label>
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
