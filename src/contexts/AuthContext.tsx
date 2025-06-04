import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useZkLogin } from './ZkLoginContext';
import { useWallets } from '@mysten/dapp-kit';
import { JwtPayload, User, AuthContext, AuthContextType } from './AuthContext.types';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  const { isAuthenticated: zkAuthenticated, logout: zkLogout, currentAddress } = useZkLogin();
  const wallets = useWallets();

  // Login function (placeholder implementation)
  const login = useCallback((email: string, password: string) => {
    console.log('Login called with:', { email });
  }, []);

  // Logout function
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

  // Check authentication state
  const checkAuthState = useCallback(async () => {
    try {
      console.log('--- Checking auth state ---');
      
      // Check for saved user in localStorage
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser) as User;
        const userAddress = (parsedUser as { zkAddress?: string; address?: string });
        if (parsedUser && (userAddress.zkAddress || userAddress.address)) {
          setUser(parsedUser);
          setIsAuthenticated(true);
          setLoading(false);
          console.log('Authenticated from localStorage:', parsedUser);
          return;
        }
        localStorage.removeItem('user');
      }

      // Check for JWT token
      const idToken = localStorage.getItem('zklogin_id_token');
      if (idToken && zkAuthenticated && currentAddress) {
        try {
          const decoded = jwtDecode<JwtPayload>(idToken);
          const zkUser: User = {
            name: decoded.name || decoded.given_name || decoded.family_name || 'User',
            email: decoded.email || 'user@example.com',
            zkAddress: currentAddress,
          };
          
          setUser(zkUser);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(zkUser));
          setLoading(false);
          console.log('Authenticated with JWT:', zkUser);
          return;
        } catch (e) {
          console.warn('Failed to decode JWT:', e);
        }
      }

      // Check for connected wallet
      const enokiWallet = wallets.find(w => w.name === 'Enoki' || w.features?.['enoki:zklogin']);
      if (enokiWallet?.accounts?.[0]?.address) {
        const zkUser: User = {
          name: 'User',
          email: 'user@zklogin.sui',
          zkAddress: enokiWallet.accounts[0].address,
        };
        
        setUser(zkUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(zkUser));
        setLoading(false);
        console.log('Authenticated with Enoki wallet:', zkUser);
        return;
      }

      // No authentication found
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      console.log('No authentication found');
    } catch (error) {
      console.error('Error in checkAuthState:', error);
      setLoading(false);
    }
  }, [zkAuthenticated, currentAddress, wallets]);

  // Initial auth check on mount
  useEffect(() => {
    const delay = window.location.pathname === '/auth/callback' ? 3000 : 500;
    console.log(`Running auth check with ${delay}ms delay...`);
    
    const timer = setTimeout(checkAuthState, delay);
    return () => clearTimeout(timer);
  }, [checkAuthState]);

  // Watch for changes in zkAuthenticated or currentAddress
  useEffect(() => {
    if (zkAuthenticated || currentAddress) {
      checkAuthState();
    }
  }, [zkAuthenticated, currentAddress, checkAuthState]);

  // Create context value
  const contextValue = useMemo<AuthContextType>(
    () => ({
      isAuthenticated,
      user,
      login,
      logout,
      loading,
    }),
    [isAuthenticated, user, login, logout, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth hook is in src/hooks/useAuth.ts
