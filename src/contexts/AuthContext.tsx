import React, { useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useZkLogin } from './ZkLoginContext';
import { useWallets } from '@mysten/dapp-kit';
import { JwtPayload, User, AuthContext, AuthContextType } from './AuthContext.types';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated: zkAuthenticated, logout: zkLogout, currentAddress } = useZkLogin();
  const wallets = useWallets(); // Currently unused, but kept for future functionality

  const login = useCallback((email: string, password: string) => {
    console.log('Login called with:', { email, password });
    // Placeholder for future login logic
  }, []);

  const logout = useCallback(() => {
    console.log('Logout called');
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('zklogin_id_token');
    if (typeof zkLogout === 'function') {
      zkLogout();
    }
  }, [zkLogout]);

  const checkAuthState = useCallback(async () => {
    try {
      console.log('--- Checking auth state ---');

      const storedUserStr = localStorage.getItem('user');
      const idToken = localStorage.getItem('zklogin_id_token');
      let storedUser: User | null = null;

      try {
        storedUser = storedUserStr ? JSON.parse(storedUserStr) : null;
      } catch (e) {
        console.error('Error parsing stored user:', e);
        localStorage.removeItem('user');
      }

      console.log('Auth check - storedUser:', storedUser);
      console.log('Auth check - idToken exists:', !!idToken);
      console.log('Auth check - zkAuthenticated:', zkAuthenticated);
      console.log('Auth check - currentAddress:', currentAddress);

      // Case 1: Check token validity and stored user
      if (idToken && storedUser) {
        try {
          const decoded = jwtDecode<JwtPayload>(idToken);
          const currentTime = Math.floor(Date.now() / 1000);
          const tokenExp = typeof decoded.exp === 'number' ? decoded.exp : 0;

          if (tokenExp > currentTime) {
            console.log('Found valid auth token in localStorage');

            const validUser: User = {
              name: storedUser.name || 'User',
              email: storedUser.email || `user-${currentAddress?.slice(0, 8) || 'unknown'}@zk.sui`,
              zkAddress: storedUser.zkAddress || currentAddress || '',
            };

            setUser(validUser);
            setIsAuthenticated(true);

            if (JSON.stringify(storedUser) !== JSON.stringify(validUser)) {
              localStorage.setItem('user', JSON.stringify(validUser));
            }

            setLoading(false);
            return;
          } else {
            console.log('Token expired, clearing auth data');
            localStorage.removeItem('user');
            localStorage.removeItem('zklogin_id_token');
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('zklogin_id_token');
        }
      }

      // Case 2: zkLogin session
      if (zkAuthenticated && currentAddress) {
        console.log('Using zkLogin wallet for authentication');

        try {
          const userData: User = {
            name: storedUser?.name || 'zkUser',
            email: storedUser?.email || `user-${currentAddress.slice(0, 8)}@zk.sui`,
            zkAddress: currentAddress,
            ...(storedUser || {})
          };

          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(userData));
          setLoading(false);
          return;
        } catch (error) {
          console.error('Error processing zkLogin auth:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('zklogin_id_token');
        }
      }

      // Case 3: No valid auth
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

  // Initial check on mount
  useEffect(() => {
    console.log('Running auth check with 500ms delay...');
    const timer = setTimeout(() => {
      checkAuthState();
    }, 500);

    const interval = setInterval(() => {
      console.log('Periodic auth check...');
      checkAuthState();
    }, 30000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [checkAuthState]);

  // Recheck when zk state changes
  useEffect(() => {
    if (zkAuthenticated || currentAddress) {
      checkAuthState();
    }
  }, [zkAuthenticated, currentAddress, checkAuthState]);

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
