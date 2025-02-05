import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { fetchTarobotDetails } from "@/app/api/taroBotsDetail";

interface TarobotDetailsPageProps {
  params: { id: number };
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
      <section className="bg-gray-800 p-6 rounded-lg mb-6">
        <div className="flex items-center gap-4">
          <Image
            src={tarobotDetails.profileImage}
            alt={tarobotDetails.name}
            width={80}
            height={80}
            className="rounded-full"
          />
          <div>
            <h1 className="font-tarobot-title text-lg">{tarobotDetails.name}</h1>
            <p className="font-tarobot-description text-sm">{tarobotDetails.description}</p>
            <p className="font-tarobot-description text-sm mt-1">
              Concept: {tarobotDetails.concept}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Star className="w-5 h-5 font-tarobot-description" />
              <span>MBTI: {tarobotDetails.mbti}</span>
            </div>
          </div>
        </div>

        {/* 전문 분야 */}
        <div className="mt-4">
          {tarobotDetails.expertise.map((tag, index) => (
            <span
              key={index}
              className="inline-block bg-purple-600 font-tags px-3 py-1 rounded-full mr-2"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* 리뷰 섹션 */}
      <section className="mb-6">
        <h2 className="font-tarobot-title mb-4">Consultation Reviews</h2>
        {tarobotDetails.reviews.length > 0 ? (
          <div className="space-y-4">
            {tarobotDetails.reviews.map((review) => (
              <div key={review.id} className="bg-gray-700 text-white p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-tarobot-subtitle">{review.author}</h3>
                  <span className="font-article-author text-sm">{review.date}</span>
                </div>
                <p className="font-tarobot-descriptions mb-2">{review.content}</p>
                <div className="flex items-center gap-1">
                  {[...Array(review.rating)].map((_, index) => (
                    <Star key={index} className="w-4 h-4 text-yellow-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No reviews available for this Tarobot.</p>
        )}
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
