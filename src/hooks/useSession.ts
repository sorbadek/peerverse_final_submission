import { useContext } from 'react';
import { SessionContext } from '../contexts/SessionContext.ts';

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
