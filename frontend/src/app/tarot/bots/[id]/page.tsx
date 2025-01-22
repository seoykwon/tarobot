import { notFound } from "next/navigation";
import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/Button";

// 데이터 타입 정의
interface Review {
  id: number;
  author: string;
  rating: number;
  content: string;
  date: string;
}

interface ChatbotDetails {
  id: string;
  name: string;
  profileImage: string;
  description: string;
  expertise: string[];
  reviews: Review[];
}

// 서버에서 데이터 가져오기 함수
async function fetchChatbotDetails(id: string): Promise<ChatbotDetails | null> {
  try {
    const res = await fetch(`https://api.example.com/chatbots/${id}`, {
      cache: "no-store", // 매 요청마다 최신 데이터 가져오기
    });

    if (!res.ok) return null;

    return res.json();
  } catch (error) {
    console.error("Failed to fetch chatbot details:", error);
    return null;
  }
}

// 동적 라우팅을 위한 페이지 컴포넌트
export default async function ChatbotDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const chatbotDetails = await fetchChatbotDetails(params.id);

  // 데이터가 없으면 Not Found 페이지로 이동
  if (!chatbotDetails) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background p-4">
      {/* 챗봇 정보 섹션 */}
      <section className="bg-gray-800 text-white p-6 rounded-lg mb-6">
        <div className="flex items-center gap-4">
          <Image
            src={chatbotDetails.profileImage}
            alt={chatbotDetails.name}
            width={80}
            height={80}
            className="rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold">{chatbotDetails.name}</h1>
            <p className="text-sm text-gray-400">{chatbotDetails.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>4.8 (58 reviews)</span>
            </div>
          </div>
        </div>
        {/* 전문 분야 */}
        <div className="mt-4">
          {chatbotDetails.expertise.map((tag, index) => (
            <span
              key={index}
              className="inline-block bg-purple-600 text-white text-xs font-medium px-3 py-1 rounded-full mr-2"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* 리뷰 섹션 */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-4">Consultation Reviews</h2>
        <div className="space-y-4">
          {chatbotDetails.reviews.map((review) => (
            <div key={review.id} className="bg-gray-700 text-white p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{review.author}</h3>
                <span className="text-sm text-gray-400">{review.date}</span>
              </div>
              <p className="text-sm mb-2">{review.content}</p>
              <div className="flex items-center gap-1">
                {[...Array(review.rating)].map((_, index) => (
                  <Star key={index} className="w-4 h-4 text-yellow-400" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 소통하기 버튼 */}
      <section className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md">
        <Button
          size="lg"
          className="w-full bg-fuchsia-500 hover:bg-fuchsia-600 text-white"
        >
          Start Consultation
        </Button>
      </section>
    </main>
  );
}
