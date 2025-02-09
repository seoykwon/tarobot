// notice/[id]/page.tsx
import { notFound } from "next/navigation";
import NoticeDetailsClient from "./NoticeDetailsClient";
import { API_URLS } from "@/config/api";

interface Notice {
  noticeId: number;
  title: string;
  content: string;
  createdAt: string;
}

async function fetchNoticeDetails(id: string): Promise<Notice | null> {
  try {
    const res = await fetch(API_URLS.NOTICE_DETAILS(id), {
      cache: "no-store",
    });

    if (!res.ok) return null;

    return res.json();
  } catch (error) {
    console.error("Error fetching notice details:", error);
    return null;
  }
}

export default async function NoticeDetailsPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const notice = await fetchNoticeDetails(params.id);

  if (!notice) {
    notFound();
  }

  return <NoticeDetailsClient notice={notice} />;
}
