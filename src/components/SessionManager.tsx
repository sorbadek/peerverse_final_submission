import React, { useState, ReactNode, useCallback } from 'react';
import { OngoingSession } from '../types/session';
import { SessionContext } from '../contexts/SessionContext';

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const [currentSession, setCurrentSession] = useState<OngoingSession | null>(null);
  const [activeSessions, setActiveSessions] = useState<OngoingSession[]>([]);

  const startSession = useCallback((session: OngoingSession) => {
    setCurrentSession(session);
    // Check if session already exists in active sessions
    const exists = activeSessions.some(s => s.id === session.id);
    if (!exists) {
      setActiveSessions(prev => [...prev, session]);
    }
  }, [activeSessions]);

  const endSession = () => {
    setCurrentSession(null);
  };

  const addActiveSession = useCallback((sessionData: Omit<OngoingSession, 'id' | 'roomName' | 'isHost'>): OngoingSession => {
    const newSession: OngoingSession = {
      id: `session-${Date.now()}`,
      roomName: `tutorHub_session_${Date.now()}`,
      isHost: true,
      ...sessionData,
      title: sessionData.title || 'Untitled Session',
      startTime: new Date().toISOString(),
    };
    
    setActiveSessions(prev => [...prev, newSession]);
    return newSession;
  }, []);

  const removeActiveSession = useCallback((sessionId: string) => {
    setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
    if (currentSession?.id === sessionId) {
      setCurrentSession(null);
    }
  }, [currentSession]);

  return (
    <SessionContext.Provider value={{ 
      currentSession, 
      activeSessions,
      startSession, 
      endSession,
      addActiveSession,
      removeActiveSession
    }}>
      {children}
    </SessionContext.Provider>
  );
};
