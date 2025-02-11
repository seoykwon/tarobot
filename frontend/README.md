This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.







🚀 프로젝트 개요

Tarot App의 프론트엔드는 Next.js 기반으로 제작되었으며, 타로 관련 기능과 커뮤니티, 미니게임, 실시간 채팅 등을 포함하고 있습니다. 전반적으로 다크모드를 기본 디자인으로 하여 직관적인 UI/UX를 제공합니다.

📂 프로젝트 구조

🔹 home/page.tsx

- 계절별 배경 화면이 동적으로 변경됩니다.

- "오늘의 운세", "타로봇 마스터", "미니게임" 등 주요 기능을 제공하는 홈 화면입니다.

🔹 components/BottomNav.tsx

- 하단 내비게이션 바 구현.

- 어플 이름 및 주요 페이지로의 이동을 지원.

🔹 community

- 검색 필터 기능 구현.

- 무한 로딩 방식(인스타그램 스타일) 적용.

- 게시글 작성 가능.

🔹 tarot

- 타로봇 리스트 화면 구성.

- 리뷰 기능은 아직 미구현.

🔹 mini-game

- 타로 카드 짝 맞추기 게임 구현.

🔹 globals.css

- 전역 CSS 설정.

- 폰트 및 기본 스타일 지정.

🔹 layout.tsx

- CSS 활용하여 다크모드 구현.

- 상단 바 설정 및 기본 레이아웃 지정.

🔹 daily

- 홈 화면에서 "오늘의 운세" 기능을 제공합니다.

- 카드 한 장을 골라 하루 운세를 확인 가능.

- 운세 결과를 저장하는 기능 포함.

🔹 chat

- 타로봇과 실시간 채팅 기능 구현.

🔹 WebRTC

- 파트너와 화상 연결을 통해 타로 상담 가능.

🛠 기술 스택

- Next.js - 프레임워크

- TypeScript - 정적 타입 검사를 통한 안정성 보장

- Tailwind CSS - 빠른 UI 개발

- WebRTC - 실시간 화상 연결



