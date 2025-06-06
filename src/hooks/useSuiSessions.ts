import React from 'react';
import { 
  useSuiClient, 
  useSignAndExecuteTransaction, 
  useCurrentAccount, 
  useConnectWallet, 
  useWallets, 
  useSignPersonalMessage 
} from '@mysten/dapp-kit';
import { isEnokiWallet } from '@mysten/enoki';
import { Transaction } from '@mysten/sui/transactions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { SuiClient } from '@mysten/sui/client';
import { useZkLogin } from '../contexts/ZkLoginContext';

// Constants
const SESSION_PACKAGE_ID = "0x3126d451831200a73bd29fb45608867123d6ed0c6b1032c958a187b9385a163c";
const SESSION_STORE_OBJECT_ID = "0xda8d0ff61cbd2867daf68520bedfe24d65bff05c8e11bf098ab207b7ac98f2bb";

// Type definitions for transaction handling
interface CreatedObject {
  owner?: {
    AddressOwner?: string;
  };
  reference?: {
    objectId: string;
  };
}

interface TransactionEffects {
  created?: CreatedObject[];
}

interface TransactionResult {
  effects: TransactionEffects | string;
  digest: string;
}

interface SessionStoreFields {
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
}

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

export function useSuiSessions() {
  const suiClient = useSuiClient();
  const { isAuthenticated, currentAddress } = useZkLogin();
  const currentAccount = useCurrentAccount();
  const { mutate: connect } = useConnectWallet();
  const { mutateAsync: signPersonalMessage } = useSignPersonalMessage();
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
  const { data: suiSessions = [], isLoading, error, refetch } = useQuery<SuiSession[]>({
    queryKey: ['suiSessions', walletAddress],
    enabled: !!walletAddress,
    queryFn: async () => {
      if (!suiClient || !walletAddress) return [];
      
      try {
        const sessionStore = await suiClient.getObject({
          id: SESSION_STORE_OBJECT_ID,
          options: { showContent: true },
        });

        if (!sessionStore.data?.content || sessionStore.data.content.dataType !== 'moveObject') {
          throw new Error('Invalid session store object');
        }

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

        const storeFields = sessionStore.data.content.fields as unknown as SessionStoreFields;
        
        if (!storeFields.sessions) return [];

        // Map the sessions to the expected format
        return storeFields.sessions.map(session => ({
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
    mutationFn: async (sessionData: SessionData): Promise<{ sessionId: string }> => {
      console.log('Creating session with data:', sessionData);
  
      if (!walletAddress || !currentAccount) {
        throw new Error('Please connect your wallet first');
      }

      // Validate required fields
      if (!sessionData.title) {
        throw new Error('Title is required');
      }

      // First, try to find an existing session store owned by the user
      let sessionStoreId = SESSION_STORE_OBJECT_ID; // Fallback to the default ID
      
      try {
        // Look for session stores owned by the current user
        const ownedObjects = await suiClient.getOwnedObjects({
          owner: walletAddress,
          filter: {
            StructType: `${SESSION_PACKAGE_ID}::session_manager::SessionStore`
          },
          options: { showContent: true }
        });

        if (ownedObjects.data.length > 0) {
          // Use the first session store found
          sessionStoreId = ownedObjects.data[0].data?.objectId || SESSION_STORE_OBJECT_ID;
          console.log('Using existing session store:', sessionStoreId);
        } else {
          // Create a new session store if none exists
          console.log('No existing session store found, creating a new one');
          const createStoreTx = new Transaction();
          createStoreTx.moveCall({
            target: `${SESSION_PACKAGE_ID}::session_manager::create_session_store`,
            arguments: [],
          });
          createStoreTx.setGasBudget(10_000_000);
          
          interface CreatedObject {
            owner?: {
              AddressOwner?: string;
            };
            reference?: {
              objectId: string;
            };
          }

          interface TransactionEffects {
            created?: CreatedObject[];
          }

          interface TransactionResult {
            effects: TransactionEffects | string;
            digest: string;
          }

          const createStoreResult = await signAndExecuteTransaction({
            transaction: createStoreTx,
            chain: 'sui:devnet',
            account: currentAccount,
          }) as unknown as TransactionResult;
          
          console.log('Create store result:', createStoreResult);
          
          // Handle base64-encoded effects
          let effects: TransactionEffects = {};
          if (typeof createStoreResult.effects === 'string') {
            try {
              // First try to decode as base64
              const decoded = atob(createStoreResult.effects);
              // Then try to parse as JSON if it looks like JSON
              if (decoded.trim().startsWith('{')) {
                effects = JSON.parse(decoded) as TransactionEffects;
              }
            } catch (e) {
              console.warn('Could not parse effects as JSON, using empty object');
            }
          } else {
            effects = createStoreResult.effects as TransactionEffects;
          }
            
          if (effects?.created) {
            const createdObject = effects.created.find(
              (obj: CreatedObject) => obj.owner?.AddressOwner === walletAddress
            );
            if (createdObject?.reference?.objectId) {
              sessionStoreId = createdObject.reference.objectId;
              console.log('Found new session store ID:', sessionStoreId);
            }
          }
          
          if (!sessionStoreId) {
            throw new Error('Failed to get the created session store ID');
          }
        }

        // Now create the session using the found or created session store
        const txb = new Transaction();
        
        const [session] = txb.moveCall({
          target: `${SESSION_PACKAGE_ID}::session_manager::create_session`,
          arguments: [
            txb.object(sessionStoreId),
            txb.pure.address(walletAddress),
            txb.pure.string(sessionData.title),
            txb.pure.string(sessionData.description || ''),
            txb.pure.string(sessionData.category || ''),
            txb.pure.string(sessionData.duration || ''),
            txb.pure.string(sessionData.roomName || ''),
            txb.pure.string(sessionData.createdAt || new Date().toISOString()),
          ],
        });
        
        txb.transferObjects([session], txb.pure.address(walletAddress));
        txb.setGasBudget(10_000_000);
        
        console.log('Submitting session creation transaction with signer:', walletAddress);
        const result = await signAndExecuteTransaction({
          transaction: txb,
          chain: 'sui:devnet',
          account: currentAccount,
        });
        
        // Refetch sessions after successful transaction
        await queryClient.invalidateQueries({ queryKey: ['suiSessions'] });
        
        // Extract the created session ID from the transaction result
        let sessionId: string | undefined;
        
        // Handle base64-encoded effects for session creation
        let resultEffects: TransactionEffects = {};
        if (typeof result.effects === 'string') {
          try {
            // First try to decode as base64
            const decoded = atob(result.effects);
            // Then try to parse as JSON if it looks like JSON
            if (decoded.trim().startsWith('{')) {
              resultEffects = JSON.parse(decoded) as TransactionEffects;
            }
          } catch (e) {
            console.warn('Could not parse effects as JSON, using empty object');
          }
        } else {
          resultEffects = result.effects as TransactionEffects;
        }
          
        if (resultEffects?.created) {
          // Find the created session object
          const createdSession = resultEffects.created.find(
            (obj: CreatedObject) => obj.owner?.AddressOwner === walletAddress
          );
          
          if (createdSession?.reference?.objectId) {
            sessionId = createdSession.reference.objectId;
          }
        }
        
        // Fallback to using the transaction digest if we couldn't find the object ID
        if (!sessionId) {
          console.warn('Could not find created session ID in transaction result, using transaction digest instead');
          sessionId = result.digest;
        }
        
        console.log('Created session with ID:', sessionId);
        return { sessionId };
        
      } catch (error) {
        console.error('Error creating session:', error);
        throw new Error('Failed to create session: ' + (error as Error).message);
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
    walletAddress: walletAddress || '',
    wallet: currentAccount,
    signMessage: signPersonalMessage,
  };
}
