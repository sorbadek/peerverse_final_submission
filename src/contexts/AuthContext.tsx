
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useZkLogin } from './ZkLoginContext';

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
  const { session: zkSession, isAuthenticated: zkAuthenticated, logout: zkLogout } = useZkLogin();

  useEffect(() => {
    // Check if user is already logged in from localStorage or zkLogin
    const savedUser = localStorage.getItem('user');
    
    if (zkAuthenticated && zkSession) {
      // If zkLogin is active, use zkLogin session
      const zkUser = {
        name: zkSession.user?.name || 'zkLogin User',
        email: zkSession.user?.email || 'user@zklogin.sui',
        zkAddress: zkSession.address,
      };
      setUser(zkUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(zkUser));
    } else if (savedUser && !zkAuthenticated) {
      // Fallback to regular auth if no zkLogin
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    } else if (!zkAuthenticated) {
      // Clear auth state if no zkLogin session
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [zkAuthenticated, zkSession]);

  const login = (email: string, password: string) => {
    // Simple demo login - in real app this would call an API
    const userData = { name: 'Sandro Williams', email };
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    
    // Also logout from zkLogin if active
    if (zkAuthenticated) {
      zkLogout();
    }
    
    console.log('User logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
