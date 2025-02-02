"use client";

import { useTransition, useState } from "react";
import { toggleTheme } from "../app/actions";

export default function DarkModeToggle({ initialTheme }: { initialTheme: string }) {
  const [isDark, setIsDark] = useState(initialTheme === "dark");
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const newTheme = await toggleTheme(); // 서버에서 다크 모드 변경
      setIsDark(newTheme === "dark");
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className="p-2 rounded-md bg-gray-800 text-white dark:bg-gray-200 dark:text-black"
    >
      {isDark ? "☀️ 라이트 모드" : "🌙 다크 모드"}
    </button>
  );
}
