import React, { createContext, useState, ReactNode } from 'react';
import { useEnokiFlow } from '@mysten/enoki/react';
import { useWallets } from '@mysten/dapp-kit';
import { type EnokiWallet } from '@mysten/enoki';
import { getFullnodeUrl } from '@mysten/sui.js/client';

interface ZkLoginContextType {
  session: EnokiWallet | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  currentAddress: string | undefined;
}

const ZkLoginContext = createContext<ZkLoginContextType | undefined>(undefined);

interface ZkLoginProviderProps {
  children: ReactNode;
}

export const ZkLoginProvider: React.FC<ZkLoginProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const enokiFlow = useEnokiFlow();
  const wallets = useWallets();
  const currentWallet = wallets.find(wallet => 'provider' in wallet && wallet.provider === 'google');
  const currentAddress = currentWallet?.accounts[0]?.address;

  const login = async () => {
    try {
      setIsLoading(true);
      // Use the enokiFlow to initiate Google OAuth login
      await enokiFlow.createAuthorizationURL({
        provider: 'google',
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id',
        redirectUrl: `${window.location.origin}/auth/callback`
      });
    } catch (error) {
      console.error('Error during zkLogin:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (enokiFlow) {
      enokiFlow.logout();
    }
    localStorage.removeItem('zkLogin_session');
  };

  const value: ZkLoginContextType = {
    session: currentWallet as EnokiWallet || null,
    isLoading,
    login,
    logout,
    isAuthenticated: !!currentAddress,
    currentAddress
  };

  return (
    <ZkLoginContext.Provider value={value}>
      {children}
    </ZkLoginContext.Provider>
  );
};

export { ZkLoginContext };
