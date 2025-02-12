// pages/index.tsx
import Layout from "@/app/khoon/layout";
import Greeting from "@/app/khoon/components/greeting";

export default function Hoon() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Greeting />
    </div>
  );
}

// 이 페이지에서만 Layout 적용
Hoon.getLayout = function getLayout(page: React.ReactNode) {
    return <Layout>{page}</Layout>;
  };