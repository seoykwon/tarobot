import Image from "next/image"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { notFound } from "next/navigation"

interface GameDetails {
  id: string
  name: string
  description: string
  rating: number
  imageSrc: string
  howToPlay: string
}

// Spring Boot API에서 게임 상세 정보 가져오기
async function fetchGameDetails(id: string): Promise<GameDetails | null> {
  // TODO: 실제 API 호출로 대체
  // try {
  //   const response = await fetch(`http://localhost:8080/api/games/${id}`, {
  //     cache: "no-store",
  //   });

  //   if (!response.ok) {
  //     return null;
  //   }

  //   return await response.json();
  // } catch (error) {
  //   console.error("Error fetching game details:", error);
  //   return null;
  // }

  // 임시 데이터
  const games: { [key: string]: GameDetails } = {
    "1": {
      id: "1",
      name: "퍼즐 게임",
      description: "두뇌를 자극하는 퍼즐을 풀어보세요.",
      rating: 4.5,
      imageSrc: "/games/puzzle.svg",
      howToPlay: "퍼즐 조각을 드래그하여 올바른 위치에 놓으세요. 모든 조각을 맞추면 게임 클리어!",
    },
    "2": {
      id: "2",
      name: "주사위 게임",
      description: "운을 시험해보는 주사위 게임입니다.",
      rating: 4.2,
      imageSrc: "/games/dice.svg",
      howToPlay: "주사위를 굴려 높은 숫자를 얻으세요. 상대방보다 높은 숫자가 나오면 승리!",
    },
    "3": {
      id: "3",
      name: "기억력 게임",
      description: "당신의 기억력을 테스트해보세요.",
      rating: 4.7,
      imageSrc: "/games/memory.svg",
      howToPlay: "카드를 뒤집어 같은 그림의 카드를 찾으세요. 모든 카드 쌍을 찾으면 게임 클리어!",
    },
  }

  return games[id] || null
}

export default async function GameDetailsPage({ params }: { params: { id: string } }) {
  const gameDetails = await fetchGameDetails(params.id)

  if (!gameDetails) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background p-4">
      <section className="bg-gray-800 text-white p-6 rounded-lg mb-6">
        <div className="flex items-center gap-4">
          <Image
            src={gameDetails.imageSrc || "/placeholder.svg"}
            alt={gameDetails.name}
            width={80}
            height={80}
            className="rounded-full"
          />
          <div>
            <h1 className="font-tarobot-title">{gameDetails.name}</h1>
            <p className="font-tarobot-description">{gameDetails.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>{gameDetails.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-700 text-white p-6 rounded-lg mb-6">
        <h2 className="font-tarobot-subtitle mb-4">게임 방법</h2>
        <p>{gameDetails.howToPlay}</p>
      </section>

      <section>
        <Link href={`/game/play/${gameDetails.id}`}>
          <Button size="lg" className="w-full bg-fuchsia-500 hover:bg-fuchsia-600 text-white">
            게임 시작
          </Button>
        </Link>
      </section>
    </main>
  )
}

