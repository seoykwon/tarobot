import { TarotGame } from "@/components/TarotGame"

interface Game {
  id: string
  name: string
  description: string
}

async function fetchGames(): Promise<Game[]> {
  // TODO: 실제 API 호출로 대체
  // 임시 데이터
  return [
    { id: "1", name: "퍼즐 게임", description: "두뇌를 자극하는 퍼즐을 풀어보세요." },
    { id: "2", name: "주사위 게임", description: "운을 시험해보는 주사위 게임입니다." },
    { id: "3", name: "기억력 게임", description: "당신의 기억력을 테스트해보세요." },
  ]
}

export default async function GamePage() {
  const games = await fetchGames()

  return (
    <main className="min-h-screen pb-16">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">미니게임 목록</h1>
        <div className="grid gap-4">
          {games.map((game) => (
            <TarotGame
              key={game.id}
              id={game.id}
              name={game.name}
              description={game.description}
              imageSrc={`/games/${game.id}.svg`}
              linkPrefix="/game"
            />
          ))}
        </div>
      </div>
    </main>
  )
}

