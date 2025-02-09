"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { API_URLS } from "@/config/api";

interface Review {
  id: number;
  rating: number;
  content: string;
  date: string;
}

// 쿠키에서 유저 ID 가져오는 함수
const getUserIdFromCookie = (): string | undefined => {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("user_id="))
    ?.split("=")[1];

  return cookieValue || undefined; // null 대신 undefined 반환
};

export default function ReviewPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 모든 리뷰 데이터를 한 번에 가져오는 함수
  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = getUserIdFromCookie();
      const response = await fetch(API_URLS.REVIEWS(userId), { credentials: "include" });

      if (!response.ok) {
        throw new Error(`Failed to fetch reviews: ${response.statusText}`);
      }

      const data: Review[] = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("리뷰 데이터를 가져오는 중 오류 발생:", error);
      setError("리뷰 데이터를 불러오는 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 리뷰 데이터를 가져옴
  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <main className="min-h-screen bg-background p-4">
      <h1 className="font-page-title mb-4">내가 작성한 리뷰</h1>

      {/* 로딩 상태 표시 */}
      {loading && <p className="text-center text-muted-foreground">로딩 중...</p>}

      {/* 에러 메시지 표시 */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* 리뷰 목록이 없을 경우 메시지 표시 */}
      {!loading && reviews.length === 0 && !error && (
        <div className="text-center text-muted-foreground p-4">
          지금 점을 보고 리뷰를 작성해보세요!
        </div>
      )}

      {/* 리뷰 목록 렌더링 */}
      {!loading && !error && reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <span className="font-bold">⭐ {review.rating}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p>{review.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
