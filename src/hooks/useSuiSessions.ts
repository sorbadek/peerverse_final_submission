import React from 'react';
import { useSuiClient, useSignAndExecuteTransaction, useCurrentAccount, useConnectWallet, useWallets, useSignMessage } from '@mysten/dapp-kit';
import { isEnokiWallet } from '@mysten/enoki';
import { Transaction } from '@mysten/sui/transactions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { SuiClient } from '@mysten/sui/client';
import { useZkLogin } from '../contexts/ZkLoginContext';

const SESSION_PACKAGE_ID = "0x3126d451831200a73bd29fb45608867123d6ed0c6b1032c958a187b9385a163c";
const SESSION_STORE_OBJECT_ID = "0xda8d0ff61cbd2867daf68520bedfe24d65bff05c8e11bf098ab207b7ac98f2bb";

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
  const { mutateAsync: signMessage } = useSignMessage();
  
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
  
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction({
    onSuccess: (result) => {
      console.log('Transaction successful:', result);
    },
    onError: (error) => {
      console.error('Transaction failed:', error);
    },
  });
  
  // Helper function to execute transaction
  const executeTransaction = async (txb: Transaction) => {
    if (!currentAccount) {
      throw new Error('No connected account found');
    }
    
    // Set transaction options directly on the transaction object
    const txbWithOptions = new Transaction();
    Object.assign(txbWithOptions, txb);
    
    return signAndExecuteTransaction({
      transaction: txbWithOptions,
      chain: 'sui:devnet',
      account: currentAccount,
    });
  };
  
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
          
          const createStoreResult = await signAndExecuteTransaction({
            transaction: createStoreTx,
            chain: 'sui:devnet',
            account: currentAccount,
          });
          
          // Log the full transaction result for debugging
          console.log('Create store result:', createStoreResult);
          
          // Define interfaces for transaction result
          interface CreatedObject {
            reference?: {
              objectId: string;
              version: string;
              digest: string;
            };
            owner?: {
              AddressOwner?: string;
            };
          }

          interface TransactionEffects {
            status?: {
              status: string;
            };
            created?: CreatedObject[];
            createdObjects?: CreatedObject[];
            events?: Array<{
              type: string;
              sender: string;
              data: Record<string, unknown>;
            }>;
          }

          // Try to extract the created object ID from the transaction result
          try {
            console.log('Transaction result structure:', {
              digest: createStoreResult.digest,
              effectsType: typeof createStoreResult.effects,
              effectsKeys: createStoreResult.effects ? Object.keys(createStoreResult.effects) : 'none',
            });

            // Try to get the effects object
            const effects = createStoreResult.effects as unknown as TransactionEffects;
            
            // Check in created array first
            if (effects?.created?.length) {
              for (const obj of effects.created) {
                if (obj.reference?.objectId) {
                  sessionStoreId = obj.reference.objectId;
                  console.log('Found session store in effects.created:', sessionStoreId);
                  break;
                }
              }
            }
            
            // Check in createdObjects if still not found
            if (!sessionStoreId && effects?.createdObjects?.length) {
              for (const obj of effects.createdObjects) {
                if (obj.reference?.objectId) {
                  sessionStoreId = obj.reference.objectId;
                  console.log('Found session store in effects.createdObjects:', sessionStoreId);
                  break;
                }
              }
            }
            
            // If we still don't have an ID, try to parse the effects string directly
            if (!sessionStoreId && typeof createStoreResult.effects === 'string') {
              try {
                // Try to parse as JSON first (in case it's serialized)
                const parsedEffects = JSON.parse(createStoreResult.effects);
                if (parsedEffects?.created?.[0]?.reference?.objectId) {
                  sessionStoreId = parsedEffects.created[0].reference.objectId;
                  console.log('Found session store in parsed effects string:', sessionStoreId);
                }
              } catch (e) {
                console.log('Effects is not a JSON string, trying binary parsing');
                // If it's not JSON, it might be binary data
                const hexString = Array.from(createStoreResult.effects)
                  .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
                  .join('');
                
                // Look for the object ID pattern (32 bytes after 0x0101)
                const match = hexString.match(/0101([a-f0-9]{64})/i);
                if (match) {
                  sessionStoreId = '0x' + match[1];
                  console.log('Found session store in binary data:', sessionStoreId);
                }
              }
            }
            
            if (!sessionStoreId) {
              console.error('Could not find session store ID in transaction result');
              console.error('Transaction result:', JSON.stringify({
                digest: createStoreResult.digest,
                effects: createStoreResult.effects,
                effectsType: typeof createStoreResult.effects
              }, null, 2));
              throw new Error('Could not determine created object ID from transaction result');
            }
            
          } catch (error) {
            console.error('Error processing transaction result:', error);
            throw new Error('Failed to process transaction result: ' + (error as Error).message);
          }
        }

        // Now create the session using the found or created session store
        const txb = new Transaction();
        
        txb.moveCall({
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
        
        txb.setGasBudget(10_000_000);
        
        console.log('Submitting transaction with signer:', walletAddress);
        const result = await executeTransaction(txb);
        
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
    signMessage,
  };
}
