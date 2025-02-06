//community/[id]/PostDetailsClient.tsx
"use client";

import { useState } from "react";

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

export default function PostDetailsClient({ post }: { post: PostDetails }) {
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return (
    <main className="min-h-screen bg-gray-900 p-4">
      {/* 게시글 정보 */}
      <section className="bg-gray-800 p-6 rounded-lg mb-6">
        <h1 className="font-tarobot-title text-xl">{post.title}</h1>
        <p className="font-article-author text-sm text-muted-foreground">
          By {post.author} • {post.date}
        </p>
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
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">댓글이 없습니다.</p> // 댓글이 없을 때 메시지 표시
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