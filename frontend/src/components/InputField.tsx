"use client";

import React from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { cn } from "@/libs/utils"; // 클래스 병합 유틸리티 (Tailwind CSS 사용 시)

type InputProps = {
  label: string; // 필드 레이블
  id: string; // 필드 ID
  type?: string; // 입력 타입 (기본값: text)
  placeholder?: string; // 플레이스홀더
  error?: FieldError; // 유효성 검사 에러 메시지
  registration: UseFormRegisterReturn; // React Hook Form의 register 반환값
};

const InputField: React.FC<InputProps> = ({
  label,
  id,
  type = "text",
  placeholder,
  error,
  registration,
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        {...registration}
        className={cn(
          "block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
          error ? "border-red-500 focus:ring-red-500" : "border-gray-300"
        )}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default InputField;
