import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSessionList } from '@/libs/api';
import { useSession } from '@/context/SessionContext';

interface SessionForm {
    sessionId: string;
    userId: string;
    botId: number;
    status: string;
    title: string;
    createdAt: string;
    updatedAt: string;
}

export default function SessionList() {
  const [sessions, setSessions] = useState<SessionForm[]>([]); // 세션 데이터 상태
  const router = useRouter();
  const { sessionUpdated } = useSession();

  useEffect(() => {
    // API 호출해서 세션 데이터 가져오기
    const fetchSessions = async () => {
      try {
            const sessionlist = await getSessionList();
            // 상위 5개만 사용
            setSessions(sessionlist.slice(0, 5));
        } catch (error) {
            console.error("세션 리스트 불러오기 실패:", error);
        }
    };
    fetchSessions();
  }, [sessionUpdated]);

  const handleSessionClick = (sessionId: string) => {
    router.push(`/chat/${sessionId}`);
  };

  return (
    <div className="max-w-md mx-auto">
      <h3 className="text-lg font-semibold mt-12 mb-4 truncate whitespace-nowrap overflow-hidden text-ellipsis min-w-0">최근 대화 기록</h3>
      <ul className="space-y-4">
        {sessions.map((session) => (
          <li
            key={session.sessionId}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-200 cursor-pointer"
            onClick={() => handleSessionClick(session.sessionId)}
          >
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                {session.title.length > 10 ? session.title.slice(0, 10) + "..." : session.title}
              </span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-400 hover:text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </li>
        ))}
      </ul>
    </div>
  );
}
