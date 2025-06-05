import { createContext } from 'react';
import { SessionContextType } from '../types/session';

export const SessionContext = createContext<SessionContextType | undefined>(undefined);
