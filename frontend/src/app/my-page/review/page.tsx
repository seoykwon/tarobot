"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/Loading";

interface Review {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

export default function ReviewPage() {
  const [reviews, setReviews] = useState<Review[]>([]); // 리뷰 데이터
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [hasMore, setHasMore] = useState(true); // 더 가져올 데이터가 있는지 여부
  const [page, setPage] = useState(1); // 현재 페이지 번호
  const loader = useRef<HTMLDivElement | null>(null); // Intersection Observer를 위한 Ref

  // 백엔드에서 리뷰 데이터를 가져오는 함수
  const fetchReviews = async (page: number) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/reviews?page=${page}&pageSize=10`);
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();

      // 새로 가져온 데이터를 기존 리뷰에 추가
      setReviews((prev) => [...prev, ...data.reviews]);
      setHasMore(data.reviews.length > 0); // 더 이상 데이터가 없으면 hasMore를 false로 설정
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  // Intersection Observer 설정 (무한 스크롤)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && hasMore && !loading) {
          setPage((prevPage) => prevPage + 1); // 다음 페이지 요청
        }
      },
      { threshold: 1.0 }
    );

    if (loader.current) observer.observe(loader.current);

    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [hasMore, loading]);

  // 페이지 번호가 변경될 때마다 데이터 가져오기
  useEffect(() => {
    fetchReviews(page);
  }, [page]);

  return (
    <main className="min-h-screen bg-background p-4">
      <h1 className="font-page-title mb-4">내가 작성한 리뷰</h1>

      {/* 리뷰 목록 */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <h2 className="font-tarobot-title">{review.title}</h2>
              <p className="text-sm text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
            </CardHeader>
            <CardContent>
              <p className="font-tarobot-description">{review.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 로딩 상태 */}
      {loading && (
        <div className="flex justify-center mt-4">
          <LoadingSpinner />
        </div>
      )}

      {/* Intersection Observer를 위한 로더 */}
      <div ref={loader} className="h-10"></div>

      {/* 더 이상 데이터가 없을 경우 메시지 표시 */}
      {!hasMore && !loading && (
        <p className="text-center text-muted-foreground mt-4">더 이상 리뷰가 없습니다.</p>
      )}
    </main>
  );
}
