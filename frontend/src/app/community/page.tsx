import { CommunityClient } from "./client";

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

// 공지사항 API 호출 함수
async function fetchAnnouncements(): Promise<Announcement[]> {
  try {
    const response = await fetch("http://localhost:8080/community/announcements", {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Failed to fetch announcements");
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return [];
  }
}

// 게시글 API 호출 함수
async function fetchInitialPosts(): Promise<Post[]> {
  try {
    const response = await fetch("http://localhost:8080/community/articles?page=1&pageSize=10", {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Failed to fetch posts");
      return [];
    }

    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

// 서버 컴포넌트
export default async function CommunityPage() {
  const [announcements, initialPosts] = await Promise.all([
    fetchAnnouncements(),
    fetchInitialPosts(),
  ]);

  return <CommunityClient initialPosts={initialPosts} announcements={announcements} />;
}
