"use client";

import { useEffect, useState, useRef } from "react";
import { MessageSquare, Heart, Clock, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Image from "next/image";
import Link from "next/link";

// 게시글 데이터 타입 정의
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

// 공지사항 데이터 타입 정의
interface Announcement {
  announcementId: number;
  title: string;
  content: string;
  createdAt: string;
}

export function CommunityClient({
  initialPosts,
  announcements,
}: {
  initialPosts: Post[];
  announcements: Announcement[];
}) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false); // 최상단 버튼 표시 여부
  const loader = useRef(null);

  // 스크롤 탑 버튼 표시 여부 체크
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200); // 스크롤이 200px 이상 내려갔을 때 표시
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 무한 스크롤 로직
  const loadMore = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/community/articles?page=${Math.ceil(posts.length / 10) + 1}&pageSize=10`);
      const newPosts = await response.json();

      if (newPosts.articles.length > 0) {
        setPosts((prev) => [...prev, ...newPosts.articles]);
      }
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setLoading(false);
    }
  };

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
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [loading]);

  // 최상단으로 스크롤
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
                <p className="text-sm text-muted-foreground">{announcement.content}</p>
                <p className="text-xs text-muted-foreground mt-2">작성일자: {announcement.createdAt}</p>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground">등록된 공지사항이 없습니다.</p>
        )}
      </section>

      {/* 게시글 목록 */}
      <section className="p-4 space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link key={post.id} href={`/community/${post.id}`}>
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <div className="p-4 flex justify-between gap-4">
                  {/* 텍스트 콘텐츠 */}
                  <div className="flex-1 min-w-0">
                    <h2 className="font-tarobot-title">{post.title}</h2>
                    <p className="font-tarobot-description mb-2 line-clamp-2">{post.description}</p>
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
          <p className="text-muted-foreground">게시글이 없습니다.</p> // 데이터가 없을 때 메시지 표시
        )}
        {/* 로더 */}
        <div ref={loader} className="h-10 flex items-center justify-center">
          {loading && <p>Loading...</p>}
        </div>
      </section>

      {/* Write 버튼 */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
        <Link href="/community/write">
          <Button size="lg" className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white rounded-full px-6 py-3 shadow-lg">
            WRITE
          </Button>
        </Link>
      </div>

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
