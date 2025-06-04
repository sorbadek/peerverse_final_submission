import React, { createContext, useContext, ReactNode } from 'react';
import { useConnectWallet, useCurrentAccount, useWallets } from '@mysten/dapp-kit';
import { isEnokiWallet, type EnokiWallet, AuthProvider } from '@mysten/enoki';

interface ZkLoginContextType {
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
  currentAddress: string | undefined;
}

const ZkLoginContext = createContext<ZkLoginContextType | undefined>(undefined);

interface ZkLoginProviderProps {
  children: ReactNode;
}

export const ZkLoginProvider: React.FC<ZkLoginProviderProps> = ({ children }) => {
  const { mutate: connect } = useConnectWallet();
  const wallets = useWallets().filter(isEnokiWallet);
  const currentAccount = useCurrentAccount();
  const [isLoading, setIsLoading] = React.useState(false);

  // Save authenticated user to localStorage
  React.useEffect(() => {
    if (currentAccount) {
      localStorage.setItem('user', JSON.stringify(currentAccount));
    }
  }, [currentAccount]);

  // Find the Google Enoki wallet (or other provider as needed)
  const googleWallet = wallets.find(wallet => wallet.provider === 'google');

  const login = () => {
    if (googleWallet) {
      setIsLoading(true);
      connect({ wallet: googleWallet });
    } else {
      console.warn('No Google Enoki wallet found.');
    }
  };

  const logout = () => {
    localStorage.removeItem('zkLogin_session');
    localStorage.removeItem('user');
    // Optionally, disconnect wallet here if API is available
  };

  const value: ZkLoginContextType = {
    isLoading,
    login,
    logout,
    isAuthenticated: !!currentAccount,
    currentAddress: currentAccount?.address,
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