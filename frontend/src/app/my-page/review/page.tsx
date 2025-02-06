"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

interface Review {
  id: number;
  rating: number;
  content: string;
  date: string;
}

export default function ReviewPage() {
  const [reviews, setReviews] = useState<Review[]>([]);

  // 모든 리뷰 데이터를 한 번에 가져오는 함수
  const fetchReviews = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/review");
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data: Review[] = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("리뷰 데이터를 가져오는 중 에러 발생:", error);
    }
  };

  // 컴포넌트 마운트 시 리뷰 데이터를 가져옵니다.
  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <main className="min-h-screen bg-background p-4">
      <h1 className="font-page-title mb-4">내가 작성한 리뷰</h1>

      {/* 리뷰 목록이 없을 경우 메시지 표시 */}
      {reviews.length === 0 ? (
        <div className="text-center text-muted-foreground p-4">
          지금 점을 보고 리뷰를 작성해보세요!
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <span className="font-bold">별점: {review.rating}</span>
                  <span className="text-sm text-muted-foreground">
                    생성 날짜: {new Date(review.date).toLocaleDateString()}
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
