import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { API_URLS } from "@/config/api";

interface GameDetails {
  id: string;
  name: string;
  description: string;
  rating: number;
  imageSrc: string;
  howToPlay: string;
}

// Spring Boot API에서 게임 상세 정보 가져오기
async function fetchGameDetails(id: string): Promise<GameDetails | null> {
  try {
    const response = await fetch(API_URLS.GAME_DETAILS(id), {
      cache: "no-store", // 최신 데이터를 가져오기 위해 캐싱 비활성화
    });

    if (!response.ok) {
      console.error(`Failed to fetch game details for ID: ${id}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching game details:", error);
    return null; // 에러 발생 시 null 반환
  }
}

export default async function GameDetailsPage({ params }: { params: { id: string } }) {
  const gameDetails = await fetchGameDetails(params.id);

  if (!gameDetails) {
    notFound(); // 데이터가 없으면 404 페이지로 이동
  }

  return (
    <main className="min-h-screen bg-background p-4">
      {/* 게임 정보 섹션 */}
      <section className="bg-gray-800 text-white p-6 rounded-lg mb-6">
        <div className="flex items-center gap-4">
          <Image
            src={gameDetails.imageSrc || "/placeholder.svg"} // 이미지가 없을 경우 기본 이미지 사용
            alt={gameDetails.name}
            width={80}
            height={80}
            className="rounded-full"
          />
          <div>
            <h1 className="font-tarobot-title text-xl">{gameDetails.name}</h1>
            <p className="font-tarobot-description text-muted-foreground">{gameDetails.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>{gameDetails.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 게임 방법 섹션 */}
      <section className="bg-gray-700 text-white p-6 rounded-lg mb-6">
        <h2 className="font-tarobot-subtitle mb-4">게임 방법</h2>
        <p>{gameDetails.howToPlay}</p>
      </section>

      {/* 게임 시작 버튼 */}
      <section>
        <Link href={`/game/play/${gameDetails.id}`}>
          <Button size="lg" className="w-full bg-fuchsia-500 hover:bg-fuchsia-600 text-white">
            게임 시작
          </Button>
        </Link>
      </section>
    </main>
  );
}
