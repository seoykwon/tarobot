import { TarotGame } from "@/components/TarotGame";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { ChevronRight, GamepadIcon } from "lucide-react";
import CardSelector from "../home/CardShuffle";
interface Game {
  minigameId: number;
  name: string;
  description: string;
}

async function fetchGames(): Promise<Game[]> {
  try {
    const response = await fetch("http://localhost:8080/minigames", { cache: "no-store" }); // SSR에서 최신 데이터 가져오기
    if (!response.ok) {
      throw new Error("Failed to fetch mini-games");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching mini-games:", error);
    return []; // 에러 발생 시 빈 배열 반환
  }
}

export default async function GamePage() {
  const games = await fetchGames(); // API에서 미니게임 목록 가져오기

  return (
    <main className="min-h-screen pb-16">
      <div className="p-4">
        <h1 className="font-page-title mb-4">미니게임 목록</h1>
        {games.length > 0 ? (
          <div className="grid gap-4">
            {games.map((game) => (
              <TarotGame
                key={game.minigameId}
                id={game.minigameId.toString()}
                name={game.name}
                description={game.description}
                imageSrc={`/games/${game.minigameId}.svg`} // 이미지 경로
                linkPrefix="/game" // 게임 상세 페이지 링크
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">사용 가능한 미니게임이 없습니다.</p>
        )}
      </div>
    </main>
  );
}
