"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import InputField from "@/components/InputField";

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      localStorage.setItem("isLoggedIn", "true");
      router.push("/home");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // 구글 로그인 핸들러
  const handleGoogleLogin = async () => {
    try {
      console.log("구글 로그인 버튼 클릭");
      // 여기에 백엔드 API 호출 로직 추가 예정
      router.push("/auth/api/google");
    } catch (error) {
      console.error("구글 로그인 실패:", error);
    }
  };

  // 카카오 로그인 핸들러
  const handleKakaoLogin = async () => {
    try {
      console.log("카카오 로그인 버튼 클릭");
      router.push("/auth/api/kakao");
      // 여기에 백엔드 API 호출 로직 추가 예정
    } catch (error) {
      console.error("카카오 로그인 실패:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">로그인</CardTitle>
          <CardDescription>계정에 로그인하여 타로 여정을 시작하세요</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {/* 이메일 입력 */}
            <InputField
              id="email"
              label="이메일"
              type="email"
              placeholder="name@example.com"
              registration={register("email", {
                required: "이메일을 입력해주세요",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "올바른 이메일 형식이 아닙니다",
                },
              })}
              error={errors.email}
            />

            {/* 비밀번호 입력 */}
            <InputField
              id="password"
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력하세요"
              registration={register("password", {
                required: "비밀번호를 입력해주세요",
                minLength: {
                  value: 6,
                  message: "비밀번호는 최소 6자 이상이어야 합니다",
                },
              })}
              error={errors.password}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            {/* 로그인 버튼 */}
            <Button type="submit" className="w-full">
              로그인
            </Button>

            {/* 구글 소셜 로그인 버튼 */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
            >
              구글로 로그인
            </Button>

            {/* 카카오 소셜 로그인 버튼 */}
            <Button
              type="button"
              variant="outline"
              className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
              onClick={handleKakaoLogin}
            >
              카카오로 로그인
            </Button>
          </CardFooter>
        </form>

        {/* 회원가입 버튼 */}
        <div className="text-sm text-center text-muted-foreground mt-4">
          계정이 없으신가요?{" "}
          <Button
            variant="link"
            className="p-0 h-auto font-normal"
            onClick={() => router.push("/auth/signup")}
          >
            회원가입
          </Button>
        </div>
      </Card>
    </div>
  );
}
