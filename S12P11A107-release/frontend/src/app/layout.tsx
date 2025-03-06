import { Metadata } from 'next';
import ClientLayout from '@/components/ClientLayout';
import './globals.css';

export const metadata: Metadata = {
  title: 'VORA 보라 - 미래를 보다',
  description: '타로 마스터와의 상담을 통해 당신의 미래를 탐색해보세요.',
  icons: {
    icon: '/favicon.ico', // Favicon 경로
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-purple-100">
        <ClientLayout>{children}</ClientLayout>
        {/* ToastContainer 추가 */}
      </body>
    </html>
  );
}
