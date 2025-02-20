import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getSessionList } from '@/libs/api';
import { useSession } from '@/context/SessionContext';
import { getBotName } from "@/utils/botNameMap";

interface SessionForm {
  sessionId: string;
  userId: string;
  botId: number;
  status: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

// updatedAt을 기반으로 그룹 레이블을 반환합니다.
function getGroupLabel(updatedAt: string): string {
  const date = new Date(updatedAt);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "오늘";
  if (diffDays === 1) return "어제";
  if (diffDays <= 7) return "지난 7일";
  return "이전";
}

export default function SessionList() {
  const [sessions, setSessions] = useState<SessionForm[]>([]);
  const router = useRouter();
  const { botId, sessionUpdated } = useSession();
  const botName = getBotName(botId);

  // 점진적으로 보여줄 항목 개수
  const [visibleCount, setVisibleCount] = useState(5);
  const observer = useRef<IntersectionObserver | null>(null);

  // 마지막 요소를 관찰하여 더 많은 데이터를 로드하는 콜백 함수
  const lastSessionRef = useCallback((node: HTMLLIElement | null) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => {
          const newCount = prev + 5;
          return newCount > 50 ? Math.min(50, sessions.length) : Math.min(newCount, sessions.length);
        });
      }
    });
    if (node) observer.current.observe(node);
  }, [sessions]);

  useEffect(() => {
    // API 호출해서 최대 50개의 세션 데이터를 가져옵니다.
    const fetchSessions = async () => {
      try {
        const sessionlist = await getSessionList(botId || undefined);
        setSessions(sessionlist.slice(0, 50));
      } catch (error) {
        console.error("세션 리스트 불러오기 실패:", error);
      }
    };
    fetchSessions();
  }, [sessionUpdated, botId]);

  const handleSessionClick = (sessionId: string) => {
    router.push(`/chat/${sessionId}`);
  };

  // 현재까지 보여줄 visibleSessions 배열 (최신순 정렬이라고 가정)
  const visibleSessions = sessions.slice(0, visibleCount);

  // visibleSessions를 그룹별로 묶습니다.
  const groupedSessions = visibleSessions.reduce<Record<string, SessionForm[]>>((groups, session) => {
    const group = getGroupLabel(session.updatedAt);
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(session);
    return groups;
  }, {});

  // 그룹을 렌더링할 순서를 정의합니다.
  const groupOrder = ["오늘", "어제", "지난 7일", "이전"];

  // visibleSessions의 마지막 세션의 ID를 구합니다.
  const lastVisibleSessionId = visibleSessions[visibleSessions.length - 1]?.sessionId;

  return (
    <div className="max-w-md mx-auto">
      <h3 className="text-lg font-semibold mt-12 mb-4 truncate whitespace-nowrap overflow-hidden text-ellipsis min-w-0">
        {botName}의 대화 기록
      </h3>
      {groupOrder.map((group) => {
        if (!groupedSessions[group] || groupedSessions[group].length === 0) return null;
        return (
          <div key={group}>
            <h4 className="text-md font-bold mt-6 mb-2">{group}</h4>
            <ul className="space-y-4">
              {groupedSessions[group].map((session) => (
                <li
                  key={session.sessionId}
                  onClick={() => handleSessionClick(session.sessionId)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-200 cursor-pointer"
                  // 마지막 visibleSession이면 ref를 할당하여 추가 로딩
                  ref={session.sessionId === lastVisibleSessionId ? lastSessionRef : undefined}
                >
                  <div className="flex flex-col">
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
