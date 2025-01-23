import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Home() {
  const cookieStore = cookies();
  const hasVisited = cookieStore.get('hasVisited')?.value;

  if (hasVisited) {
    // 이미 방문한 경우 /home으로 리다이렉트
    redirect('/home');
  }

  // 첫 방문인 경우 쿠키 설정을 위해 Route Handler 호출
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/set-cookie`, { method: 'GET' });

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

        <a
          href="/home"
          className="w-full bg-fuchsia-500 hover:bg-fuchsia-600 text-white py-6 text-center block"
        >
          시작하기
        </a>
      </div>
    </div>
  );
}
