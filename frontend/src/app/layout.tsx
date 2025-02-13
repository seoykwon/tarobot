import { Metadata } from 'next'
import ClientLayout from '@/components/ClientLayout'
import "./globals.css"

export const metadata: Metadata = {
  title: '미루 - 타로 상담',
  description: '타로 마스터와의 상담을 통해 당신의 미래를 탐색해보세요.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
