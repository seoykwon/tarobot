import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { BottomNav } from "@/components/BottomNav";
import { Star, TrendingUp, Calendar, Users } from "lucide-react";

async function fetchTarotBots() {
  try {
    const response = await fetch("http://localhost:8080/api/v1/tarot-bots", {
      next: { revalidate: 60 }, // 데이터 재검증 (옵션)
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tarot bots");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching tarot bots:", error);
    return [];
  }
}

export default async function Home() {
  const tarotBots = await fetchTarotBots();

  return (
    <main className="min-h-screen pb-16">
      {/* Logo */}
      <div className="flex justify-center py-6">
        <div className="flex flex-col items-center">
          <Star className="w-12 h-12 text-primary" strokeWidth={1.5} />
          <h1 className="mt-2 text-xl font-semibold">별자리</h1>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-2 gap-4 p-4">
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">오늘의 운세</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendingUp className="w-6 h-6 text-primary mb-2" />
            <p className="text-sm text-muted-foreground">행운이 가득한 하루가 될 것 같아요</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">이번 달 운세</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar className="w-6 h-6 text-primary mb-2" />
            <p className="text-sm text-muted-foreground">새로운 시작의 달입니다</p>
          </CardContent>
        </Card>
      </div>

      {/* Middle Card */}
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>주간 운세 하이라이트</CardTitle>
            <CardDescription>이번 주 당신을 위한 특별한 메시지</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                이번 주는 특히 대인관계에서 좋은 기운이 감지됩니다. 새로운 만남이나 협력 관계가 형성될 수 있는
                시기입니다.
              </p>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">인간관계 운이 상승중</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom List */}
      <div className="p-4">
        <div className="rounded-lg border">
          <div className="divide-y">
            {tarotBots.length > 0 ? (
              tarotBots.map((bot: { name: string }, index: number) => (
                <div key={index} className="p-4">
                  {bot.botName}
                  <br/>
                  {bot.description}
                </div>
              ))
            ) : (
              <div className="p-4">데이터가 없습니다.</div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </main>
  );
}
