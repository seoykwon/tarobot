"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface FormData {
  title: string;
  content: string;
}

export default function WritePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // API 요청
      const response = await fetch("http://localhost:8080/api/v1/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit post");
      }

      // 생성된 게시글 ID 가져오기
      const result = await response.json();
      const postId = result.articleId;

      if (!postId) {
        throw new Error("Post ID not returned");
      }

      alert("게시글이 작성되었습니다!");

      // 글 작성 후 상세 페이지로 이동
      router.push(`/community/${postId}`);
    } catch (error) {
      console.error(error);
      alert("게시글 작성 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4 pb-16 overflow-y-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg">
        <h1 className="font-page-title text-xl mb-4">글 작성</h1>

        {/* 제목 입력 */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            제목
          </label>
          <input
            id="title"
            type="text"
            {...register("title", { required: "제목을 입력해주세요." })}
            placeholder="제목을 입력하세요"
            className="w-full p-2 rounded-lg bg-gray-700 text-white"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* 내용 작성 */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-2">
            내용
          </label>
          <textarea
            id="content"
            {...register("content", { required: "내용을 입력해주세요." })}
            placeholder="내용을 입력하세요..."
            rows={6}
            className="w-full p-2 rounded-lg bg-gray-700 text-white"
          ></textarea>
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
          )}
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-4">
          {/* 취소 버튼 */}
          <Button
            variant="outline"
            onClick={() => router.push("/community")}
            disabled={isSubmitting}
          >
            취소
          </Button>

          {/* 저장 버튼 */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className={`bg-fuchsia-500 hover:bg-fuchsia-600 text-white ${
              isSubmitting ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            {isSubmitting ? "작성 중..." : "작성"}
          </Button>
        </div>
      </form>
    </main>
  );
}
