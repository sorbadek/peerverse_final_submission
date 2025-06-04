
import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
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
  const { isAuthenticated: zkAuthenticated, logout: zkLogout, currentAddress } = useZkLogin();
  const wallets = useWallets();

  useEffect(() => {
    console.log('AuthContext useEffect triggered');
    console.log('zkAuthenticated:', zkAuthenticated);
    console.log('currentAddress:', currentAddress);
    console.log('wallets:', wallets);
    wallets.forEach((wallet, idx) => {
      console.log(`wallet[${idx}]`, wallet);
    });
    

    const checkAuthState = () => {
      // Check for saved user first
      const savedUser = localStorage.getItem('user');
      console.log('savedUser from localStorage:', savedUser);

      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        // Only use localStorage if it contains a valid zkAddress or address
        if (parsedUser && (parsedUser.zkAddress || parsedUser.address)) {
          setUser(parsedUser);
          setIsAuthenticated(true);
          setLoading(false);
          console.log('Set authenticated from localStorage:', parsedUser);
          return;
        }
        // If invalid, clear it and continue to zkLogin check
        localStorage.removeItem('user');
      }

      // Check zkLogin context and use real user info from idToken
      const idToken = localStorage.getItem('zklogin_id_token');
      console.log('AuthContext: zkAuthenticated', zkAuthenticated);
      console.log('AuthContext: currentAddress', currentAddress);
      console.log('AuthContext: idToken from localStorage', idToken);
      if (zkAuthenticated && currentAddress && idToken) {
        let decoded: { name?: string; email?: string; given_name?: string; family_name?: string } = {};
        try {
          decoded = jwtDecode(idToken);
          console.log('AuthContext: decoded JWT', decoded);
        } catch (e) {
          console.error('Failed to decode idToken', e);
        }
        const zkUser = {
          name: decoded.name || decoded.given_name || decoded.family_name || 'Unknown',
          email: decoded.email || 'unknown',
          zkAddress: currentAddress
        };
        setUser(zkUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(zkUser));
        setLoading(false);
        console.log('Set authenticated from zkLogin context:', zkUser);
        return;
      }
      if (!idToken) {
        console.warn('AuthContext: No idToken found in localStorage');
      }

      // Check wallet state - look for Enoki wallet specifically
      const enokiWallet = wallets.find(wallet => 
        wallet.name === 'Enoki' || 
        (wallet.features && wallet.features['enoki:zklogin'])
      );

      console.log('enokiWallet found:', enokiWallet);

      if (enokiWallet) {
        const hasAccounts = Array.isArray(enokiWallet.accounts) && enokiWallet.accounts.length > 0;
        const hasAddress = hasAccounts && enokiWallet.accounts[0]?.address;
        console.log('Enoki wallet state:', { hasAccounts, hasAddress, accounts: enokiWallet.accounts });

        if (hasAccounts && hasAddress) {
          const zkUser = {
            name: ' User',
            email: 'user@zklogin.sui',
            zkAddress: enokiWallet.accounts[0].address
          };
          setUser(zkUser);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(zkUser));
          setLoading(false);
          console.log('Set authenticated from Enoki wallet:', zkUser);
          return;
        }
      }

      // No authentication found
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      console.log('No authentication found, setting as unauthenticated');
    };

    // If we're on the callback page, add a longer delay to allow Enoki to process
    if (window.location.pathname === '/auth/callback') {
      console.log('On callback page, waiting for Enoki to complete...');
      setTimeout(checkAuthState, 7000); // Increased delay to 7 seconds for wallet/context to initialize
    } else {
      // For other pages, still add a small delay to allow wallet initialization
      setTimeout(checkAuthState, 500);
    }
  }, [zkAuthenticated, currentAddress, wallets]);

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
