import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { ChevronRight, GamepadIcon } from "lucide-react";
import CardSelector from "./CardShuffle";

interface Fortune {
  date: string;
  fortune: string;
  luckyNumber: number;
}

interface Tarobot {
  tarobotId: number;
  name: string;
  description: string;
  rating: number;
}

interface MiniGame {
  gameId: number;
  name: string;
  description: string;
}

// 서버에서 데이터 가져오기 함수
async function fetchData<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, { cache: "no-store" }); // SSR에서 최신 데이터 가져오기
    if (!response.ok) {
      console.error(`Failed to fetch data from ${url}`);
      return null; // 에러 발생 시 null 반환
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return null; // 네트워크 에러 등 발생 시 null 반환
  }
}

export default async function HomePage() {
  // 서버에서 데이터 가져오기
  const fortune = await fetchData<Fortune>("http://localhost:8080/api/main/fortune");
  const tarobots = (await fetchData<Tarobot[]>("http://localhost:8080/api/main/tarobots")) ?? []; // Null 방지
  const miniGames = (await fetchData<MiniGame[]>("http://localhost:8080/api/main/minigames")) ?? []; // Null 방지

  return (
    <main className="min-h-screen pb-16 pt-8 px-4 flex flex-col gap-y-6 transition-all duration-300">
      {/* Today's Fortune */}
      <Card className="bg-card hover:bg-accent/50 transition-colors p-4 w-full max-w-lg min-h-[200px] mx-auto">
        <section>
          <h2 className="font-page-title">Today's Fortune</h2>
          {fortune ? (
            <Link href="/daily">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="relative w-16 h-24 flex-shrink-0">
                    <GamepadIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-tarobot-title mb-1">{fortune.fortune}</h3>
                    <p className="font-tarobot-description text-muted-foreground">
                      Lucky Number: {fortune.luckyNumber}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Link>
          ) : (
            <p>No fortune available for today.</p>
          )}
        </section>
      </Card>
    <main className="min-h-screen bg-background pb-16">
      {/* Header
      <header className="p-4 text-center border-b">
        <h1 className="font-login-title">MysticPixel</h1>
      </header> */}

      <div className="p-4 space-y-6">
        {/* Today's Fortune */}
        <Card className="bg-card hover:bg-accent/50 transition-colors p-4">
          <section>
            <h2 className="font-page-title">Today's Fortune</h2>
            {fortune ? (
              <Link href="/daily">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative w-16 h-24 flex-shrink-0">
                      <GamepadIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-tarobot-title mb-1">{fortune.fortune}</h3>
                      <p className="font-tarobot-description text-muted-foreground">
                        Lucky Number: {fortune.luckyNumber}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Link>
              ) : (
              // 오늘의 타로 결과가 없을 경우
              <div className="text-center space-y-4">
                <p>오늘의 운세를 확인해보세요!!</p>
                <Link href="/daily">
                  <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
                    확인하기
                  </button>
                </Link>
              </div>
            )}
          </section>
        </Card>

        {/* Tarot Masters */}
        <Card className="hover:bg-accent/50 transition-colors p-4">
        <section>
          <Link href="/tarot">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-page-title">Tarot Masters</h2>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Link>
          {tarobots.length > 0 ? (
            <div className="gap-y-2 flex flex-col">
              {tarobots.slice(0, 3).map((master) => (
                <Link key={master.tarobotId} href={`/tarot/bots/${master.tarobotId}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        <GamepadIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-tarobot-title">{master.name}</h3>
                        <p className="font-tarobot-subtitle">{master.description}</p>
                        <p className="text-sm text-muted-foreground">Rating: {master.rating}</p>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              ))}
            </div>
          ) : (
            <p>No tarot masters available.</p>
          )}
        </section>
      </Card>

      {/* Mini-Games */}
      <Card className="hover:bg-accent/50 transition-colors p-4 w-full max-w-lg min-h-[200px] mx-auto">
        <section>
          <Link href="/game">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-page-title">Mini-Games</h2>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Link>
          {miniGames.length > 0 ? (
            miniGames.slice(0, 3).map((game) => (
              <Link key={game.gameId} href={`/games/${game.gameId}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
                      <GamepadIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-tarobot-title">{game.name}</h3>
                      <p className="font-tarobot-subtitle text-muted-foreground">{game.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Link>
            ))
          ) : (
            <p>No mini-games available.</p>
          )}
        </section>
      </Card>

      {/* 카드 셀렉터 */}
      <section className="w-full max-w-lg mx-auto">
        <CardSelector />
      </section>
    </main>
  );
}
