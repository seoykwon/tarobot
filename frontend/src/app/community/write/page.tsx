"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface FormData {
  board: string;
  title: string;
  content: string;
  anonymous: boolean;
}

export default function WritePage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // API 요청
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit post");
      }

      // 생성된 게시글 ID 가져오기
      const result = await response.json();
      const postId = result.id;

      if (!postId) {
        throw new Error("Post ID not returned");
      }

      alert("Post submitted successfully!");

      // 글 작성 후 상세 페이지로 이동
      router.push(`/community/${postId}`);
    } catch (error) {
      console.error(error);
      alert("Failed to submit post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 게시판 선택 */}
        <div>
          <label htmlFor="board" className="block text-sm font-medium mb-2">
            Select a Board
          </label>
          <select
            id="board"
            {...register("board", { required: "Please select a board." })}
            className="w-full p-2 rounded-lg bg-gray-800 text-white"
          >
            <option value="">-- Select --</option>
            <option value="daily-insights">Daily Insights</option>
            <option value="tarot-readings">Tarot Readings</option>
            <option value="spiritual-guidance">Spiritual Guidance</option>
          </select>
          {errors.board && (
            <p className="text-red-500 text-sm mt-1">{errors.board.message}</p>
          )}
        </div>

        {/* 제목 입력 */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Title
          </label>
          <input
            id="title"
            type="text"
            {...register("title", { required: "Title is required." })}
            placeholder="Enter your post title"
            className="w-full p-2 rounded-lg bg-gray-800 text-white"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* 내용 작성 */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-2">
            Write Content
          </label>
          <textarea
            id="content"
            {...register("content", { required: "Content is required." })}
            placeholder="Write your mystical insights here..."
            rows={6}
            className="w-full p-2 rounded-lg bg-gray-800 text-white"
          ></textarea>
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
          )}
        </div>

        {/* 익명 여부 */}
        <div className="flex items-center gap-2">
          <input
            id="anonymous"
            type="checkbox"
            {...register("anonymous")}
            className="h-5 w-5 accent-fuchsia-500"
          />
          <label htmlFor="anonymous" className="text-sm">
            Post Anonymously
          </label>
        </div>

        {/* 제출 버튼 */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className={`w-full ${isSubmitting ? "bg-gray-600" : "bg-fuchsia-500 hover:bg-fuchsia-600"}`}
        >
          {isSubmitting ? "Saving..." : "SAVE"}
        </Button>
      </form>
    </main>
  );
}
