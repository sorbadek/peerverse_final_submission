
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { EnokiFlow, getGoogleOAuthUrl, type ZkLoginSession } from '@mysten/enoki/react';

interface ZkLoginContextType {
  session: ZkLoginSession | null;
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
  const [session, setSession] = useState<ZkLoginSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const enokiFlow = new EnokiFlow({
    apiKey: process.env.VITE_ENOKI_API_KEY || 'demo-api-key', // Replace with your actual API key
    network: 'testnet', // or 'mainnet' for production
  });

  useEffect(() => {
    // Check for existing session on mount
    const initializeSession = async () => {
      try {
        const existingSession = await enokiFlow.getSession();
        if (existingSession) {
          setSession(existingSession);
        }
      } catch (error) {
        console.error('Error initializing zkLogin session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, []);

  const login = async () => {
    try {
      setIsLoading(true);
      const authUrl = getGoogleOAuthUrl({
        clientId: process.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id',
        redirectUri: `${window.location.origin}/auth/callback`,
        extraParams: {
          scope: 'openid email profile',
        },
      });

      // Redirect to Google OAuth
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error during zkLogin:', error);
      setIsLoading(false);
    }
  };

  const logout = () => {
    setSession(null);
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
