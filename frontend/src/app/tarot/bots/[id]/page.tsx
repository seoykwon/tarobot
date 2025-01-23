import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { fetchTarobotDetails } from "@/app/api/taroBotsDetail";

interface TarobotDetailsPageProps {
  params: { id: string };
}

// 동적 라우팅을 위한 페이지 컴포넌트
export default async function TarobotDetailsPage({ params }: TarobotDetailsPageProps) {
  // Spring Boot API에서 타로봇 상세 정보 가져오기
  const tarobotDetails = await fetchTarobotDetails(params.id);

  // 데이터가 없으면 Not Found 페이지로 이동
  if (!tarobotDetails) {
    redirect("/home");
  }

  return (
    <main className="min-h-screen bg-background p-4">
      {/* 타로봇 정보 섹션 */}
      <section className="bg-gray-800 text-white p-6 rounded-lg mb-6">
        <div className="flex items-center gap-4">
          <Image
            src={tarobotDetails.profileImage}
            alt={tarobotDetails.name}
            width={80}
            height={80}
            className="rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold">{tarobotDetails.name}</h1>
            <p className="text-sm text-gray-400">{tarobotDetails.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>4.8 (58 reviews)</span>
            </div>
          </div>
        </div>
        {/* 전문 분야 */}
        <div className="mt-4">
          {tarobotDetails.expertise.map((tag, index) => (
            <span
              key={index}
              className="inline-block bg-purple-600 text-white text-xs font-medium px-3 py-1 rounded-full mr-2"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* 리뷰 섹션 */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-4">Consultation Reviews</h2>
        <div className="space-y-4">
          {tarobotDetails.reviews.map((review) => (
            <div key={review.id} className="bg-gray-700 text-white p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{review.author}</h3>
                <span className="text-sm text-gray-400">{review.date}</span>
              </div>
              <p className="text-sm mb-2">{review.content}</p>
              <div className="flex items-center gap-1">
                {[...Array(review.rating)].map((_, index) => (
                  <Star key={index} className="w-4 h-4 text-yellow-400" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 소통하기 버튼 */}
      <section className="">
        <Link href={`/tarot/chat/${tarobotDetails.id}`}>
          <Button
            size="lg"
            className="w-full bg-fuchsia-500 hover:bg-fuchsia-600 text-white"
          >
            Start Consultation
          </Button>
        </Link>
      </section>
    </main>
  );
}
