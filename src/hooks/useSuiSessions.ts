import { useSuiClient, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fromB64 } from '@mysten/sui/utils';
import { toB64 } from '@mysten/bcs';
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
  const { isAuthenticated, currentAddress, logout: zkLogout } = useZkLogin();
  const { mutate: signAndExecuteTransaction, isPending } = useSignAndExecuteTransaction({
    onError: (error) => {
      console.error('Transaction error:', error);
    },
  });
  
  // Try to get wallet address from multiple sources
  const getWalletAddress = () => {
    // First, try the current address from zkLogin
    if (currentAddress) return currentAddress;
    
    // Then try to get it from localStorage
    try {
      // Check for sui-dapp-kit connection info
      const walletConnectionInfo = localStorage.getItem('sui-dapp-kit:wallet-connection-info');
      if (walletConnectionInfo) {
        const connectionInfo = JSON.parse(walletConnectionInfo);
        if (connectionInfo?.state?.lastConnectedAccountAddress) {
          return connectionInfo.state.lastConnectedAccountAddress;
        }
      }
      
      // Check for other common localStorage keys
      const possibleWalletKeys = [
        'lastConnectedAccountAddress',
        'wallet-address',
        'connected-address',
        'account-address',
        'sui-wallet-address',
        'sui-account-address'
      ];
      
      for (const key of possibleWalletKeys) {
        const value = localStorage.getItem(key);
        if (value) return value;
      }
      
      // Check if any key contains 'address' or 'wallet'
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.toLowerCase().includes('address') || key.toLowerCase().includes('wallet'))) {
          const value = localStorage.getItem(key);
          if (value) return value;
        }
      }
    } catch (error) {
      console.error('Error getting wallet address from localStorage:', error);
    }
    
    return null;
  };
  
  const walletAddress = getWalletAddress();
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

        // Create a move call with properly encoded string arguments
        tx.moveCall({
          target: `${SESSION_PACKAGE_ID}::session_manager::create_session`,
          arguments: [
            tx.object(SESSION_STORE_OBJECT_ID),
            tx.pure(toUint8Array(sessionData.title)),
            tx.pure(toUint8Array(sessionData.description)),
            tx.pure(toUint8Array(sessionData.category)),
            tx.pure(toUint8Array(sessionData.duration)),
            tx.pure(toUint8Array(sessionData.roomName)),
            tx.pure(toUint8Array(sessionData.createdAt)),
          ],
        });
        
        // Set the gas budget
        tx.setGasBudget(10000000);

        // Sign and execute the transaction
        return new Promise((resolve, reject) => {
          signAndExecuteTransaction(
            { transaction: tx },
            {
              onSuccess: async ({ digest }) => {
                try {
                  console.log('Transaction successful:', digest);
                  // Wait for transaction to be included in a checkpoint
                  const { effects } = await suiClient.waitForTransaction({
                    digest,
                    options: {
                      showEffects: true,
                    },
                  });
                  console.log('Transaction effects:', effects);
                  
                  // Invalidate and refetch the sessions query
                  await queryClient.invalidateQueries({ queryKey: ['suiSessions'] });
                  
                  resolve(effects);
                } catch (error) {
                  console.error('Error in transaction success handler:', error);
                  reject(error);
                }
              },
              onError: (error) => {
                console.error('Transaction failed:', error);
                reject(error);
              },
            }
          );
        });
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
    isConnected: isAuthenticated,
    walletAddress: walletAddress,
  };
}
