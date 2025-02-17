// app/page.tsx (서버 컴포넌트)
import Image from "next/image";
import GoogleLoginButton from "@/components/Login/GoogleLoginButton";

export default function WelcomePage({ searchParams }: { searchParams: { redirect?: string } }) {
  const redirect = searchParams?.redirect || "/home"; // 기본값으로 "/home" 설정

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="flex flex-col items-center gap-10 max-w-lg mx-auto text-center">
        {/* 캐릭터 이미지 */}
        <div>
          <Image
            src="/cardcat.avif"
            alt="캐릭터 이미지"
            width={400}
            height={200}
            priority
            className="mx-auto w-auto"
          />
        </div>

        {/* 텍스트와 버튼 */}
        <div>
          <h1 className="text-3xl font-bold mb-4 leading-relaxed">
            안녕하세요! <br /> 미루에 온 것을 환영합니다!
          </h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            당신의 고민을 해결해드리기 위한 타로 마스터들이 기다리고 있어요.
          </p>
          {/* 구글 로그인 버튼에 redirect 경로 전달 */}
          <GoogleLoginButton redirect={redirect} />
        </div>
      </div>
    </div>
  );
}
