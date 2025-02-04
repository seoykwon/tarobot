"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/Loading";
import { Settings, LogOut, Star } from "lucide-react";
import Image from "next/image";

interface TarotRecord {
  id: number;
  date: string;
  question: string;
  result: string;
}

interface UserInfo {
  birthDate: string;
  email: string;
  gender: string;
  nickname: string;
  profileImage: string;
}

export default function MyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [tarotRecords, setTarotRecords] = useState<TarotRecord[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 백엔드로 요청
        const response = await fetch("http://localhost:8080/api/v1/user-profiles/me", {
          method: "GET",
          credentials: "include", // 쿠키 자동 포함
        });

        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
          setTarotRecords(data.tarotRecords || []);
        } else {
          console.error("Failed to fetch user data");
          // if (response.status === 401 || response.status === 403) {
          //   router.push("/login"); // 인증 실패 시 로그인 페이지로 이동
          // }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    try {
      // 백엔드로 로그아웃 요청
      const response = await fetch("http://localhost:8080/api/v1/auth/logout", {
        method: "POST",
        credentials: "include", // 쿠키 포함
      });

      if (response.ok) {
        // 로그아웃 성공 시 로그인 페이지로 이동
        router.push("/auth/login");
        window.location.reload(); // 새로고침하여 상태 반영
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="min-h-screen pb-16">
      <div className="p-4">
        {/* Profile Section */}
        <div className="flex flex-col items-center gap-6 mb-8 p-4 bg-white shadow-md rounded-lg max-w-md mx-auto">
          {/* 프로필 이미지 */}
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shadow-sm">
            <Image
              src={userInfo?.profileImage || "/star.svg"} // 프로필 이미지 또는 기본 이미지
              alt="Profile"
              width={96} // 이미지의 고정 너비 (24px * 4)
              height={96} // 이미지의 고정 높이 (24px * 4)
              className="rounded-full object-cover" // Tailwind 스타일
            />
          </div>

          {/* 사용자 정보 */}
          <div className="text-center">
            <h1 className="font-tarobot-title text-xl font-semibold">{userInfo?.nickname || "사용자님"}</h1>
            <p className="font-article-author text-muted-foreground text-sm">{userInfo?.email || "example@email.com"}</p>
            <p className="text-sm text-muted-foreground mt-2">
              생년월일: {userInfo?.birthDate ? new Date(userInfo.birthDate).toLocaleDateString() : "알 수 없음"}
            </p>
            <p className="text-sm text-muted-foreground">성별: {userInfo?.gender || "알 수 없음"}</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <h2 className="font-tarobot-title">나의 활동</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="ghost"
                className="w-full justify-start font-tarobot-description"
                onClick={() => router.push("/my-page/editprofile")}
              >
                <LogOut className="mr-2 h-4 w-4" />
                개인정보 수정
              </Button>
              <Button variant="ghost" className="w-full justify-start font-tarobot-description" onClick={() => router.push("/my-page/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                설정
              </Button>
              <Button variant="ghost" className="w-full justify-start font-tarobot-description" onClick={() => router.push("/my-page/review")}>
                <Star className="mr-2 h-4 w-4" />
                내가 작성한 리뷰
              </Button>
              <Button variant="ghost" className="w-full justify-start font-tarobot-description" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                로그아웃
              </Button>
            </CardContent>
          </Card>

          {/* 최근 타로 기록 */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="font-tarobot-title">최근 타로 기록</h2>
                <Button
                  variant="link"
                  className="p-0 h-auto font-normal font-article-author"
                  onClick={() => router.push("/diary")}
                >
                  [더보기]
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {tarotRecords.length > 0 ? (
                <div className="space-y-4">
                  {tarotRecords.slice(0, 5).map((record) => (
                    <div key={record.id} className="border-b pb-2 last:border-0">
                      <div className="flex justify-between items-center">
                        <p className="font-medium">{record.question}</p>
                        <span className="text-sm text-muted-foreground">
                          {new Date(record.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{record.result}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-tarobot-description text-muted-foreground">아직 타로 기록이 없습니다.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
