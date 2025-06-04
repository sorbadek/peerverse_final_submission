import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useEnokiFlow } from '@mysten/enoki/react';
import { useWallets } from '@mysten/dapp-kit';
import { type EnokiWallet } from '@mysten/enoki';

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

  // Find the first wallet that supports Enoki zkLogin
  const enokiWallet = wallets.find(
    (wallet) =>
      wallet.accounts &&
      wallet.accounts.length > 0 &&
      wallet.features &&
      wallet.features['enoki:zklogin']
  ) as EnokiWallet | undefined;

  const currentAddress = enokiWallet?.accounts[0]?.address;

  const login = async () => {
    try {
      setIsLoading(true);
      // Use the recommended Enoki SDK login flow
      const url = await enokiFlow.createAuthorizationURL({
        provider: 'google',
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        redirectUrl: `${window.location.origin}/auth/callback`,
        network: 'devnet',
      });
      window.location.assign(url.toString());
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
    session: enokiWallet || null,
    isLoading,
    login,
    logout,
    isAuthenticated: !!currentAddress,
    currentAddress,
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

export { ZkLoginContext };