import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";


/**
 아래 부분은 백엔드와 소통하며 타로봇의 데이터를 가져오는 코드임
 나중에는 경로만 바꿔서 사용하면 될듯, 상세페이지도 쓰면 될듯?
 */
// export default function TarotBotsPage() {
//   const [bots, setBots] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBots = async () => {
//       try {
//         const response = await fetch("/api/tarot-bots");
//         const data = await response.json();
//         setBots(data);
//       } catch (error) {
//         console.error("Failed to fetch bots:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBots();
//   }, []);


// 더미 데이터
const tarotBotsDummyData = [
  {
    id: "1",
    name: "Ariadne Moon",
    description:
      "Ariadne has over 15 years of experience in tarot reading and specializes in uncovering hidden truths and guiding spiritual journeys.",
    rating: 4.8,
  },
  {
    id: "2",
    name: "Orion Star",
    description:
      "Orion is known for his deep connection with the cosmos and offers insights that align with celestial movements.",
    rating: 4.6,
  },
  {
    id: "3",
    name: "Luna Solis",
    description:
      "Luna brings a unique blend of intuition and knowledge, offering readings that are both enlightening and transformative.",
    rating: 5.0,
  },
];

export default function TarotBotsPage() {
  return (
    <main className="min-h-screen pb-16">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Master list</h1>
        <div className="grid gap-4">
          {tarotBotsDummyData.map((bot) => (
            <Link key={bot.id} href={`/tarot/bots/${bot.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex gap-4 p-4">
                  {/* 이미지 */}
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src="/target.svg" alt="Target" width={96} height={96} />
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
