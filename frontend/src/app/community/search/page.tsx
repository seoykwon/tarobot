"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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
  const query = searchParams.get("q") || ""; // query가 없을 경우 빈 문자열 사용

  const [searchType, setSearchType] = useState<"title" | "content">("title");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  /** 🔥 `useCallback`에서 `query`와 `searchType`을 의존성으로 추가하여 안정적인 함수 유지 */
  const fetchSearchResults = useCallback(async (pageNum = 1) => {
    if (!query) return; // 빈 검색어일 경우 요청하지 않음

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
  }, [query, searchType]); // ✅ `query`와 `searchType`을 의존성에 추가하여 변경 시 다시 실행

  /** 🔥 검색어(query) 또는 검색 타입(searchType)이 변경될 때 초기화 후 새로운 검색 실행 */
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setPosts([]);
    fetchSearchResults(1);
  }, [query, searchType, fetchSearchResults]); // ✅ `fetchSearchResults` 추가

  /** 🔥 무한 스크롤 로직 */
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

  /** 🔥 페이지 번호가 변경되면 새로운 데이터 로드 */
  useEffect(() => {
    if (page > 1) fetchSearchResults(page);
  }, [page, fetchSearchResults]); // ✅ `fetchSearchResults` 추가  

  /** 🔥 스크롤 감지하여 "스크롤 위로" 버튼 표시 */
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
          &quot;{query}&quot; 에 대한 검색 결과
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
        <div ref={observerRef} className="h-10 flex items-center justify-center">
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
