import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { ChevronRight, GamepadIcon } from "lucide-react";

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
  const tarobots = await fetchData<Tarobot[]>("http://localhost:8080/api/main/tarobots");
  const miniGames = await fetchData<MiniGame[]>("http://localhost:8080/api/main/minigames");

  return (
    <main className="min-h-screen bg-background pb-16">
      {/* Header */}
      <header className="p-4 text-center border-b">
        <h1 className="font-login-title">MysticPixel</h1>
      </header>

      <div className="p-4 space-y-6">
        {/* Today's Fortune */}
        <section>
          <h2 className="font-page-title">Today&atos;s Fortune</h2>
          {fortune ? (
            <Link href="/tarot/daily">
              <Card className="hover:bg-accent/50 transition-colors">
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
              </Card>
            </Link>
          ) : (
            <p>No fortune available for today.</p> // 데이터 없을 때 메시지 표시
          )}
        </section>

        {/* Tarot Masters */}
        <section>
          <Link href="/tarot">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-page-title">Tarot Masters</h2>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Link>
          {tarobots && tarobots.length > 0 ? (
            <div className="space-y-2">
              {tarobots.map((master) => (
                <Link key={master.tarobotId} href={`/tarot/bots/${master.tarobotId}`}>
                  <Card className="hover:bg-accent/50 transition-colors">
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
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p>No tarot masters available.</p> // 데이터 없을 때 메시지 표시
          )}
        </section>

        {/* Mini-Games */}
        <section>
          <Link href="/game">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-page-title">Mini-Games</h2>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Link>
          {miniGames && miniGames.length > 0 ? (
            miniGames.map((game) => (
              <Link key={game.gameId} href={`/games/${game.gameId}`}>
                <Card className="hover:bg-accent/50 transition-colors">
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
                </Card>
              </Link>
            ))
          ) : (
            <p>No mini-games available.</p> // 데이터 없을 때 메시지 표시
          )}
        </section>
      </div>
    </main>
  );
}
