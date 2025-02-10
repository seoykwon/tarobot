"use client";

import { useEffect, useState, useRef } from "react";
import { MessageSquare, Heart, Clock, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { API_URLS } from "@/config/api";

interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  userId: string;
  viewCount: number;
  commentCount: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  // 검색 타입 상태: "title" 또는 "content" (기본은 "title")
  const [searchType, setSearchType] = useState<"title" | "content">("title");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  // 검색 결과 가져오기: API 엔드포인트는 searchType에 따라 달라짐.
  const fetchSearchResults = async (pageNum = 1) => {
    setLoading(true);
    try {
      const response = await fetch(API_URLS.POSTS.SEARCH(searchType, query || "", pageNum), {
        cache: "no-store",
      });
      if (!response.ok) {
        console.error("Failed to fetch search results");
        setHasMore(false);
        return;
      }
      const data = await response.json();
      if (!data || data.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prevPosts) =>
          pageNum === 1 ? [...data] : [...prevPosts, ...data]
        );
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  // query나 검색 타입이 바뀌면 페이지와 게시글 데이터를 초기화 후 다시 호출
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setPosts([]);
    if (query) fetchSearchResults(1);
  }, [query, searchType]);

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

  // 페이지 번호 변경 시 추가 데이터 호출
  useEffect(() => {
    if (page > 1) fetchSearchResults(page);
  }, [page]);

  // 스크롤 탑 버튼 표시
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <main className="min-h-screen bg-background pb-16">
      {/* 검색 결과 헤더 */}
      <header className="bg-gray-800 text-white p-4 mb-6">
        <h1 className="text-xl font-bold">
          "{query}" 에 대한 검색 결과
        </h1>
      </header>

      {/* 검색 타입 선택 버튼 */}
      <div className="flex justify-center mb-4 space-x-2">
        <button
          onClick={() => setSearchType("title")}
          className={`px-4 py-2 rounded-full ${
            searchType === "title"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          제목 검색
        </button>
        <button
          onClick={() => setSearchType("content")}
          className={`px-4 py-2 rounded-full ${
            searchType === "content"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          내용 검색
        </button>
      </div>

      {/* 검색 결과 목록 */}
      <section className="p-4 space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link key={post.id} href={`/community/${post.id}`}>
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <div className="p-4 flex justify-between gap-4">
                  {/* 텍스트 콘텐츠 영역 */}
                  <div className="flex-1 min-w-0">
                    <h2 className="font-tarobot-title">{post.title}</h2>
                    <p className="font-tarobot-description mb-2 line-clamp-2">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-4 text-muted-foreground text-sm">
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.commentCount}</span>
                      <Heart className="w-4 h-4" />
                      <span>{post.likeCount}</span>
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(post.createdAt)
                          .toLocaleString()
                          .replace("T", " ")}
                      </span>
                      <span>by {post.userId}</span>
                    </div>
                  </div>
                  {/* 썸네일 이미지 */}
                  <Image
                    src={post.imageUrl || "/placeholder.jpg"}
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
