import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface TarotRecord {
  id: number;
  date: string;
  question: string;
  result: string;
}

export default async function MyPage() {
  const cookieStore = cookies();
  const JWTtoken = cookieStore.get("jwtToken")?.value;

//   // 로그인 상태 확인
//   if (!JWTtoken) {
//     redirect("/auth/login"); // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
//   }

  // 타로 기록 가져오기 (SSR)
  const response = await fetch("http://localhost:8080/api/tarot-records", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${JWTtoken}`,
    },
    cache: "no-store", // 항상 최신 데이터를 가져오기 위해 캐싱 비활성화
  });

  const tarotRecords: TarotRecord[] = response.ok ? await response.json() : [];

  return (
    <main className="min-h-screen pb-16">
      <div className="p-4">
        {/* Profile Section */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <h1>사용자님</h1>
          </div>
          <div>
            <h1 className="font-tarobot-title">사용자님</h1>
            <p className="font-tarobot-description text-muted-foreground">example@email.com</p>
          </div>
        </div>

        {/* 타로 기록 */}
        <div className="space-y-4">
          {tarotRecords.length > 0 ? (
            <>
              {tarotRecords.slice(0, 5).map((record) => (
                <div key={record.id} className="border-b pb-2 last:border-0">
                  <div className="flex justify-between items-center">
                    <p className="font-tarobot-subtitle">{record.question}</p>
                    <span className="font-article-author text-muted-foreground">
                      {new Date(record.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-tarobot-description text-muted-foreground mt-1">{record.result}</p>
                </div>
              ))}
              {/* 더보기 버튼 */}
              <button
                onClick={() => redirect("/diary")}
                className="text-primary hover:underline"
              >
                [더보기]
              </button>
            </>
          ) : (
            <p className="font-tarobot-description text-muted-foreground">아직 타로 기록이 없습니다.</p>
          )}
        </div>
      </div>
    </main>
  );
}
