import React, { useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { useZkLogin } from './ZkLoginContext';
import { useWallets } from '@mysten/dapp-kit';
import { User, AuthContext, AuthContextType } from './AuthContext.types';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize user from localStorage synchronously
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUserStr = localStorage.getItem('user');
      return storedUserStr ? JSON.parse(storedUserStr) : null;
    } catch (e) {
      console.error('Error parsing stored user:', e);
      localStorage.removeItem('user');
      return null;
    }
  });

  // Initialize isAuthenticated based on user presence
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!user);

  // Loading is true if user is null (means auth check still in progress)
  const [loading, setLoading] = useState(user === null);

  const { isAuthenticated: zkAuthenticated, logout: zkLogout, currentAddress } = useZkLogin();
  const wallets = useWallets();

  const checkAuthState = useCallback(async () => {
    try {
      console.log('--- Checking auth state ---');

      const storedUserStr = localStorage.getItem('user');
      let storedUser: User | null = null;

      try {
        storedUser = storedUserStr ? JSON.parse(storedUserStr) : null;
      } catch (e) {
        console.error('Error parsing stored user:', e);
        localStorage.removeItem('user');
      }

      console.log('Auth check - storedUser:', storedUser);
      console.log('Auth check - zkAuthenticated:', zkAuthenticated);
      console.log('Auth check - currentAddress:', currentAddress);

      if (storedUser) {
        // User exists in localStorage, treat as authenticated
        setUser(storedUser);
        setIsAuthenticated(true);
        setLoading(false);

        // Update zkLogin info if present
        if (zkAuthenticated && currentAddress) {
          const updatedUser: User = {
            ...storedUser,
            zkAddress: currentAddress,
            email: storedUser.email || `user-${currentAddress.slice(0, 8)}@zk.sui`,
          };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        return;
      }

      if (zkAuthenticated && currentAddress) {
        console.log('Using zkLogin wallet for authentication');

        const userData: User = {
          name: 'zkUser',
          email: `user-${currentAddress.slice(0, 8)}@zk.sui`,
          zkAddress: currentAddress,
        };

        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        setLoading(false);
        return;
      }

      // No auth found
      console.log('No authentication found');
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    } catch (error) {
      console.error('Error in checkAuthState:', error);
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, [zkAuthenticated, currentAddress]);

  const login = useCallback(() => {
    console.log('Manual login trigger (if used)');
    checkAuthState();
  }, [checkAuthState]);

  const logout = useCallback(() => {
    console.log('Logout called');
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    if (typeof zkLogout === 'function') {
      zkLogout();
    }
  }, [zkLogout]);

  useEffect(() => {
    // Run auth check on mount and whenever zk auth changes
    checkAuthState();
  }, [checkAuthState]);

  const contextValue: AuthContextType = useMemo(() => ({
    isAuthenticated,
    user,
    login,
    logout,
    loading,
  }), [isAuthenticated, user, login, logout, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
