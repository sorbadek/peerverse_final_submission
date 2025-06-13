import React from 'react';
import { 
  useSuiClient, 
  useSignAndExecuteTransaction, 
  useCurrentAccount, 
  useConnectWallet, 
  useWallets,
} from '@mysten/dapp-kit';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { isEnokiWallet } from '@mysten/enoki';
import { Transaction } from '@mysten/sui/transactions';
import type { SuiClient, SuiTransactionBlockResponse, MoveStruct, SuiObjectRef } from '@mysten/sui/client';
import { toB64 } from '@mysten/sui/utils';
import { bcs } from '@mysten/bcs';
import { useZkLogin } from '../contexts/ZkLoginContext';

// Get contract addresses from environment variables
const SESSION_PACKAGE_ID = import.meta.env.VITE_SESSION_PACKAGE_ID;
const SESSION_STORE_OBJECT_ID = import.meta.env.VITE_SESSION_STORE_OBJECT_ID;

if (!SESSION_PACKAGE_ID || !SESSION_STORE_OBJECT_ID) {
  console.warn('Session package ID or store object ID is not set in environment variables');
}

// Helper function to find the session store object ID if not known
async function findSessionStoreId(suiClient: SuiClient, owner: string): Promise<string | null> {
  try {
    const objects = await suiClient.getOwnedObjects({
      owner,
      filter: {
        StructType: `${SESSION_PACKAGE_ID}::session_manager::SessionStore`
      },
      options: { showType: true }
    });

    return objects.data[0]?.data?.objectId || null;
  } catch (error) {
    console.error('Error finding session store:', error);
    return null;
  }
}

export interface SessionData {
  id: string;
  owner: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  room_name: string;
  created_at: string;
}

export function useSuiSessions() {
  const suiClient = useSuiClient();
  const { currentAddress } = useZkLogin();
  const currentAccount = useCurrentAccount();
  const { mutate: connect } = useConnectWallet();
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const queryClient = useQueryClient();
  const wallets = useWallets();
  
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
  
  // Initialize wallet connection for zkLogin if needed
  React.useEffect(() => {
    if (storedConnectionInfo?.walletName?.startsWith('enoki:') && !currentAccount) {
      const enokiWallet = wallets.find(isEnokiWallet);
      if (enokiWallet) {
        connect({ wallet: enokiWallet });
      }
    }
  }, [storedConnectionInfo, currentAccount, connect, wallets]);
  
  // Get wallet address from current zkLogin, connected account, or stored connection
  const walletAddress = currentAddress || currentAccount?.address || storedConnectionInfo?.address;

  // Fetch all sessions
  const { data: suiSessions = [], isLoading, error, refetch } = useQuery<SessionData[]>({
    queryKey: ['suiSessions', walletAddress],
    enabled: !!walletAddress && !!SESSION_PACKAGE_ID,
    queryFn: async () => {
      if (!suiClient || !walletAddress || !SESSION_PACKAGE_ID) return [];
      
      try {
        // Try to find the session store if we don't have the ID
        let sessionStoreId = SESSION_STORE_OBJECT_ID;
        if (sessionStoreId === 'SESSION_STORE_OBJECT_ID') {
          const foundId = await findSessionStoreId(suiClient, walletAddress);
          if (!foundId) return [];
          sessionStoreId = foundId;
        }

        // Get the session store
        const sessionStore = await suiClient.getObject({
          id: sessionStoreId,
          options: { showContent: true },
        });

        if (!sessionStore.data?.content || sessionStore.data.content.dataType !== 'moveObject') {
          console.warn('Invalid session store object');
          return [];
        }

        // Type the session store content
        const content = sessionStore.data.content;
        if (content?.dataType !== 'moveObject') {
          console.warn('Expected moveObject data type');
          return [];
        }
        
        // Safely cast the fields to the expected shape
        const fields = content.fields as {
          id: { id: string };
          sessions?: Array<{
            fields: SessionData & { id: { id: string } };
          }>;
        };
        
        if (!fields.sessions) return [];

        // Map the sessions to the expected format
        return fields.sessions.map((session) => ({
          id: session.fields.id,
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
        return [];
      }
    },
    refetchOnWindowFocus: false,
  });

  // Create a new session
  const createSession = useMutation({
    mutationFn: async (sessionData: Omit<SessionData, 'id' | 'owner'>): Promise<{ sessionId: string }> => {
      if (!walletAddress || !currentAccount) {
        throw new Error('Please connect your wallet first');
      }

      // Validate required fields
      if (!sessionData.title) {
        throw new Error('Title is required');
      }

      // Try to find an existing session store or create one
      let sessionStoreId = SESSION_STORE_OBJECT_ID;
      
      // If we don't have a session store ID, try to find one
      if (sessionStoreId === 'SESSION_STORE_OBJECT_ID') {
        const foundId = await findSessionStoreId(suiClient, walletAddress);
        if (!foundId) {
          // Create a new session store if none exists
          const tx = new Transaction();
          tx.moveCall({
            target: `${SESSION_PACKAGE_ID}::session_manager::create_session_store`,
            arguments: [],
          });
          const result = await signAndExecuteTransaction({
            transaction: tx,
            chain: 'sui:devnet',
          });
          
          // If you need effects and events, you can fetch them separately
          if (result.digest) {
            const txDetails = await suiClient.getTransactionBlock({
              digest: result.digest,
              options: {
                showEffects: true,
                showEvents: true,
              },
            });
            console.log('Transaction details:', txDetails);
          }
          
          // Find the created session store ID
          const effects = result.effects as {
            created?: Array<{
              owner?: { AddressOwner?: string };
              reference?: { objectId: string };
            }>;
          };
          
          const createdObject = effects.created?.find(
            (obj) => obj.owner?.AddressOwner === walletAddress
          );
          
          if (!createdObject?.reference?.objectId) {
            throw new Error('Failed to create session store: No object ID returned');
          }
          
          sessionStoreId = createdObject.reference.objectId;
        } else {
          sessionStoreId = foundId;
        }
      }

      // Create the session
      const tx = new Transaction();
      
      // Helper function to create string arguments
      const makeStringArg = (value: string) => {
        // Use bcs to serialize the string
        const ser = bcs.ser('string', value).toBytes();
        return tx.pure(ser);
      };

      // Create the move call
      tx.moveCall({
        target: `${SESSION_PACKAGE_ID}::session_manager::create_session_entry`,
        arguments: [
          tx.object(sessionStoreId),
          makeStringArg(sessionData.title),
          makeStringArg(sessionData.description || ''),
          makeStringArg(sessionData.category || ''),
          makeStringArg(sessionData.duration || ''),
          makeStringArg(sessionData.room_name || ''),
          makeStringArg(new Date().toISOString()),
        ],
      });

      const result = await signAndExecuteTransaction({
        transaction: tx,
        chain: 'sui:devnet'
      });
      
      // Get transaction details separately if needed
      if (result.digest) {
        const txDetails = await suiClient.getTransactionBlock({
          digest: result.digest,
          options: {
            showEffects: true,
            showEvents: true,
          },
        });
        console.log('Transaction details:', txDetails);
      }

      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ['suiSessions'] });
      
      return { sessionId: result.digest };
    },
    onError: (error) => {
      console.error('Error creating session:', error);
      throw error;
    },
  });

  return {
    sessions: suiSessions,
    isLoading,
    error,
    refetch,
    createSession: createSession.mutateAsync,
    walletAddress,
    isConnected: !!walletAddress,
  };
}
