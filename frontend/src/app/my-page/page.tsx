"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/Loading";
import { User, Settings, LogOut, Star } from "lucide-react";

interface TarotRecord {
  id: number;
  date: string;
  question: string;
  result: string;
}

interface UserInfo {
  name: string;
  email: string;
}

export default function MyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [tarotRecords, setTarotRecords] = useState<TarotRecord[]>([]);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        // 로그인 상태 확인 및 데이터 요청
        const response = await fetch("http://localhost:8080/api/user-info", {
          method: "GET",
          credentials: "include", // 쿠키 포함
        });

        if (response.ok) {
          const data = await response.json();

          // 데이터 설정
          setUserInfo(data.userInfo); // 사용자 정보
          setTarotRecords(data.tarotRecords); // 최근 타로 기록
        } else if (response.status === 401) {
          // 인증 실패 시 로그인 페이지로 리다이렉트
          router.push("/auth/login");
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/auth/login"); // 에러 발생 시 로그인 페이지로 이동
      } finally {
        setIsLoading(false); // 로딩 상태 해제
      }
    };

    checkAuthAndFetchData();
  }, [router]);

  const handleLogout = async () => {
    try {
      // 백엔드로 로그아웃 요청
      const response = await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include", // 쿠키 포함
      });

      if (response.ok) {
        // 로그아웃 성공 시 로그인 페이지로 이동
        router.push("/auth/login");
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
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="font-tarobot-title">{userInfo?.name || "사용자님"}</h1>
            <p className="font-article-author text-muted-foreground">{userInfo?.email || "example@email.com"}</p>
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
