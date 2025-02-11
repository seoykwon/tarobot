"use client"

import { useState } from "react"
import { API_URLS } from "@/config/api"
import { Card } from "@/components/ui/Card"

interface Comment {
  id: number
  content: string
  postId: number
  userId: string
  likeCount: number
  createdAt: string
  updatedAt: string
}

interface PostDetails {
  id: number
  title: string
  content: string
  imageUrl: string
  userId: string
  viewCount: number
  commentCount: number
  likeCount: number
  createdAt: string
  updatedAt: string
  comments?: Comment[]
}

async function checkPostLikeStatus(postId: string): Promise<boolean> {
  try {
    const res = await fetch(API_URLS.POSTS.IS_LIKED(postId), {
      method: "GET",
    })

    if (!res.ok) {
      throw new Error("Failed to fetch like status")
    }

    const { liked }: { liked: boolean } = await res.json()
    return liked
  } catch (error) {
    console.error("Error checking post like status:", error)
    return false
  }
}

async function togglePostLike(postId: string): Promise<{ isLiked: boolean; likeCount: number } | null> {
  try {
    const liked = await checkPostLikeStatus(postId)
    const res = await fetch(API_URLS.POSTS.LIKE(postId), {
      method: liked ? "DELETE" : "POST",
    })

    if (!res.ok) {
      throw new Error("Failed to toggle post like")
    }
    return await res.json()
  } catch (error) {
    console.error("Error toggling post like:", error)
    return null
  }
}

async function postComment(postId: string, commentContent: string): Promise<Comment | null> {
  try {
    const res = await fetch(API_URLS.COMMENTS.CREATE_COMMENT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: commentContent, postId }),
    })

    if (!res.ok) throw new Error("Failed to post comment")

    return await res.json()
  } catch (error) {
    console.error("Error posting comment:", error)
    return null
  }
}

async function checkCommentLikeStatus(commentId: string): Promise<boolean> {
  try {
    const res = await fetch(API_URLS.COMMENTS.IS_LIKED(commentId), {
      method: "GET",
    })

    if (!res.ok) {
      throw new Error("Failed to fetch like status")
    }

    const { liked }: { liked: boolean } = await res.json()
    return liked
  } catch (error) {
    console.error("Error checking comment like status:", error)
    return false
  }
}

async function toggleCommentLike(commentId: string): Promise<{ isLiked: boolean; likeCount: number } | null> {
  try {
    const liked = await checkCommentLikeStatus(commentId)
    const res = await fetch(API_URLS.COMMENTS.LIKE_COMMENT(commentId), {
      method: liked ? "DELETE" : "POST",
    })

    if (!res.ok) {
      throw new Error("Failed to toggle comment like")
    }
    return await res.json()
  } catch (error) {
    console.error("Error toggling comment like:", error)
    return null
  }
}

export default function PostDetailsClient({ post }: { post: PostDetails }) {
  const [likeCount, setLikeCount] = useState(post.likeCount)
  const [isPostLiked, setIsPostLiked] = useState(false)
  const [comments, setComments] = useState<Comment[]>(post.comments || [])
  const [commentLikes, setCommentLikes] = useState<Record<number, { count: number; isLiked: boolean }>>(
    Object.fromEntries(
      (post.comments || []).map((c) => [c.id, { count: c.likeCount, isLiked: false }]),
    ),
  )
  const [newComment, setNewComment] = useState("")

  const handlePostLike = async () => {
    const result = await togglePostLike(post.id.toString())
    if (result) {
      setLikeCount(result.likeCount)
      setIsPostLiked(result.isLiked)
    }
  }

  const handleCommentLike = async (commentId: number) => {
    const result = await toggleCommentLike(commentId.toString())
    if (result) {
      setCommentLikes((prev) => ({
        ...prev,
        [commentId]: { count: result.likeCount, isLiked: result.isLiked },
      }))
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    const result = await postComment(post.id.toString(), newComment.trim())
    if (result) {
      setComments((prev) => [...prev, result])
      setNewComment("")
      setCommentLikes((prev) => ({
        ...prev,
        [result.id]: { count: result.likeCount, isLiked: false },
      }))
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
        <div className="text-sm text-gray-500 mb-4">
          작성자: {post.userId} | 작성일: {new Date(post.createdAt).toLocaleDateString()}
        </div>
        <p className="mb-4 whitespace-pre-wrap">{post.content}</p>
        <button onClick={handlePostLike} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          {isPostLiked ? "❤️" : "🤍"} 좋아요 {likeCount}
        </button>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">댓글</h2>
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b pb-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-gray-500">
                  {comment.userId} | {new Date(comment.createdAt).toLocaleDateString()}
                </div>
                <button
                  onClick={() => handleCommentLike(comment.id)}
                  className="flex items-center space-x-1 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm"
                >
                  <span>{commentLikes[comment.id]?.isLiked ? "❤️" : "🤍"}</span>
                  <span>{commentLikes[comment.id]?.count}</span>
                </button>
              </div>
              <p>{comment.content}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요"
            className="w-full p-2 border rounded"
          />
          <button onClick={handleAddComment} className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            댓글 작성하기
          </button>
        </div>
      </Card>
    </div>
  )
}
