"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTarotMasters } from "@/libs/api";
import Image from "next/image";

// TarotMaster 인터페이스 정의
interface TarotMaster {
  id: number;
  name: string;
  description: string;
  concept: string;
  profileImage: string;
  mbti: string;
}

export default function TarotMasterList() {
  // TarotMaster[] 타입을 사용
  const [tarotMasters, setTarotMasters] = useState<TarotMaster[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchTarotMasters = async () => {
      try {
        const masters = await getTarotMasters();
        // 상위 3개만 사용
        setTarotMasters(masters.slice(0, 3));
      } catch (error) {
        console.error("타로 마스터 불러오기 실패:", error);
      }
    };

    fetchTarotMasters();
  }, []);

  const handleSelectMaster = (masterId: number) => {
    localStorage.setItem("botId", masterId.toString());
    router.push("/chat");
  };

  return (
    <ul className="space-y-4">
      {tarotMasters.map((master) => (
        <li
          key={master.id}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-[#0D0D0D] cursor-pointer"
          onClick={() => handleSelectMaster(master.id)}
        >
          {master.profileImage && (
            <Image
              src={master.profileImage}
              alt={`타로 마스터 ${master.name}`}
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
          <span>{master.name || `타로마스터 ${master.id}`}</span>
        </li>
      ))}
      <li className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
        🔍 <span>다른 타로 마스터 찾기</span>
      </li>
    </ul>
  );
}
