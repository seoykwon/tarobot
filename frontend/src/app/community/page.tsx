"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Search, X, MessageSquare, Heart, Clock, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Image from "next/image";
import Link from "next/link";

// 임시 데이터 타입
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

// 임시 데이터 생성 함수
const generateMockPosts = (start: number, end: number): Post[] => {
  return Array.from({ length: end - start }, (_, i) => ({
    id: start + i,
    title: `The Journey of Tarot ${start + i}`,
    description: "An exploration into the mystical world of tarot cards and their meanings...",
    comments: Math.floor(Math.random() * 50),
    likes: Math.floor(Math.random() * 100),
    timeAgo: `${Math.floor(Math.random() * 5)} days ago`,
    author: `MysticalUser${start + i}`,
    thumbnail: "/target.svg",
  }));
};

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const loader = useRef(null);

  // 검색 기능
  useEffect(() => {
    if (searchQuery) {
      const results = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(results);
    } else {
      setFilteredPosts(posts);
    }
  }, [searchQuery, posts]);

  // 스크롤 탑 버튼 표시 여부 체크
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 무한 스크롤 로직
  const loadMore = useCallback(async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newPosts = generateMockPosts(posts.length, posts.length + 5);
    setPosts((prev) => [...prev, ...newPosts]);
    setLoading(false);
  }, [posts.length]);

  // Intersection Observer 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !loading) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    const currentLoader = loader.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [loading, loadMore]);

  // 초기 데이터 로드
  useEffect(() => {
    loadMore();
  }, []);

  // 최상단으로 스크롤
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 검색 초기화
  const clearSearch = () => {
    setSearchQuery("");
    setSearchOpen(false);
  };

  return (
    <main className="min-h-screen bg-background pb-16">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex gap-6">
            {["Popular", "General", "Reviews", "Announcement"].map((tab) => (
              <button key={tab} className="text-sm font-medium hover:text-primary">
                {tab}
              </button>
            ))}
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
            <Search className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* 검색창 */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 w-full max-w-lg">
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-4 py-2"
              />
              {searchQuery && (
                <Button variant="ghost" size="icon" onClick={clearSearch}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            {searchQuery && (
              <p className="text-sm text-muted-foreground mb-2">Found {filteredPosts.length} results</p>
            )}
            <Button variant="ghost" onClick={() => setSearchOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      )}

      {/* 게시글 목록 */}
      <div className="p-4 space-y-4">
        {(filteredPosts.length > 0 ? filteredPosts : posts).map((post) => (
          <Card key={post.id} className="hover:bg-accent/50 transition-colors">
            <div className="p-4">
              <div className="flex gap-4">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={post.thumbnail || "/example.jpg"} alt={post.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold mb-1">{post.title}</h2>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{post.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.timeAgo}</span>
                    </div>
                    <span>by {post.author}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
        {/* 로더 */}
        <div ref={loader} className="h-10 flex items-center justify-center">
          {loading && <div className="text-muted-foreground">Loading...</div>}
        </div>
      </div>

      {/* Write 버튼 */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2">
        <Link href="/community/write">
          <Button className="bg-fuchsia-500 hover:bg-fuchsia-600">WRITE</Button>
        </Link>
      </div>

      {/* Scroll to top 버튼 */}
      {showScrollTop && (
        <Button
          className="fixed bottom-20 right-4 bg-fuchsia-500 hover:bg-fuchsia-600 rounded-full p-2"
          size="icon"
          onClick={scrollToTop}
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </main>
  );
}
