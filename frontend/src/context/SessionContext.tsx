import { createContext, useState, useContext } from "react";

const SessionContext = createContext({
  sessionUpdated: false,
  triggerSessionUpdate: () => {},
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessionUpdated, setSessionUpdated] = useState(false);

  const triggerSessionUpdate = () => {
    setSessionUpdated((prev) => !prev);
  };

  return (
    <SessionContext.Provider value={{ sessionUpdated, triggerSessionUpdate }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
