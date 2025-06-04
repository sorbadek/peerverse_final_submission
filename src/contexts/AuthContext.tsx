
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useZkLogin } from './ZkLoginContext';
import { useWallets } from '@mysten/dapp-kit';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; email: string; zkAddress?: string } | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; zkAddress?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const { session: zkSession, isAuthenticated: zkAuthenticated, logout: zkLogout, currentAddress } = useZkLogin();
  const wallets = useWallets();

  useEffect(() => {
    console.log('AuthContext useEffect triggered');
    console.log('zkAuthenticated:', zkAuthenticated);
    console.log('currentAddress:', currentAddress);
    console.log('wallets:', wallets);
    console.log('zkSession:', zkSession);

    // Check for saved user first
    const savedUser = localStorage.getItem('user');
    console.log('savedUser from localStorage:', savedUser);

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
      setLoading(false);
      console.log('Set authenticated from localStorage:', parsedUser);
      return;
    }

    // Then check wallet state
    const walletWithAddress = wallets.find(wallet => Array.isArray(wallet.accounts) && wallet.accounts[0]?.address);
    console.log('walletWithAddress:', walletWithAddress);

    if (walletWithAddress) {
      const zkUser = {
        name: 'zkLogin User',
        email: 'user@zklogin.sui',
        zkAddress: walletWithAddress.accounts[0].address
      };
      setUser(zkUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(zkUser));
      setLoading(false);
      console.log('Set authenticated from wallet:', zkUser);
      return;
    }

    // Finally check zkLogin state
    if (zkAuthenticated && currentAddress) {
      const zkUser = {
        name: 'zkLogin User',
        email: 'user@zklogin.sui',
        zkAddress: currentAddress
      };
      setUser(zkUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(zkUser));
      setLoading(false);
      console.log('Set authenticated from zkLogin:', zkUser);
      return;
    }

    // No authentication found
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
    console.log('No authentication found, setting as unauthenticated');
  }, [zkAuthenticated, currentAddress, wallets, zkSession]);

  const login = (email: string, password: string) => {
    console.log('Traditional login called (not implemented)');
  };

  const logout = () => {
    console.log('Logout called');
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    zkLogout();
  };

  console.log('AuthContext rendering with:', { isAuthenticated, user, loading });

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
