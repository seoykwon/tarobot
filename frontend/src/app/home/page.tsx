import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { ChevronRight, GamepadIcon } from "lucide-react";
import Image from "next/image";
import { API_URLS } from "@/config/api";
import { Label } from '@/components/ui/Label';

interface Fortune {
  date: string;
  fortune: string;
  luckyNumber: number;
}

interface Tarotbot {
  id: number;
  name: string;
  description: string;
  rating: number;
  profileImage: string;
}

interface MiniGame {
  gameId: number;
  name: string;
  description: string;
}

// 서버에서 데이터 가져오기 함수
async function fetchData<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      console.error(`Failed to fetch data from ${url}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return null;
  }
}

export default async function HomePage() {
  // 서버에서 데이터 가져오기
  const fortune = await fetchData<Fortune>(API_URLS.FORTUNE);
  const tarotbots = (await fetchData<Tarotbot[]>(API_URLS.TAROTBOTS.LIST)) ?? [];
  const miniGames = (await fetchData<MiniGame[]>(API_URLS.GAME.LIST)) ?? [];

  return (
    <main className="min-h-[calc(100svh-128px)] bg-transparent pt-8 px-0 md:px-4 lg:px-16 
  flex flex-col gap-y-6 transition-all duration-300 w-full max-w-3xl mx-auto 
  overflow-auto pb-[env(safe-area-inset-bottom)]">
      
      {/* Today's Fortune */}
      <Card className="bg-transparent hover:bg-accent/20 transition-colors p-4 w-full max-w-lg min-h-[200px] mx-auto">
        <section>
          <h2 className="font-page-title">오늘의 운세</h2>
          {fortune ? (
            <Link href="/daily">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="relative w-16 h-24 flex-shrink-0">
                    <GamepadIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-tarotbot-title mb-1">{fortune.fortune}</h3>
                    <p className="font-tarotbot-description text-muted-foreground">
                      Lucky Number: {fortune.luckyNumber}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Link>
          ) : (
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              {/* 카드 뒷면 이미지는 카드 비율(2:3)에 맞춰 96×144 크기로 표시 */}
              <Image
                src="/card-back-celestial.svg"
                alt="Card Back"
                width={96}
                height={144}
                className="rounded-lg object-cover"
              />
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
      <Card className="bg-transparent hover:bg-accent/20 transition-colors p-4 w-full max-w-lg mx-auto">
        <section>
          <Link href="/tarot">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-page-title">Tarot Masters</h2>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Link>
          {tarotbots.length > 0 ? (
            <div className="gap-y-2 flex flex-col">
              {tarotbots.slice(0, 3).map((master) => (
                <Link key={master.id} href={`/tarot/bots/${master.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        <Image 
                          src={master.profileImage} 
                          alt={master.name} 
                          width={48} 
                          height={48} 
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <h3 className="font-tarotbot-title">{master.name}</h3>
                        <p className="font-tarotbot-subtitle">{master.description}</p>
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
      <Card className="bg-transparent hover:bg-accent/20 transition-colors p-4 w-full max-w-lg mx-auto">
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
                      <h3 className="font-tarotbot-title">{game.name}</h3>
                      <p className="font-tarotbot-subtitle text-muted-foreground">{game.description}</p>
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
      
    </main>
  );
}
