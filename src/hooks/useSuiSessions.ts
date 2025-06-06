import React from 'react';
import { useSuiClient, useSignAndExecuteTransaction, useCurrentAccount, useConnectWallet, useWallets } from '@mysten/dapp-kit';
import { isEnokiWallet } from '@mysten/enoki';
import { Transaction } from '@mysten/sui/transactions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { SuiClient } from '@mysten/sui/client';
import { useZkLogin } from '../contexts/ZkLoginContext';

const SESSION_PACKAGE_ID = "0x613d35a6bcd70a655da0bfeb5110a7ff4c535dc936e9da66dad0568d90f3e604";
const SESSION_STORE_OBJECT_ID = "0x2902c1eca0f69acb40443262b8de7aef5774fd76b18060cd8bc23f73caa05318";

export interface SessionData {
  title: string;
  description: string;
  category: string;
  duration: string;
  roomName: string;
  createdAt: string;
  owner?: string;
}

export interface SessionFields {
  id: { id: string };
  owner: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  room_name: string;
  created_at: string;
}

export interface SuiSession extends Omit<SessionFields, 'id'> {
  id: string;
}

export interface SessionData {
  title: string;
  description: string;
  category: string;
  duration: string;
  roomName: string;
  createdAt: string;
}

export function useSuiSessions() {
  const suiClient = useSuiClient();
  const { isAuthenticated, currentAddress } = useZkLogin();
  const currentAccount = useCurrentAccount();
  const { mutate: connect } = useConnectWallet();
  
  // Get stored wallet connection info from localStorage
  const getStoredConnectionInfo = React.useCallback(() => {
    try {
      const connectionInfo = localStorage.getItem('sui-dapp-kit:wallet-connection-info');
      if (!connectionInfo) return null;
      const { state } = JSON.parse(connectionInfo);
      return {
        address: state?.lastConnectedAccountAddress,
        walletName: state?.lastConnectedWalletName
      };
    } catch (error) {
      console.error('Error parsing stored connection info:', error);
      return null;
    }
  }, []);
  
  const storedConnectionInfo = React.useMemo(() => getStoredConnectionInfo(), [getStoredConnectionInfo]);
  
  const wallets = useWallets();
  
  // Initialize wallet connection for zkLogin if needed
  React.useEffect(() => {
    if (storedConnectionInfo?.walletName?.startsWith('enoki:') && !currentAccount) {
      const enokiWallet = wallets.find(isEnokiWallet);
      if (enokiWallet) {
        connect({ wallet: enokiWallet });
      }
    }
  }, [storedConnectionInfo, currentAccount, connect, wallets]);
  
  const { mutate: signAndExecuteTransaction, isPending } = useSignAndExecuteTransaction({
    onError: (error) => {
      console.error('Transaction error:', error);
    },
  });
  
  // Get wallet address from current zkLogin, connected account, or stored connection
  const walletAddress = currentAddress || currentAccount?.address || storedConnectionInfo?.address;
  const queryClient = useQueryClient();

  // Fetch sessions from the blockchain
  const { data: suiSessions = [], isLoading, error, refetch } = useQuery({
    queryKey: ['suiSessions', walletAddress],
    enabled: !!walletAddress, // Only fetch if we have a connected account
    queryFn: async () => {
      if (!suiClient || !walletAddress) return [];
      
      try {
        // First get the session store object
        const sessionStore = await suiClient.getObject({
          id: SESSION_STORE_OBJECT_ID,
          options: { showContent: true },
        });

        if (!sessionStore.data?.content || sessionStore.data.content.dataType !== 'moveObject') {
          throw new Error('Invalid session store object');
        }

        // Get the sessions array from the session store
        // Type assertion for the session store fields
        type SessionStoreFields = {
          sessions?: Array<{
            fields: {
              id: { id: string };
              owner: string;
              title: string;
              description: string;
              category: string;
              duration: string;
              room_name: string;
              created_at: string;
            };
          }>;
        };

        const storeFields = sessionStore.data.content.fields as SessionStoreFields;
        
        if (!storeFields.sessions) return [];

        // Map the sessions to the expected format
        return (storeFields.sessions || []).map(session => ({
          id: session.fields.id.id,
          owner: session.fields.owner,
          title: session.fields.title,
          description: session.fields.description,
          category: session.fields.category,
          duration: session.fields.duration,
          room_name: session.fields.room_name,
          created_at: session.fields.created_at,
        }));
      } catch (error) {
        console.error('Error fetching sessions:', error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
  });

  // Create a new session
  const createSession = useMutation({
    mutationFn: async (sessionData: SessionData) => {
      console.log('Creating session with data:', sessionData);
      console.log('Auth state - isAuthenticated:', isAuthenticated);
      console.log('Wallet state - currentAddress:', currentAddress);
      
      // Check if wallet is connected
      if (!walletAddress) {
        throw new Error('Please connect your wallet first');
      }
      
      // Ensure we have all required fields
      if (!sessionData.title || !sessionData.description || !sessionData.category || 
          !sessionData.duration || !sessionData.roomName || !sessionData.createdAt) {
        throw new Error('Missing required session data');
      }
      try {
        const tx = new Transaction();
        


        // Helper function to convert strings to Uint8Array
        const toUint8Array = (str: string): Uint8Array => {
          return new TextEncoder().encode(str);
        };

        // Get current timestamp in seconds
        const now = Math.floor(Date.now() / 1000);
        
        // Create a move call with the correct parameters
        // The signer is automatically added as the first argument by the SDK
        
        // Create the transaction with properly typed arguments
        const txb = new Transaction();
        
        // Create the move call with properly typed arguments
        txb.moveCall({
          target: `${SESSION_PACKAGE_ID}::session::create_session`,
          typeArguments: [],
          arguments: [
            txb.pure.string(sessionData.title),
            txb.pure.string(sessionData.description),
            txb.pure.u64(BigInt(now)),
            txb.pure.u64(BigInt(parseInt(sessionData.duration))),
            txb.pure.u64(10n),  // max_participants
            txb.pure.u64(0n),    // price_xp
          ],
        });
        
        console.log('Transaction created with data:', {
          target: `${SESSION_PACKAGE_ID}::session::create_session`,
          title: sessionData.title,
          description: sessionData.description,
          startTime: now,
          duration: sessionData.duration,
          maxParticipants: 10,
          priceXp: 0,
        });

        // Set the gas budget
        txb.setGasBudget(10000000);
        
        console.log('Submitting transaction...');
        
        try {
          // For zkLogin, we don't need to pass an account to signAndExecuteTransaction
          // as it's handled by the zkLogin provider
          const result = await new Promise((resolve, reject) => {
            signAndExecuteTransaction(
              {
                transaction: txb,
                chain: 'sui:devnet',
              },
              {
                onSuccess: (result) => {
                  console.log('Transaction executed successfully:', result);
                  resolve(result);
                },
                onError: (error) => {
                  console.error('Error executing transaction:', error);
                  reject(error);
                },
              }
            );
          });
          
          // Invalidate and refetch the sessions query after successful transaction
          await queryClient.invalidateQueries({ queryKey: ['suiSessions'] });
          return result;
          
        } catch (error) {
          console.error('Error in transaction execution:', error);
          throw error;
        }
      } catch (error) {
        console.error('Error creating session:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['suiSessions'] });
    },
  });

  return {
    sessions: suiSessions,
    isLoading,
    error,
    createSession: createSession.mutateAsync,
    refetch,
    isConnected: !!currentAccount || !!currentAddress,
    walletAddress: walletAddress,
    wallet: currentAccount,
  };
}
