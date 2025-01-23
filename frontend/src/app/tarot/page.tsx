// src/app/tarot/page.tsx
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

interface TarotBot {
  id: string;
  name: string;
  description: string;
  rating: number;
}

// Spring Boot API에서 타로봇 리스트 가져오기
async function fetchTarotBots(): Promise<TarotBot[]> {
  try {
    const response = await fetch("http://localhost:8080/api/tarot-bots", {
      cache: "no-store", // 항상 최신 데이터를 가져오기
    });

    if (!response.ok) {
      console.error("Failed to fetch tarot bots");
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching tarot bots:", error);
    return [];
  }
}

// 타로봇 리스트 페이지
export default async function TarotBotsPage() {
  const bots = await fetchTarotBots(); // 서버에서 데이터 가져오기

  return (
    <main className="min-h-screen pb-16">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Master list</h1>
        <div className="grid gap-4">
          {bots.map((bot) => (
            <Link key={bot.id} href={`/tarot/bots/${bot.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex gap-4 p-4">
                  {/* 이미지 */}
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src="/target.svg" alt={bot.name} width={96} height={96} />
                  </div>

                  {/* 카드 내용 */}
                  <CardContent className="p-0 flex-1">
                    {/* 이름 */}
                    <h2 className="text-lg font-semibold">{bot.name}</h2>
                    {/* 설명 */}
                    <p className="text-sm text-muted-foreground mb-2">{bot.description}</p>
                    {/* 평점 */}
                    <div className="flex items-center gap-1 text-sm">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          className={`w-4 h-4 ${
                            index < Math.floor(bot.rating)
                              ? "fill-primary text-primary"
                              : "text-gray-400"
                          }`}
                        />
                      ))}
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
