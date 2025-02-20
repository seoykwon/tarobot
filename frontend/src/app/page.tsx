import Image from "next/image";
import GoogleLoginButton from "@/components/Login/GoogleLoginButton";

export default function WelcomePage({ searchParams }: { searchParams: { redirect?: string } }) {
  const redirect = searchParams?.redirect || "/chat"; // 기본값으로 "/chat" 설정

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white px-6">
      <div className="flex flex-col lg:flex-row items-center gap-10 max-w-5xl mx-auto text-center lg:text-left">
        {/* 왼쪽: 캐릭터 이미지 */}
        <div className="flex justify-center lg:w-1/2">
          <Image
            src="/cardcat.avif"
            alt="캐릭터 이미지"
            width={400}
            height={300}
            priority
            className="w-full max-w-md rounded-lg shadow-lg"
          />
        </div>

        {/* 오른쪽: 텍스트와 버튼 */}
        <div className="flex flex-col items-center lg:items-start lg:w-1/2 gap-6">
          <h1 className="text-4xl font-extrabold leading-relaxed text-purple-600">
            보라에 오신 것을 환영합니다!
          </h1>
          <p className="text-gray-700 leading-relaxed text-lg">
            🎉 다양한 사람들과 실시간 채팅을 즐기세요!<br />
            🎙️ 음성 채팅으로 더 생생하게 대화하세요.<br />
            🔮 타로 봇과 함께 나만의 운세를 확인하세요.<br />
            📔 다이어리에 소중한 기억을 기록해보세요.
          </p>
          {/* 구글 로그인 버튼 */}
          <GoogleLoginButton redirect={redirect} />
        </div>
      </div>
    </div>
  );
}
