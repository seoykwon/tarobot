import CommunityClient from "./client";
import { API_URLS } from "@/config/api";

// 공지사항 데이터 타입 정의
interface Announcement {
  announcementId: number;
  title: string;
  content: string;
  createdAt: string;
}

// 공지사항 API 호출 함수
async function fetchAnnouncements(): Promise<Announcement[]> {
  const dummyAnnouncements: Announcement[] = [
    { announcementId: 1, title: "서버 점검 공지", content: "서버 점검 예정", createdAt: "2025-02-10" },
    { announcementId: 2, title: "새로운 기능 출시", content: "타로 챗봇 기능이 추가되었습니다!", createdAt: "2025-02-11" },
  ];

  try {
    const response = await fetch(API_URLS.NOTICES.LIST, { cache: "no-store" });

    if (!response.ok) {
      console.error("Failed to fetch announcements, using dummy data.");
      return dummyAnnouncements; // ✅ 실패 시 기본 데이터 사용
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return dummyAnnouncements; // ✅ 네트워크 오류 발생 시 기본 데이터 반환
  }
}

// 서버 컴포넌트
export default async function CommunityPage() {
  const announcements = await fetchAnnouncements();

  return (
    <div>
      <CommunityClient announcements={announcements} />
    </div>
  );
}
