export interface Session {
  id: string;
  roomName: string;
  title: string;
  isHost?: boolean;
}

export interface OngoingSession extends Omit<Session, 'isHost'> {
  hostName: string;
  participants: number;
  category: string;
  duration: string;
  description: string;
  startTime: string;
  isHost?: boolean;
}

export interface SessionContextType {
  currentSession: OngoingSession | null;
  activeSessions: OngoingSession[];
  startSession: (session: OngoingSession) => void;
  endSession: () => void;
  addActiveSession: (session: Omit<OngoingSession, 'id' | 'roomName' | 'isHost'>) => OngoingSession;
  removeActiveSession: (sessionId: string) => void;
}
