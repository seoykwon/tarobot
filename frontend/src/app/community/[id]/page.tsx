import { notFound } from "next/navigation";
import PostDetailsClient from "./PostDetailsClient";

interface Comment {
  commentId: number;
  author: string;
  content: string;
  createdAt: string;
  likes: number;      // 댓글 좋아요 수
  isLiked: boolean;   // 내가 댓글에 좋아요를 눌렀는지 여부
}

interface PostDetails {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  likes: number;      // 게시글 좋아요 수
  isLiked: boolean;   // 내가 게시글에 좋아요를 눌렀는지 여부
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
    return null;
  }
}

export default async function PostDetailsPage({ params }: { params: { id: string } }) {
  const post = await fetchPostDetails(params.id);

  if (!post) {
    notFound(); // 데이터가 없으면 404 페이지로 이동
  }

  return <PostDetailsClient post={post} />;
}
