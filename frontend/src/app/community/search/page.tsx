"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { MessageSquare, Heart, Clock, ArrowUp, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { API_URLS } from "@/config/api";

// 게시글 데이터 타입 정의
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
  const router = useRouter();
  const query = searchParams.get("q") || "";

  // 검색 타입 상태: "title" 혹은 "content"
  const [searchType, setSearchType] = useState<"title" | "content">("title");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const observerRef = useRef<HTMLDivElement | null>(null);

  // 검색 결과를 가져오는 함수: 검색 타입과 페이지 번호에 따라 fetch 요청
  const fetchSearchResults = useCallback(async (pageNum = 1) => {
    if (!query) return; // 검색어가 없으면 요청하지 않음

    setLoading(true);
    try {
      const response = await fetch(
        API_URLS.POSTS.SEARCH(searchType, query, pageNum),
        { cache: "no-store" }
      );

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
  }, [query, searchType]);

  // 검색어 혹은 검색 타입 변경 시 초기화 후 데이터 fetch
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setPosts([]);
    fetchSearchResults(1);
  }, [query, searchType, fetchSearchResults]);

  // 무한 스크롤 처리: observer를 통해 페이지 증가
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

  // 페이지 번호 변경 시 추가 데이터 fetch
  useEffect(() => {
    if (page > 1) fetchSearchResults(page);
  }, [page, fetchSearchResults]);

  // 스크롤 감지를 통해 "스크롤 위로" 버튼 표시
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  // 검색 오버레이 내에서 제출 시, 선택된 검색 타입과 검색어를 URL 쿼리로 전달
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/community/search?type=${searchType}&q=${encodeURIComponent(
          searchQuery.trim()
        )}`
      );
      setShowSearchOverlay(false);
      setSearchQuery("");
    }
  };

  return (
    <main className="min-h-screen bg-background pb-16">
      {/* 헤더: 검색 결과 제목과 우측의 돋보기 아이콘 */}
      <header className="bg-gray-800 text-white p-4 mb-6 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          &quot;{query}&quot; 에 대한 검색 결과
        </h1>
        <button
          onClick={() => setShowSearchOverlay(true)}
          className="p-2 bg-gray-700 rounded-full hover:bg-gray-600"
        >
          <Search className="w-5 h-5" />
        </button>
      </header>


      {/* 검색 오버레이: 돋보기 아이콘 클릭 시 띄워짐 */}
      {showSearchOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            {/* 오버레이 내에서도 검색 타입 선택 버튼 */}
            <div className="mb-4 flex justify-center space-x-2">
              <button
                type="button"
                onClick={() => setSearchType("title")}
                className={`px-4 py-2 rounded-lg ${
                  searchType === "title"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                제목
              </button>
              <button
                type="button"
                onClick={() => setSearchType("content")}
                className={`px-4 py-2 rounded-lg ${
                  searchType === "content"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                내용
              </button>
            </div>
            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="검색어를 입력하세요..."
                className="w-full p-3 border rounded-lg"
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSearchOverlay(false)}
                >
                  취소
                </Button>
                <Button type="submit">검색</Button>
              </div>
            </form>
          </div>
        </div>
      )}

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

      {/* 스크롤 위로 버튼 */}
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
