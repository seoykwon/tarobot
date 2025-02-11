"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { API_URLS } from "@/config/api";

interface FormData {
  title: string;
  content: string;
  image?: FileList;
}

// 파일을 Base64 문자열로 변환하는 유틸리티 함수
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

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
      // 이미지가 선택되어 있다면 Base64 변환, 없으면 빈 문자열로 설정
      let imageUrl = "";
      if (data.image && data.image.length > 0) {
        imageUrl = await convertFileToBase64(data.image[0]);
      }

      // API에 보낼 데이터 형식: title, content, imageUrl
      const postData = {
        title: data.title,
        content: data.content,
        imageUrl: imageUrl,
      };

      const response = await fetch(API_URLS.POSTS.CREATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit post");
      }

      const result = await response.json();
      const postId = result.articleId;

      if (!postId) {
        throw new Error("Post ID not returned");
      }

      alert("게시글이 작성되었습니다!");
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg"
      >
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
            <p className="text-red-500 text-sm mt-1">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* 내용 입력 */}
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
            <p className="text-red-500 text-sm mt-1">
              {errors.content.message}
            </p>
          )}
        </div>

        {/* 이미지 파일 선택 (선택 사항) */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-2">
            이미지 (선택)
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            {...register("image")}
            className="w-full p-2 rounded-lg bg-gray-700 text-white"
          />
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/community")}
            disabled={isSubmitting}
          >
            취소
          </Button>

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
