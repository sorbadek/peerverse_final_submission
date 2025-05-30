
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Session {
  id: string;
  roomName: string;
  title: string;
  isHost: boolean;
}

interface SessionContextType {
  currentSession: Session | null;
  startSession: (session: Session) => void;
  endSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  const startSession = (session: Session) => {
    setCurrentSession(session);
  };

  const endSession = () => {
    setCurrentSession(null);
  };

  return (
    <SessionContext.Provider value={{ currentSession, startSession, endSession }}>
      {children}
    </SessionContext.Provider>
  );
};
