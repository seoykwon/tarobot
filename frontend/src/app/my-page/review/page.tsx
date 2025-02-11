"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { API_URLS } from "@/config/api";

interface Review {
  id: number; // 리뷰 ID
  createdAt: string; // 리뷰 생성 날짜 (ISO 형식)
  updatedAt: string; // 리뷰 수정 날짜 (ISO 형식)
  author: string; // 작성자 이름
  rating: number; // 평점
  content: string; // 리뷰 내용
  date: string; // 리뷰 작성 날짜 (YYYY-MM-DD 형식)
}

export default function ReviewPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URLS.REVIEW.ALL, {
        method: "GET",
        credentials: "include", // 쿠키 포함
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch reviews: ${response.statusText}`);
      }

      const data: Review[] = await response.json();
      setReviews(data); // 리뷰 데이터를 상태에 저장
    } catch (error) {
      console.error("리뷰 데이터를 가져오는 중 오류 발생:", error);
      setError("리뷰 데이터를 불러오는 중 문제가 발생했습니다.");
    } finally {
      setLoading(false); // 로딩 상태 해제
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
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <span className="font-bold text-lg">⭐ {review.rating}</span>
                  <p>{review.content}</p>
                  <span className="text-sm text-muted-foreground">
                    작성일: {new Date(review.date).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}