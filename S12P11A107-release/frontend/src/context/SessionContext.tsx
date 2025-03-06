// context/SessionContext.tsx
"use client";

import { createContext, useState, useContext, useEffect } from "react";

interface SessionContextType {
  sessionUpdated: boolean;
  triggerSessionUpdate: () => void;
  botId: string | null;
  setBotId: (id: string | null) => void;
}

const SessionContext = createContext<SessionContextType>({
  sessionUpdated: false,
  triggerSessionUpdate: () => {},
  botId: null,
  setBotId: () => {},
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessionUpdated, setSessionUpdated] = useState(false);
  const [botId, setBotId] = useState<string | null>(null);

  // 컴포넌트 마운트 시 localStorage에서 botId를 읽어옵니다.
  useEffect(() => {
    const storedBotId = localStorage.getItem("botId");
    setBotId(storedBotId);
  }, []);

  const triggerSessionUpdate = () => {
    setSessionUpdated((prev) => !prev);
  };

  return (
    <SessionContext.Provider value={{ sessionUpdated, triggerSessionUpdate, botId, setBotId }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
