import { notFound } from "next/navigation";
import PostDetailsClient from "./PostDetailsClient";

interface Comment {
  commentId: number;
  author: string;
  content: string;
  createdAt: string;
}

interface PostDetails {
  id: string; // post의 고유 ID
  title: string; // 게시물 제목
  content: string; // 게시물 내용
  author: string; // 작성자 (userId)
  date: string; // 생성 날짜 (createdAt)
  comments: Comment[]; // 댓글 배열
  imageUrl?: string; // 이미지 URL (선택적 필드)
  viewCount: number; // 조회수
  commentCount: number; // 댓글 수
  likeCount: number; // 좋아요 수
}


// 게시글 상세 정보 API 호출 함수
async function fetchPostDetails(id: string): Promise<PostDetails | null> {
  try {
    const res = await fetch(`http://localhost:8080/api/v1/posts/${id}`, {
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
