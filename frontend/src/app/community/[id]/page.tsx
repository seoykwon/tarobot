import { notFound } from "next/navigation";
import PostDetailsClient from "./PostDetailsClient";
import { API_URLS } from "@/config/api";

// 변경된 댓글 인터페이스
interface Comment {
  id: number;
  content: string;
  postId: number;
  userId: string;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

// 변경된 게시글 상세 정보 인터페이스
interface PostDetails {
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
  comments?: Comment[];
}

// 게시글 상세 정보 API 호출 함수
async function fetchPostDetails(id: string): Promise<PostDetails | null> {
  try {
    const res = await fetch(API_URLS.POSTS.DETAIL(id), {
      cache: "no-store",
    });

    if (!res.ok) return null;

    return res.json();
  } catch (error) {
    console.error("Error fetching post details:", error);
    return null;
  }
}
 
// 댓글 정보 API 호출 함수 (postId를 query parameter로 전달)
async function fetchComments(postId: string): Promise<Comment[]> {
  try {
    const res = await fetch(API_URLS.COMMENTS.GET_COMMENTS(postId),
      { cache: "no-store" }
    );

    if (!res.ok) return [];

    return res.json();
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

// 게시글 상세 정보와 댓글 데이터를 합쳐서 반환하는 함수
async function fetchPostDetailsWithComments(id: string): Promise<PostDetails | null> {
  try {
    // 게시글 데이터 가져오기
    const post = await fetchPostDetails(id);
    if (!post) return null;

    // 댓글 데이터 가져오기
    const comments = await fetchComments(id);

    // 게시글에 댓글 데이터 추가
    return { ...post, comments };
  } catch (error) {
    console.error("Error fetching post details with comments:", error);
    return null;
  }
}


// 게시글 상세 페이지 컴포넌트
export default async function PostDetailsPage({ params }: { params: { id: string } }) {
  const post = await fetchPostDetailsWithComments(params.id);

  if (!post) {
    notFound(); // 데이터가 없으면 404 페이지로 이동
  }

  return <PostDetailsClient post={post} />;
}