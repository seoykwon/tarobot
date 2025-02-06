"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { loginRequest } from "../api/login/route";
import { kakaoLoginRequest } from "../api/kakao/route";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
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

  // 일반 로그인 핸들러
  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginRequest(data.email, data.password); // 로그인 API 호출
      // 1초 후 홈으로 이동한 뒤 새로고침
      await router.push("/home"); // 먼저 페이지 이동
      setTimeout(async () => {
        window.location.reload(); // 이동 후 새로고침
      }, 1000);
    } catch (error: any) {
      console.error("Login failed:", error.message);
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  // Google 로그인 핸들러
  const handleGoogleLogin = async () => {
    try {
      // 구글 로그인 URL을 새 창으로 오픈합니다.
      const loginUrl = "http://localhost:8080/oauth2/authorization/google";
      const loginWindow = window.open(loginUrl, "_blank", "width=500,height=600");
      
      // 일정 간격으로 팝업 창이 닫혔는지 확인합니다.
      const checkPopup = setInterval(() => {
        if (loginWindow && loginWindow.closed) {
          clearInterval(checkPopup);
          // 팝업 창이 닫혔으면, 로그인 성공 여부를 판단할 수 있도록 추가 확인 로직을 넣을 수도 있습니다.
          // 여기서는 바로 홈 화면으로 이동하고 새로고침합니다.
          router.push("/home");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }, 1000);
    } catch (error: any) {
      console.error("Google login failed:", error.message);
      alert("Google 로그인 중 오류가 발생했습니다.");
    }
  };

  // Kakao 로그인 핸들러
  const handleKakaoLogin = async () => {
    try {
      await kakaoLoginRequest(); // Kakao API 호출
      router.push("/home"); // 성공 시 홈으로 이동
    } catch (error: any) {
      console.error("Kakao login failed:", error.message);
      alert("Kakao 로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">로그인</CardTitle>
          <CardDescription>
            계정에 로그인하여 타로 여정을 시작하세요
          </CardDescription>
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
            {/* 일반 로그인 버튼 */}
            <Button type="submit" className="w-full">
              로그인
            </Button>

            {/* Google 소셜 로그인 버튼 */}
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={handleGoogleLogin}
            >
              <Image
                src="/google_logo.svg"
                alt="Google Icon"
                width={20}
                height={20}
                className="mr-2"
              />
              구글로 로그인
            </Button>

            {/* Kakao 소셜 로그인 버튼 */}
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center bg-yellow-400 text-black hover:bg-yellow-500"
              onClick={handleKakaoLogin}
            >
              <Image
                src="/kakao_logo.svg"
                alt="Kakao Icon"
                width={20}
                height={20}
                className="mr-2"
              />
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
