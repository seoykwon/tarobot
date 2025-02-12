// 파일 위치: app/tarot/bots/[id]/reviews/page.tsx

import { Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

// 실제 리뷰 데이터를 불러올 API 함수를 사용하고 싶다면 아래와 같이 import 후 사용하세요.
// import { fetchTarobotReviews } from "@/api/taroBotsReviews";

interface Review {
  id: number;
  author: string;
  date: string;
  content: string;
  rating: number;
}

interface TarobotReviewsPageProps {
  params: { id: number | string };
}

export default async function TarobotReviewsPage({ params }: TarobotReviewsPageProps) {
  // 실제 API 호출 예시:
  // const reviews: Review[] = await fetchTarobotReviews(params.id);
  
  // 아래는 데모용 더미 데이터입니다. 실제 API 데이터로 교체하세요.
  const reviews: Review[] = [
    {
      id: 1,
      author: "Alice",
      date: "2025-01-01",
      content: "Great consultation! 정말 도움이 많이 되었어요.",
      rating: 5,
    },
    {
      id: 2,
      author: "Bob",
      date: "2025-01-02",
      content: "Very insightful and supportive. 추천합니다.",
      rating: 4,
    },
    {
      id: 3,
      author: "Charlie",
      date: "2025-01-03",
      content: "조금 아쉬운 점도 있었지만 전반적으로 만족합니다.",
      rating: 3,
    },
    // 필요에 따라 더 많은 리뷰를 추가하세요.
  ];

  return (
    <main className="min-h-screen bg-background p-4">
      <header className="flex items-center justify-between mb-6">
        <h1 className="font-tarobot-title text-xl">Consultation Reviews</h1>
        <Link href={`/tarot/bots/${params.id}`}>
          <Button variant="outline" className="text-sm">
            Back
          </Button>
        </Link>
      </header>

      {reviews.length > 0 ? (
        <section className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-700 text-white p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-tarobot-subtitle">{review.author}</h3>
                <span className="font-article-author text-sm">{review.date}</span>
              </div>
              <p className="font-tarobot-descriptions mb-2">{review.content}</p>
              <div className="flex items-center gap-1">
                {[...Array(review.rating)].map((_, index) => (
                  <Star key={index} className="w-4 h-4 text-yellow-400" />
                ))}
              </div>
            </div>
          ))}
        </section>
      ) : (
        <p className="text-gray-400">No reviews available for this Tarobot.</p>
      )}
    </main>
  );
}
