import React, { createContext, useContext, useState, useEffect } from 'react';
import { useZkLogin } from '../hooks/useZkLogin';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; email: string; zkAddress?: string } | null;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; zkAddress?: string } | null>(null);
  const { session: zkSession, isAuthenticated: zkAuthenticated, logout: zkLogout, currentAddress } = useZkLogin();

  useEffect(() => {
    // Check if user is already logged in from localStorage or zkLogin
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    } else if (zkAuthenticated && currentAddress) {
      // If zkLogin is authenticated but no local user, create one
      const zkUser = {
        name: 'zkLogin User',
        email: 'user@zklogin.sui',
        zkAddress: currentAddress
      };
      setUser(zkUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(zkUser));
    }
  }, [zkAuthenticated, currentAddress]);

  const login = (email: string, password: string) => {
    // For demo purposes, auto-login
    const user = {
      name: 'Demo User',
      email,
    };
    setUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    // Also logout from zkLogin if it's active
    zkLogout();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
