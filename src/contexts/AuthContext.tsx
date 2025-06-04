import React, { createContext, useContext, useState, useEffect } from 'react';
import { useZkLogin } from '../hooks/useZkLogin';
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
    // Prefer wallet state for authentication
    const walletWithAddress = wallets.find(wallet => Array.isArray(wallet.accounts) && wallet.accounts[0]?.address);
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
      return;
    }
    // Fallback to previous logic
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
      setLoading(false);
    } else if (zkAuthenticated && currentAddress) {
      const zkUser = {
        name: 'zkLogin User',
        email: 'user@zklogin.sui',
        zkAddress: currentAddress
      };
      setUser(zkUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(zkUser));
      setLoading(false);
    } else {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, [zkAuthenticated, currentAddress, wallets]);

  const login = (email: string, password: string) => {
    // No demo user logic; real login should be handled by zkLogin or wallet
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    zkLogout();
  };

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
