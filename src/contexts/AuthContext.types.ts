import { createContext } from 'react';

export interface JwtPayload {
  name?: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface User {
  name: string;
  email: string;
  zkAddress?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password?: string, idToken?: string) => void; // <- All optional now
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
