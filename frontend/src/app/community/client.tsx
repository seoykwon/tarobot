"use client";

import { useEffect, useState, useRef } from "react";
import { MessageSquare, Heart, Clock, ArrowUp, Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

// 공지사항 데이터 타입 정의
interface Announcement {
  announcementId: number;
  title: string;
  content: string;
  createdAt: string;
}

const FILTERS = [
  { label: "인기", value: "like" },
  { label: "최신", value: "new" },
  { label: "댓글 많은 글", value: "comment" },
  { label: "내가 쓴 글", value: "myArticles" },
];

export default function CommunityClient({
  announcements,
}: {
  announcements: Announcement[];
}) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  // 기본 필터는 '최신'이므로 selectedFilter는 "new"로 설정
  const [selectedFilter, setSelectedFilter] = useState<string>("new");
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const observerRef = useRef<HTMLDivElement | null>(null);

// 게시글 데이터를 가져올 때 필터에 따라 정렬 조건 추가
const fetchPosts = async (filter: string, pageNum = 1) => {
  setLoading(true);
  try {
    const response = await fetch(API_URLS.POSTS.LIST(filter, pageNum), {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      console.error("Failed to fetch posts");
      setHasMore(false);
      return;
    }
    const data = await response.json();
    if (!data || data.length === 0) {
      setHasMore(false);
    } else {
      // pageNum === 1일 경우 게시글 데이터를 초기화하고 새 데이터로 교체 
      setPosts((prevPosts) =>
        pageNum === 1 ? [...data] : [...prevPosts, ...data]
      );
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
    setHasMore(false);
  } finally {
    setLoading(false);
  }
};

  // 검색 제출 핸들러
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/community/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchOverlay(false);
      setSearchQuery("");
    }
  };

  // 컴포넌트 mount 시 초기 로드
  useEffect(() => {
    fetchPosts(selectedFilter, page);
  }, []);

  // 필터 변경 시 초기화 후 데이터 다시 호출
  useEffect(() => {
    setPage(1);
    setPosts([]); 
    setHasMore(true);
    fetchPosts(selectedFilter, 1);
  }, [selectedFilter]);

  // 무한 스크롤 처리
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
    if (page > 1) fetchPosts(selectedFilter, page);
  }, [page]);

  // 스크롤에 따라 탑 버튼 표시
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <main className="min-h-screen bg-background pb-16">
      {/* 공지사항 섹션 */}
      <section className="bg-gray-800 text-white p-4 mb-6">
        <h2 className="font-page-title mb-4">공지사항</h2>
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <Card key={announcement.announcementId} className="mb-4">
              <div className="p-4">
                <h3 className="font-tarobot-title">{announcement.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {announcement.content}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  작성일자: {announcement.createdAt}
                </p>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground">등록된 공지사항이 없습니다.</p>
        )}
      </section>

      {/* 필터 및 검색 버튼 */}
      <div className="flex justify-center items-center mb-4 relative">
        <div className="flex space-x-2">
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedFilter(filter.value)}
              className={`px-4 py-2 rounded-full ${
                selectedFilter === filter.value
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {filter.label}
            </button>
          ))}
          <button
            onClick={() => setShowSearchOverlay(true)}
            className="ml-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 검색 오버레이 */}
      {showSearchOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
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

      {/* 게시글 목록 */}
      <section className="p-4 space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link key={post.id} href={`/community/${post.id}`}>
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <div className="p-4 flex justify-between gap-4">
                  {/* 왼쪽: 제목, 내용, 작성자, 좋아요, 댓글, 조회수 등 */}
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
                      <Eye className="w-4 h-4" />
                      <span>{post.viewCount}</span>
                      <Clock className="w-4 h-4" />
                      <span>{new Date(post.createdAt).toLocaleString()}</span>
                      <span>by {post.userId}</span>
                    </div>
                  </div>
                  {/* 오른쪽: 썸네일 이미지 */}
                  <Image
                    src={post.imageUrl || "/images/dummy1.png"}
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
          !loading && <p className="text-muted-foreground">게시글이 없습니다.</p>
        )}
        <div ref={observerRef} className="h-10 flex items-center justify-center">
          {loading && <p>Loading...</p>}
        </div>
      </section>

      {/* 글쓰기 버튼 */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
        <Link href="/community/write">
          <Button
            size="lg"
            className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white rounded-full px-6 py-3 shadow-lg"
          >
            WRITE
          </Button>
        </Link>
      </div>

      {/* 스크롤 탑 버튼 */}
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
