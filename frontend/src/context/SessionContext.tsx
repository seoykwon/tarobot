// SessionContext.tsx
import { createContext, useContext, useState } from 'react';

const SessionContext = createContext<{
  sessionUpdated: number;
  updateSession: () => void;
}>({
  sessionUpdated: 0,
  updateSession: () => {},
});

export const useSession = () => useContext(SessionContext);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessionUpdated, setSessionUpdated] = useState(0);
  const updateSession = () => setSessionUpdated(prev => prev + 1);

  return (
    <SessionContext.Provider value={{ sessionUpdated, updateSession }}>
      {children}
    </SessionContext.Provider>
  );
}
