// notice/[id]/NoticeDetailsClient.tsx
"use client";

interface Notice {
  noticeId: number;
  title: string;
  content: string;
  createdAt: string;
}

export default function NoticeDetailsClient({ 
  notice 
}: { 
  notice: Notice 
}) {
  return (
    <main className="min-h-screen bg-gray-900 p-4">
      <section className="bg-gray-800 p-6 rounded-lg mb-6">
        <h1 className="font-tarobot-title text-xl text-white">{notice.title}</h1>
        <p className="font-article-author text-sm text-muted-foreground">
          {notice.createdAt}
        </p>
        <div className="font-tarobot-description mt-4 text-white whitespace-pre-wrap">
          {notice.content}
        </div>
      </section>
    </main>
  );
}
