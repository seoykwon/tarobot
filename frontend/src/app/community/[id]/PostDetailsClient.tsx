"use client";

import { useState } from "react";

// 댓글 인터페이스
interface Comment {
  commentId: number;
  author: string;
  content: string;
  createdAt: string;
  likes: number;      // 댓글 좋아요 수
  isLiked: boolean;   // 내가 댓글에 좋아요를 눌렀는지 여부
}

// 게시글 세부 정보 인터페이스
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

// 댓글 작성 API 호출 함수
async function postComment(articleId: string, commentContent: string): Promise<Comment | null> {
  try {
    const res = await fetch(`http://localhost:8080/community/articles/${articleId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: commentContent }),
    });

    if (!res.ok) throw new Error("Failed to post comment");

    return await res.json();
  } catch (error) {
    console.error("Error posting comment:", error);
    return null;
  }
}

// 게시글 좋아요 토글 API 호출 함수
async function togglePostLike(articleId: string, liked: boolean): Promise<{ isLiked: boolean, likes: number } | null> {
  try {
    const res = await fetch(`http://localhost:8080/community/articles/${articleId}/like`, {
      method: liked ? "DELETE" : "POST",
    });
    if (!res.ok) throw new Error("Failed to toggle post like");

    return await res.json();
  } catch (error) {
    console.error("Error toggling post like:", error);
    return null;
  }
}

// 댓글 좋아요 토글 API 호출 함수
async function toggleCommentLike(articleId: string, commentId: number, liked: boolean): Promise<{ isLiked: boolean, likes: number } | null> {
  try {
    const res = await fetch(`http://localhost:8080/community/articles/${articleId}/comments/${commentId}/like`, {
      method: liked ? "DELETE" : "POST",
    });
    if (!res.ok) throw new Error("Failed to toggle comment like");

    return await res.json();
  } catch (error) {
    console.error("Error toggling comment like:", error);
    return null;
  }
}

export default function PostDetailsClient({ post }: { post: PostDetails }) {
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [postLikeCount, setPostLikeCount] = useState(post.likes);
  const [isPostLiked, setIsPostLiked] = useState(post.isLiked);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const addedComment = await postComment(post.id, newComment);
      if (addedComment) {
        setComments((prev) => [...prev, addedComment]); // 새로운 댓글 추가
        setNewComment(""); // 입력 필드 초기화
      }
    } catch {
      alert("댓글 작성 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 게시글 좋아요 버튼 클릭 이벤트 처리
  const handlePostLikeToggle = async () => {
    const res = await togglePostLike(post.id, isPostLiked);
    if (res) {
      setIsPostLiked(res.isLiked);
      setPostLikeCount(res.likes);
    } else {
      alert("게시글 좋아요 처리 중 오류가 발생했습니다.");
    }
  };

  // 댓글 좋아요 버튼 클릭 이벤트 처리
  const handleCommentLikeToggle = async (commentId: number) => {
    const targetComment = comments.find((c) => c.commentId === commentId);
    if (!targetComment) return;

    const res = await toggleCommentLike(post.id, commentId, targetComment.isLiked);
    if (res) {
      setComments((prev) =>
        prev.map((c) =>
          c.commentId === commentId ? { ...c, isLiked: res.isLiked, likes: res.likes } : c
        )
      );
    } else {
      alert("댓글 좋아요 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 p-4">
      {/* 게시글 정보 */}
      <section className="bg-gray-800 p-6 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-tarobot-title text-xl">{post.title}</h1>
            <p className="font-article-author text-sm text-muted-foreground">
              By {post.author} • {post.date}
            </p>
          </div>
          <button
            onClick={handlePostLikeToggle}
            className="px-4 py-2 rounded-lg bg-fuchsia-500 hover:bg-fuchsia-600 text-white"
          >
            {isPostLiked ? "좋아요 취소" : "좋아요"} ({postLikeCount})
          </button>
        </div>
        <p className="font-tarobot-description mt-4">{post.content}</p>
      </section>

      {/* 댓글 섹션 */}
      <section className="bg-gray-800 p-6 rounded-lg">
        <h2 className="font-tarobot-title text-lg mb-4">댓글</h2>
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.commentId} className="bg-gray-700 p-4 rounded-lg">
                <p className="font-semibold text-sm">{comment.author}</p>
                <p className="text-sm text-muted-foreground">{comment.content}</p>
                <p className="text-xs text-muted-foreground mt-2">{comment.createdAt}</p>
                <button
                  onClick={() => handleCommentLikeToggle(comment.commentId)}
                  className="mt-2 px-3 py-1 rounded-lg bg-fuchsia-500 hover:bg-fuchsia-600 text-white text-xs"
                >
                  {comment.isLiked ? "좋아요 취소" : "좋아요"} ({comment.likes})
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">댓글이 없습니다.</p>
        )}

        {/* 댓글 작성 폼 */}
        <div className="mt-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요..."
            className="w-full p-2 rounded-lg bg-gray-700 text-white"
            rows={3}
            disabled={isSubmitting}
          />
          <button
            onClick={handleCommentSubmit}
            disabled={isSubmitting || !newComment.trim()}
            className={`mt-2 px-4 py-2 rounded-lg ${
              isSubmitting || !newComment.trim()
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-fuchsia-500 hover:bg-fuchsia-600 text-white"
            }`}
          >
            {isSubmitting ? "작성 중..." : "댓글 작성"}
          </button>
        </div>
      </section>
    </main>
  );
}
