"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import InputField from "@/components/InputField";

// 폼 데이터 타입 정의
type SignupFormData = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

export default function SignupPage() {
  const router = useRouter();

  // React Hook Form 설정
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupFormData>();

  // 비밀번호 확인을 위해 현재 비밀번호 값 감시
  const password = watch("password");

  // 폼 제출 처리
  const onSubmit = async (data: SignupFormData) => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.status === 200) {
        alert("회원가입이 완료되었습니다.");
        router.push("/auth/login");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "회원가입에 실패하였습니다.");
      }
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">회원가입</CardTitle>
          <CardDescription>새로운 계정을 만들어 타로 여정을 시작하세요</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {/* 이름 입력 */}
            <InputField
              id="name"
              label="이름"
              placeholder="타로봇"
              registration={register("name", {
                required: "이름을 입력해주세요",
              })}
              error={errors.name}
            />

            {/* 이메일 입력 */}
            <InputField
              id="email"
              label="이메일"
              type="email"
              placeholder="tarot@example.com"
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

            {/* 비밀번호 확인 입력 */}
            <InputField
              id="passwordConfirm"
              label="비밀번호 확인"
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              registration={register("passwordConfirm", {
                required: "비밀번호 확인을 입력해주세요",
                validate: (value) => value === password || "비밀번호가 일치하지 않습니다",
              })}
              error={errors.passwordConfirm}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            {/* 회원가입 버튼 */}
            <Button type="submit" className="w-full">
              회원가입
            </Button>
          </CardFooter>
        </form>

        {/* 로그인 버튼 */}
        <div className="text-sm text-center text-muted-foreground mt-4">
          이미 계정이 있으신가요?{" "}
          <Button
            variant="link"
            className="p-0 h-auto font-normal"
            onClick={() => router.push("/auth/login")}
          >
            로그인
          </Button>
        </div>
      </Card>
    </div>
  );
}
