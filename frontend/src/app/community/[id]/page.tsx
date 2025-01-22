import { notFound } from "next/navigation";

interface PostDetails {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
}

async function fetchPostDetails(id: string): Promise<PostDetails | null> {
  // 백엔드 API 호출
  const res = await fetch(`https://api.example.com/posts/${id}`, {
    cache: "no-store", // 최신 데이터 가져오기
  });

  if (!res.ok) return null;

  return res.json();
}

export default async function PostDetailsPage({ params }: { params: { id: string } }) {
  const post = await fetchPostDetails(params.id);

  if (!post) {
    notFound(); // 데이터가 없으면 404 페이지로 이동
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4">
      {/* 게시글 정보 */}
      <section className="bg-gray-800 p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
        <p className="text-sm text-gray-400 mb-4">
          By {post.author} • {post.date}
        </p>
        <p className="text-base">{post.content}</p>
      </section>
    </main>
  );
}
