"use client";

import { useEffect, useState, useRef } from "react";
import { MessageSquare, Heart, Clock, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Post {
  id: number;
  title: string;
  description: string;
  comments: number;
  likes: number;
  timeAgo: string;
  author: string;
  thumbnail: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  // 검색 결과 가져오기
  const fetchSearchResults = async (pageNum = 1) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/community/articles/search?q=${encodeURIComponent(
          query || ""
        )}&page=${pageNum}&pageSize=10`,
        { cache: "no-store" }
      );
      if (!response.ok) {
        console.error("Failed to fetch search results");
        return;
      }
      const data = await response.json();
      if (data.articles.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prevPosts) =>
          pageNum === 1 ? data.articles : [...prevPosts, ...data.articles]
        );
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  // 초기 검색 결과 로드
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setPosts([]);
    fetchSearchResults(1);
  }, [query]);

  // 무한 스크롤 로직
  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasMore, loading]);

  // 페이지 번호가 변경될 때 추가 데이터 가져오기
  useEffect(() => {
    if (page > 1) fetchSearchResults(page);
  }, [page]);

  // 스크롤 탑 버튼 표시 여부 체크
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 최상단으로 스크롤
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <main className="min-h-screen bg-background pb-16">
      {/* 검색 결과 헤더 */}
      <header className="bg-gray-800 text-white p-4 mb-6">
        <h1 className="text-xl font-bold">
          "{query}" 에 대한 검색 결과
        </h1>
      </header>

      {/* 검색 결과 목록 */}
      <section className="p-4 space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link key={post.id} href={`/community/${post.id}`}>
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <div className="p-4 flex justify-between gap-4">
                  {/* 텍스트 콘텐츠 */}
                  <div className="flex-1 min-w-0">
                    <h2 className="font-tarobot-title">{post.title}</h2>
                    <p className="font-tarobot-description mb-2 line-clamp-2">
                      {post.description}
                    </p>
                    <div className="flex items-center gap-4 text-muted-foreground text-sm">
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.comments}</span>
                      <Heart className="w-4 h-4" />
                      <span>{post.likes}</span>
                      <Clock className="w-4 h-4" />
                      <span>{post.timeAgo}</span>
                      <span>by {post.author}</span>
                    </div>
                  </div>
                  {/* 썸네일 이미지 */}
                  <Image
                    src={post.thumbnail || "/placeholder.jpg"}
                    alt={post.title}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                </div>
              </Card>
            </Link>
          ))
        ) : (
          !loading && (
            <p className="text-center text-muted-foreground">
              검색 결과가 없습니다.
            </p>
          )
        )}
        {/* 로더 */}
        <div
          ref={observerRef}
          className="h-10 flex items-center justify-center"
        >
          {loading && <p>Loading...</p>}
        </div>
      </section>

      {/* Scroll to top 버튼 */}
      {showScrollTop && (
        <Button
          size="icon"
          onClick={scrollToTop}
          className="fixed bottom-[6rem] right-[1rem] bg-fuchsia-500 hover:bg-fuchsia-600 rounded-full p-3 shadow-lg"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </main>
  );
}
