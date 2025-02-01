import CommunityClient from "./client"; // 기본 가져오기로 변경

// 공지사항 데이터 타입 정의
interface Announcement {
  announcementId: number;
  title: string;
  content: string;
  createdAt: string;
}

// 공지사항 API 호출 함수
async function fetchAnnouncements(): Promise<Announcement[]> {
  try {
    const response = await fetch("http://localhost:8080/community/announcements", {
      cache: "no-store",
    });
    if (!response.ok) {
      console.error("Failed to fetch announcements");
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return [];
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
