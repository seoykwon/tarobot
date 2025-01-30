import { notFound } from "next/navigation";
import PostDetailsClient from "./PostDetailsClient";

interface Comment {
  commentId: number;
  author: string;
  content: string;
  createdAt: string;
}

interface PostDetails {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  comments: Comment[];
}

// 게시글 상세 정보 API 호출 함수
async function fetchPostDetails(id: string): Promise<PostDetails | null> {
  try {
    const res = await fetch(`http://localhost:8080/community/articles/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    return res.json();
  } catch (error) {
    console.error("Error fetching post details:", error);
    return null; // 에러 발생 시 null 반환
  }
}

export default async function PostDetailsPage({ params }: { params: { id: string } }) {
  const post = await fetchPostDetails(params.id);

  if (!post) {
    notFound(); // 데이터가 없으면 Next.js의 기본 404 페이지로 이동
  }

  // 데이터를 클라이언트 컴포넌트에 전달
  return <PostDetailsClient post={post} />;
}
