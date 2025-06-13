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
import type { SuiClient } from '@mysten/sui/client';

import { useZkLogin } from '../contexts/ZkLoginContext';

// Get contract addresses from environment variables
const SESSION_PACKAGE_ID = import.meta.env.VITE_SESSION_PACKAGE_ID;
const SESSION_STORE_OBJECT_ID = import.meta.env.VITE_SESSION_STORE_OBJECT_ID;

if (!SESSION_PACKAGE_ID || !SESSION_STORE_OBJECT_ID) {
  console.warn('Session package ID or store object ID is not set in environment variables');
}

export interface SessionData {
  session_id: string;
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

  // Define the type for session store fields
  interface SessionStoreFields {
    id: { id: string };
    sessions: Array<{
      fields: {
        session_id: string;
        owner: string;
        title: string;
        description: string;
        category: string;
        duration: string;
        room_name: string;
        created_at: string;
      };
    }>;
    next_session_id: string;
  }

  // Fetch all sessions
  const { data: suiSessions = [], isLoading, error, refetch } = useQuery<SessionData[]>({
    queryKey: ['suiSessions'],
    enabled: !!SESSION_PACKAGE_ID && !!SESSION_STORE_OBJECT_ID,
    queryFn: async () => {
      if (!suiClient || !SESSION_PACKAGE_ID || !SESSION_STORE_OBJECT_ID) return [];
      
      try {
        // Get the session store
        const sessionStore = await suiClient.getObject({
          id: SESSION_STORE_OBJECT_ID,
          options: { showContent: true },
        });

        if (!sessionStore.data?.content || sessionStore.data.content.dataType !== 'moveObject' || !sessionStore.data.content.fields) {
          console.warn('Invalid session store content');
          return [];
        }
        
        // Cast the fields to the expected shape
        const fields = sessionStore.data.content.fields as unknown as SessionStoreFields;
        
        if (!fields.sessions) return [];

        // Map the sessions to the expected format
        return fields.sessions.map((session) => ({
          session_id: session.fields.session_id.toString(),
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
    mutationFn: async (sessionData: Omit<SessionData, 'session_id' | 'owner'>): Promise<{ sessionId: string }> => {
      if (!walletAddress || !currentAccount) {
        throw new Error('Please connect your wallet first');
      }

      // Validate required fields
      if (!sessionData.title) {
        throw new Error('Title is required');
      }

      // Use the shared session store
      if (!SESSION_STORE_OBJECT_ID) {
        throw new Error('Session store not initialized');
      }

      // Create a new transaction block
      const tx = new Transaction();
      
      // Add the shared object as an argument
      const sessionStoreArg = tx.object(SESSION_STORE_OBJECT_ID);
      
      // Create the move call with properly typed arguments
      tx.moveCall({
        target: `${SESSION_PACKAGE_ID}::session_manager::create_session_entry`,
        typeArguments: [],
        arguments: [
          sessionStoreArg, // Shared object reference
          tx.pure.string(sessionData.title),
          tx.pure.string(sessionData.description || ''),
          tx.pure.string(sessionData.category || ''),
          tx.pure.string(sessionData.duration || ''),
          tx.pure.string(sessionData.room_name || ''),
          tx.pure.string(sessionData.created_at || new Date().toISOString()),
        ],
      });
      
      // Set gas budget for the transaction
      tx.setGasBudget(10000000);

      // Execute the transaction with shared object handling
      // The wallet will automatically detect and handle the shared object reference in the transaction
      const txResult = await signAndExecuteTransaction(
        {
          transaction: tx,
          chain: 'sui:devnet',
        },
        {
          onSuccess: (result) => {
            console.log('Transaction successful:', result);
          },
          onError: (error) => {
            console.error('Transaction failed:', error);
          },
        }
      );

      // Get the transaction details to find the new session ID
      if (txResult.digest) {
        const txDetails = await suiClient.getTransactionBlock({
          digest: txResult.digest,
          options: {
            showEffects: true,
            showEvents: true,
            showObjectChanges: true,
          },
        });
        console.log('Session created:', txDetails);

        // Find the new session ID from the object changes
        const objectChanges = txDetails.objectChanges || [];
        const createdSession = objectChanges.find(
          (change: { type: string; objectType?: string }) => 
            change.type === 'created' && 
            change.objectType?.includes('session_manager::Session')
        );
        
        if (createdSession && 'objectId' in createdSession) {
          return { sessionId: createdSession.objectId };
        }
      }

      // If we couldn't find the session ID in the transaction details,
      // just return a success response and let the refetch update the UI
      return { sessionId: 'unknown' };
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
