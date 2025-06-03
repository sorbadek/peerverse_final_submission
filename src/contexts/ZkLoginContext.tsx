
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useEnokiFlow, useZkLoginSession } from '@mysten/enoki/react';

interface ZkLoginContextType {
  session: any | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const ZkLoginContext = createContext<ZkLoginContextType | undefined>(undefined);

interface ZkLoginProviderProps {
  children: ReactNode;
}

export const ZkLoginProvider: React.FC<ZkLoginProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const enokiFlow = useEnokiFlow();
  const zkLoginSession = useZkLoginSession();
  const session = zkLoginSession || null;

  const login = async () => {
    try {
      setIsLoading(true);
      // Use the enokiFlow to initiate Google OAuth login
      await enokiFlow.createAuthorizationURL({
        provider: 'google',
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id',
        redirectUrl: `${window.location.origin}/auth/callback`,
        extraParams: {
          scope: 'openid email profile',
        },
      });
    } catch (error) {
      console.error('Error during zkLogin:', error);
      setIsLoading(false);
    }
  };

  const logout = () => {
    enokiFlow.logout();
    localStorage.removeItem('zkLogin_session');
  };

  const value: ZkLoginContextType = {
    session,
    isLoading,
    login,
    logout,
    isAuthenticated: !!session,
  };

  return (
    <ZkLoginContext.Provider value={value}>
      {children}
    </ZkLoginContext.Provider>
  );
};

export const useZkLogin = () => {
  const context = useContext(ZkLoginContext);
  if (context === undefined) {
    throw new Error('useZkLogin must be used within a ZkLoginProvider');
  }
  return context;
};
