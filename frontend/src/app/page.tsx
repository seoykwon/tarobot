// app/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Page() {
  const cookieStore = cookies();
  const isVisited = cookieStore.get('isVisited')?.value;

  // 이미 방문한 경우 /home으로 리다이렉트
  if (isVisited) {
    redirect('/home'); // redirect는 예외를 던지므로 이후 코드가 실행되지 않음
  }

  // 첫 방문 화면 렌더링
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[320px] flex flex-col items-center gap-6">
        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-zinc-900 flex items-center justify-center">
          <div className="text-6xl">🔮</div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white">Tarot Journey</h1>
          <p className="text-gray-400">Explore the mystical</p>
        </div>

        {/* 쿠키 설정을 위한 POST 요청 */}
        <form action="/api/set-cookie" method="POST">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Start
          </button>
        </form>
      </div>
    </div>
  );
}
