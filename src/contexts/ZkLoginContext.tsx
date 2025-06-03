import React, { createContext, useState, ReactNode } from 'react';
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
  
  // Fix 1: Remove network check (wallet objects don't have network property)
  const currentWallet = wallets.find(wallet => 
    'provider' in wallet && 
    wallet.provider === 'google'
  ) as EnokiWallet | undefined;
  
  const currentAddress = currentWallet?.accounts[0]?.address;

  const login = async () => {
    try {
      setIsLoading(true);
      
      // Fix 2: Properly handle createAuthorizationURL return value
      const authResult = await enokiFlow.createAuthorizationURL({
        provider: 'google',
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        redirectUrl: `${window.location.origin}/auth/callback`,
        network: 'devnet'
      });
      
      // Redirect to Google OAuth
      window.location.href = authResult.toString();
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
      // Fix 3: Remove network parameter from logout
      enokiFlow.logout();
    }
    localStorage.removeItem('zkLogin_session');
  };

  const value: ZkLoginContextType = {
    session: currentWallet || null,
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