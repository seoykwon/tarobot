"use server";

import { cookies } from "next/headers";

export async function toggleTheme() {
  const theme = cookies().get("theme")?.value === "dark" ? "light" : "dark";
  cookies().set("theme", theme, { path: "/", maxAge: 60 * 60 * 24 * 365 });

  return theme; // 변경된 테마 반환
}
