// import { CommunityClient } from "./client";

// // 초기 데이터를 서버에서 가져오는 부분
// async function fetchInitialPosts() {
//   const response = await fetch("http://localhost:8080/api/posts?page=1", {
//     cache: 'no-store' // 항상 최신 데이터를 가져오기 위해
//   });

//   if (!response.ok) {
//     throw new Error('Failed to fetch posts');
//   }

//   return response.json();
// }

// // 서버 컴포넌트
// export default async function CommunityPage() {
//   const initialPosts = await fetchInitialPosts();
  
//   return <CommunityClient initialPosts={initialPosts} />;
// }

import { CommunityClient } from "./client";

// 더미 데이터 타입
interface Post {
  id: number;
  title: string;
  description: string;
  comments: number;
  likes: number;
  timeAgo: string;
  author: string;
  thumbnail: string;
}

// 더미 데이터 생성 함수
function generateInitialPosts(): Post[] {
  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    title: `The Journey of Tarot ${i + 1}`,
    description: "An exploration into the mystical world of tarot cards and their meanings...",
    comments: Math.floor(Math.random() * 50),
    likes: Math.floor(Math.random() * 100),
    timeAgo: `${Math.floor(Math.random() * 5)} days ago`,
    author: `MysticalUser${i + 1}`,
    thumbnail: "/target.svg",
  }));
}

// 초기 더미 데이터를 가져오는 함수
async function fetchInitialPosts() {
  // 실제 API 호출을 시뮬레이션하기 위한 지연
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  return generateInitialPosts();
}

// 서버 컴포넌트
export default async function CommunityPage() {
  const initialPosts = await fetchInitialPosts();
  
  return <CommunityClient initialPosts={initialPosts} />;
}
