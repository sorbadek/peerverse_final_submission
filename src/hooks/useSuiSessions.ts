import React from 'react';
import { useSuiClient, useSignAndExecuteTransaction, useCurrentAccount, useConnectWallet, useWallets } from '@mysten/dapp-kit';
import { isEnokiWallet } from '@mysten/enoki';
import { Transaction } from '@mysten/sui/transactions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { SuiClient } from '@mysten/sui/client';
import { useZkLogin } from '../contexts/ZkLoginContext';

const SESSION_PACKAGE_ID = "0x3126d451831200a73bd29fb45608867123d6ed0c6b1032c958a187b9385a163c"
;
const SESSION_STORE_OBJECT_ID = "0xda8d0ff61cbd2867daf68520bedfe24d65bff05c8e11bf098ab207b7ac98f2bb"
;

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
  
      if (!walletAddress) {
        throw new Error('Please connect your wallet first');
      }

      // Verify that the connected wallet is the owner of the session store
      try {
        const sessionStore = await suiClient.getObject({
          id: SESSION_STORE_OBJECT_ID,
          options: { showOwner: true },
        });

        const ownerAddress = sessionStore.data?.owner?.AddressOwner;
        if (walletAddress !== ownerAddress) {
          throw new Error(`You must be the owner of the session store to create a session. Current owner: ${ownerAddress}, Your address: ${walletAddress}`);
        }
      } catch (error) {
        console.error('Error verifying session store ownership:', error);
        throw new Error('Failed to verify session store ownership');
      }
  
      // Validate required fields
      if (
        !sessionData.title ||
        !sessionData.description ||
        !sessionData.category ||
        !sessionData.duration ||
        !sessionData.roomName ||
        !sessionData.createdAt
      ) {
        throw new Error('Missing required session data');
      }
  
      try {
        const txb = new Transaction();
  
        txb.moveCall({
          target: `${SESSION_PACKAGE_ID}::session_manager::create_session`,
          arguments: [
            txb.object(SESSION_STORE_OBJECT_ID), // session_store: &mut SessionStore
            txb.pure.address(walletAddress),     // ctx: &mut TxContext
            txb.pure.string(sessionData.title),
            txb.pure.string(sessionData.description),
            txb.pure.string(sessionData.category),
            txb.pure.string(sessionData.duration),
            txb.pure.string(sessionData.roomName),
            txb.pure.string(sessionData.createdAt),
          ],
        });
        
        // Set a reasonable gas budget
        txb.setGasBudget(10_000_000);
  
        console.log('Submitting transaction with signer:', walletAddress);
        const result = await new Promise((resolve, reject) => {
          signAndExecuteTransaction(
            {
              transaction: txb,
              chain: 'sui:devnet',
              account: currentAccount,
              options: {
                showEffects: true,
                showEvents: true,
              },
            },
            {
              onSuccess: (result) => {
                console.log('Transaction success:', result);
                resolve(result);
              },
              onError: (error) => {
                console.error('Transaction error:', error);
                reject(error);
              },
            }
          );
        });
  
        // Refetch sessions after successful transaction
        await queryClient.invalidateQueries({ queryKey: ['suiSessions'] });
  
        return result;
      } catch (error) {
        console.error('Error creating session:', error);
        throw error;
      }
    },
    onSuccess: () => {
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
