import React, { useEffect, useRef, useCallback, useState, useLayoutEffect, useContext } from 'react';
import { useZkLogin } from '../contexts/ZkLoginContext';
import { useSuiSessions } from '@/hooks/useSuiSessions';
import { AuthContext } from '@/contexts/AuthContext.types';
import { toast } from './ui/use-toast';
import { useSuiClient } from '@mysten/dapp-kit';
import { toB64 } from '@mysten/sui.js/utils';

// Jitsi Meet API types
type JitsiCommand = 'displayName' | 'password' | 'toggleLobby' | 'overwriteConfig' | 'toggleAudio' | 'toggleVideo' | string;
type JitsiEvent = 'videoConferenceJoined' | 'videoConferenceLeft' | 'readyToClose' | 'participantJoined' | 'participantLeft' | 'error' | string;
type JitsiEventHandler = (...args: unknown[]) => void;

// Extend the JitsiMeetAPI interface to include the 'on' method
declare global {
  interface JitsiMeetAPI {
    on: (event: string, handler: JitsiEventHandler) => void;
    off: (event: string, handler: JitsiEventHandler) => void;
    executeCommand: (command: JitsiCommand, ...args: unknown[]) => void;
    dispose: () => void;
    removeEventListener: (event: string, handler: JitsiEventHandler) => void;
  }
}

// Extended JitsiMeetAPI interface with all required methods
declare global {
  interface JitsiMeetAPI {
    // Core methods
    dispose: () => void;
    executeCommand: (command: JitsiCommand, ...args: unknown[]) => void;
    
    // Event handling methods (using both 'on/off' and 'addEventListener/removeEventListener' patterns)
    on: (event: string, handler: JitsiEventHandler) => void;
    off: (event: string, handler: JitsiEventHandler) => void;
    addEventListener: (event: string, listener: JitsiEventHandler) => void;
    removeEventListener: (event: string, listener: JitsiEventHandler) => void;
    
    // Additional methods that might be needed
    isAudioMuted: () => boolean;
    isVideoMuted: () => boolean;
    getDisplayName: () => string;
    getEmail: () => string | null;
    getRoomName: () => string;
    
    // Index signature for dynamic properties
    [key: string]: unknown;
  }
}

interface JitsiMeetAPIOptions {
  roomName: string;
  width?: string | number;
  height?: string | number;
  parentNode: HTMLElement | null;
  jwt?: string;
  userInfo?: {
    displayName?: string;
    email?: string;
  };
  configOverwrite?: {
    startWithAudioMuted?: boolean;
    startWithVideoMuted?: boolean;
    enableWelcomePage?: boolean;
    enableClosePage?: boolean;
    [key: string]: unknown;
  };
  interfaceConfigOverwrite?: {
    TOOLBAR_BUTTONS?: string[];
    SHOW_JITSI_WATERMARK?: boolean;
    SHOW_WATERMARK_FOR_GUESTS?: boolean;
    [key: string]: unknown;
  };
}

interface JitsiMeetProps {
  roomName: string;
  onClose: () => void;
  isHost?: boolean;
  displayName?: string;
}

interface JitsiParticipant {
  displayName: string;
  id: string;
  role?: string;
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: new (domain: string, options: JitsiMeetAPIOptions) => JitsiMeetAPI;
  }
}

const JitsiMeet = ({ roomName, onClose, isHost = false, displayName = 'User' }: JitsiMeetProps): JSX.Element => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const isAuth = authContext?.isAuthenticated || false;
  const { currentAddress, isAuthenticated: isZkAuthenticated } = useZkLogin();
  const { wallet, isConnected, walletAddress, isLoading: isSessionLoading, signMessage } = useSuiSessions();
  const suiClient = useSuiClient();
  const [authToken, setAuthToken] = useState<string>('');
  
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<JitsiMeetAPI | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  interface RoomInfo {
    content?: {
      dataType: string;
      type: string;
      hasPublicTransfer: boolean;
      fields: Record<string, unknown>;
    };
    owner?: {
      AddressOwner?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  }

  const [roomInfo, setRoomInfo] = useState<RoomInfo | null>(null);
  const [isLoadingRoom, setIsLoadingRoom] = useState(true);
  const [roomError, setRoomError] = useState<string | null>(null);

  // Fetch room info from blockchain or local storage
  const fetchRoomInfo = useCallback(async () => {
    if (!roomName) return null;

    try {
      setIsLoadingRoom(true);
      setRoomError(null);

      // Check if this is a local session (starts with 'tutorHub_session_')
      const isLocalSession = roomName.startsWith('tutorHub_session_');
      
      // For local sessions, use the local storage wallet
      if (isLocalSession) {
        // Try to get wallet from local storage first, then from props
        const storedWallet = localStorage.getItem('wallet-address');
        const effectiveWallet = storedWallet || walletAddress || currentAddress;
        
        if (!effectiveWallet) {
          throw new Error('Please connect your wallet to join the session');
        }

        // Return a minimal room info object for local sessions
        return {
          id: roomName,
          owner: effectiveWallet,
          title: 'Peer Session',
          description: 'Direct peer-to-peer tutoring session',
          category: 'Education',
          duration: '60 min',
          room_name: roomName,
          created_at: new Date().toISOString(),
          isHost: true
        } as unknown as RoomInfo;
      }

      // For non-local sessions, check if it's a valid Sui object ID
      const isSuiObjectId = /^0x[0-9a-fA-F]{1,64}$/.test(roomName);
      if (!isSuiObjectId) {
        throw new Error('Invalid room identifier');
      }

      // If it's a valid Sui object ID, try to fetch from blockchain
      try {
        const roomObj = await suiClient.getObject({
          id: roomName,
          options: { showContent: true },
        });

        if (!roomObj.data) {
          throw new Error('Room not found on blockchain');
        }

        return roomObj.data.content as RoomInfo;
      } catch (blockchainError) {
        console.error('Blockchain fetch error:', blockchainError);
        throw new Error('Failed to fetch room from blockchain');
      }
    } catch (error) {
      console.error('Error fetching room info:', error);
      
      // For local sessions, try to continue with minimal info
      if (roomName.startsWith('tutorHub_session_')) {
        const fallbackWallet = localStorage.getItem('wallet-address') || 
                             walletAddress || 
                             currentAddress || 
                             'unknown';
        
        return {
          id: roomName,
          owner: fallbackWallet,
          title: 'Peer Session',
          description: 'Direct peer-to-peer tutoring session',
          category: 'Education',
          duration: '60 min',
          room_name: roomName,
          created_at: new Date().toISOString(),
          isHost: true,
          _fallback: true // Indicate this is a fallback room info
        } as unknown as RoomInfo;
      }
      
      // For blockchain rooms, show appropriate error
      const errorMessage = error instanceof Error ? error.message : 'Failed to load room info';
      setRoomError(errorMessage);
      
      // If we have a wallet address, we can still create a minimal room
      const fallbackWallet = localStorage.getItem('wallet-address') || 
                           walletAddress || 
                           currentAddress;
      
      if (fallbackWallet) {
        return {
          id: roomName,
          owner: fallbackWallet,
          title: 'Tutoring Session',
          description: 'Direct tutoring session',
          category: 'Education',
          duration: '60 min',
          room_name: roomName,
          created_at: new Date().toISOString(),
          isHost: true,
          _fallback: true
        } as unknown as RoomInfo;
      }
      
      return null;
    } finally {
      setIsLoadingRoom(false);
    }
  }, [roomName, suiClient, walletAddress, currentAddress]);

  // Fetch room information from the blockchain or local storage
  useEffect(() => {
    fetchRoomInfo().then((roomInfo) => {
      if (roomInfo) {
        setRoomInfo(roomInfo);
      }
    });
  }, [fetchRoomInfo]);

  // Check authentication and initialization
  useEffect(() => {
    if (!isSessionLoading) {
      const isUserAuthenticated = isAuth || isZkAuthenticated || isConnected;
      
      if (!isUserAuthenticated) {
        toast({
          title: 'Authentication Required',
          description: 'Please connect your wallet to join the meeting',
          variant: 'destructive',
        });
        onClose();
        return;
      }
      
      setIsInitializing(false);
    }
  }, [isAuth, isZkAuthenticated, isConnected, isSessionLoading, onClose]);

  // Generate authentication token using zkLogin or wallet signature
  useEffect(() => {
    const generateAuthToken = async () => {
      try {
        let tokenData;
        const timestamp = Date.now();
        const uniqueId = `${timestamp}-${Math.random().toString(36).substr(2, 9)}`;
        
        if (isZkAuthenticated && currentAddress) {
          // For zkLogin users
          tokenData = {
            id: uniqueId,
            address: currentAddress,
            displayName: user?.name || `User-${currentAddress.slice(0, 6)}`,
            room: roomName,
            timestamp,
            authType: 'zkLogin'
          };
        } else if (wallet && walletAddress) {
          // For regular wallet users
          const message = `Jitsi Authentication - Room: ${roomName} - ${timestamp}`;
          const signature = await signMessage({
            message: new TextEncoder().encode(message)
          });
          
          tokenData = {
            id: uniqueId,
            address: walletAddress,
            displayName: user?.name || `User-${walletAddress.slice(0, 6)}`,
            room: roomName,
            timestamp,
            signature: toB64(signature.signature),
            authType: 'wallet'
          };
        } else {
          return; // No valid authentication method
        }
        
        // Store the token in base64 format
        setAuthToken(btoa(JSON.stringify(tokenData)));
      } catch (error) {
        console.error('Error generating auth token:', error);
        toast({
          title: 'Authentication Error',
          description: 'Failed to sign authentication message',
          variant: 'destructive',
        });
      }
    };

    if (isAuth || isZkAuthenticated || isConnected) {
      generateAuthToken();
    }
  }, [wallet, walletAddress, currentAddress, isAuth, isZkAuthenticated, isConnected, roomName, user?.name, signMessage]);

  // Initialize Jitsi when authenticated and room info is loaded
  useEffect(() => {
    if (!isSessionLoading) {
      const isUserAuthenticated = (isAuth || isZkAuthenticated || isConnected) && !!authToken;
      const isReady = !isLoadingRoom && !roomError && isUserAuthenticated;
      
      if (isReady) {
        setIsInitializing(false);
      } else if (!isUserAuthenticated) {
        toast({
          title: 'Authentication Required',
          description: 'Please connect your wallet to join the meeting',
          variant: 'destructive',
        });
        onClose();
      }
    }
  }, [
    isSessionLoading,
    isAuth,
    isZkAuthenticated,
    isConnected,
    isLoadingRoom,
    roomError,
    onClose,
    authToken
  ]);

  // Check for mobile on mount and window resize
  useLayoutEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Get user display name
  const getDisplayName = useCallback(() => {
    return user?.name || 
      (walletAddress ? `User-${walletAddress.slice(0, 6)}` : 
      (currentAddress ? `User-${currentAddress.slice(0, 6)}` : 'Anonymous'));
  }, [user?.name, walletAddress, currentAddress]);

  // Set up event handlers
  const setupEventHandlers = useCallback((jitsi: JitsiMeetAPI) => {
    if (!jitsi) return () => {};

    // Type-safe event handlers
    const handleVideoConferenceJoined = () => {
      console.log('User joined the conference');
    };

    const handleVideoConferenceLeft = () => {
      console.log('User left the conference');
      onClose();
    };

    const handleReadyToClose = () => {
      console.log('Jitsi is ready to close');
      onClose();
    };

    const handleParticipantJoined = (participant: unknown) => {
      const p = participant as JitsiParticipant;
      console.log('Participant joined:', p.displayName);
    };

    const handleParticipantLeft = (participant: unknown) => {
      const p = participant as JitsiParticipant;
      console.log('Participant left:', p.displayName);
    };

    const handleError = (error: unknown) => {
      console.error('Jitsi error:', error);
      toast({
        title: 'Conference Error',
        description: 'An error occurred in the video conference',
        variant: 'destructive',
      });
    };

    // Add event listeners using the correct method names
    // The JitsiMeetExternalAPI uses addEventListener/removeEventListener pattern
    jitsi.addEventListener('videoConferenceJoined', handleVideoConferenceJoined);
    jitsi.addEventListener('videoConferenceLeft', handleVideoConferenceLeft);
    jitsi.addEventListener('readyToClose', handleReadyToClose);
    jitsi.addEventListener('participantJoined', handleParticipantJoined);
    jitsi.addEventListener('participantLeft', handleParticipantLeft);
    jitsi.addEventListener('error', handleError);

    // Set initial audio/video states
    try {
      jitsi.executeCommand('displayName', getDisplayName());
      jitsi.executeCommand('toggleAudio', isHost);
      jitsi.executeCommand('toggleVideo', isHost);
    } catch (error) {
      console.error('Error setting initial Jitsi state:', error);
    }

    // Return cleanup function
    return () => {
      jitsi.removeEventListener('videoConferenceJoined', handleVideoConferenceJoined);
      jitsi.removeEventListener('videoConferenceLeft', handleVideoConferenceLeft);
      jitsi.removeEventListener('readyToClose', handleReadyToClose);
      jitsi.removeEventListener('participantJoined', handleParticipantJoined);
      jitsi.removeEventListener('participantLeft', handleParticipantLeft);
      jitsi.removeEventListener('error', handleError);
    };
  }, [onClose, getDisplayName, isHost]);

  // Store container reference to avoid closure issues
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Initialize Jitsi when script is loaded, we have a display name, and container is mounted
  useEffect(() => {
    const container = jitsiContainerRef.current;
    if (!scriptLoaded || !container) return;
    
    // Store container reference
    containerRef.current = container;
    
    let jitsiInstance: JitsiMeetAPI | null = null;
    let cleanupEventHandlers: (() => void) | null = null;

    const initJitsi = async () => {
      try {
        // Get display name before initializing Jitsi
        const displayName = getDisplayName();

        // Create a clean container for Jitsi
        const jitsiContainer = document.createElement('div');
        jitsiContainer.style.width = '100%';
        jitsiContainer.style.height = '100%';
        jitsiContainer.style.position = 'relative';
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(jitsiContainer);

        const userDisplayName = getDisplayName();
        const options: JitsiMeetAPIOptions = {
          roomName: roomName,
          parentNode: jitsiContainer,
          width: '100%',
          height: '100%',
          jwt: authToken,
          userInfo: {
            displayName: userDisplayName,
            email: user?.email || `${userDisplayName}@tutorhub.xyz`
          },
          configOverwrite: {
            startWithAudioMuted: !isHost,
            startWithVideoMuted: !isHost,
            enableWelcomePage: false,
            enableClosePage: false,
            disableDeepLinking: true,
            disableInviteFunctions: true,
            disableRemoteMute: !isHost,
            enableNoAudioDetection: false,
            enableNoisyMicDetection: false,
            enableAutomaticUrlCopy: false,
            enableInsecureRoomNameWarning: false,
            prejoinPageEnabled: false,
            // Disable features that might cause warnings
            disableRtx: true,
            disableRtpStats: true,
            disableSimulcast: false,
            enableIceRestart: true,
            enableIceTcp: true,
            p2p: {
              enabled: true,
              preferH264: true,
              disableH264: false,
              useStunTurn: true
            },
            // Optimize for performance
            constraints: {
              video: {
                height: {
                  ideal: 720,
                  max: 720,
                  min: 180
                },
                frameRate: {
                  max: 30
                }
              }
            },
            // Toolbar buttons configuration
            toolbarButtons: [
              'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
              'fodeviceselection', 'hangup', 'profile', 'info', 'chat', 'recording',
              'livestreaming', 'settings', 'raisehand', 'tileview', 'security'
            ]
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            BRAND_WATERMARK_LINK: '',
            SHOW_POWERED_BY: false,
            SHOW_PROMOTIONAL_CLOSE_PAGE: false,
            SHOW_DEEP_LINKING_IMAGE: false,
            GENERATE_ROOMNAMES_ON_WELCOME_PAGE: false,
            DISPLAY_WELCOME_PAGE_CONTENT: false,
            DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT: false,
            APP_NAME: 'TutorHub',
            NATIVE_APP_NAME: 'TutorHub',
            // Disable features that might cause warnings
            DISABLE_VIDEO_BACKGROUND: true,
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
            DISABLE_PRESENCE_STATUS: true,
            DISABLE_TRANSCRIPTION_SUBTITLES: true,
            DISABLE_VIDEO_QUALITY_LABEL: true,
            MOBILE_APP_PROMO: false,
            SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'profile', 'calendar']
          }
        };

        // Initialize Jitsi
        if (!window.JitsiMeetExternalAPI) {
          throw new Error('Jitsi Meet External API not loaded');
        }

        try {
          jitsiInstance = new window.JitsiMeetExternalAPI('meet.jit.si', options);
          apiRef.current = jitsiInstance;

          // Set up event handlers
          cleanupEventHandlers = setupEventHandlers(jitsiInstance);
        } catch (error) {
          console.error('Failed to initialize Jitsi:', error);
          toast({
            title: 'Failed to start video call',
            description: error instanceof Error ? error.message : 'Could not initialize the video conference',
            variant: 'destructive',
          });

          // Clean up any partial initialization
          if (containerRef.current) {
            containerRef.current.innerHTML = '';
          }

          onClose();
        }
      } catch (error) {
        console.error('Error initializing Jitsi:', error);
      }
    };

    initJitsi().catch(error => {
      console.error('Error in Jitsi initialization:', error);
      onClose();
    });

    // Cleanup function
    return () => {
      // Clean up event handlers
      if (cleanupEventHandlers) {
        cleanupEventHandlers();
      }

      // Clean up Jitsi instance
      if (jitsiInstance) {
        try {
          jitsiInstance.dispose();
        } catch (error) {
          console.error('Error disposing Jitsi instance:', error);
        }
      }
      
      // Clean up container using the stored reference
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        containerRef.current = null;
      }
    };
  }, [scriptLoaded, roomName, isHost, currentAddress, walletAddress, getDisplayName, onClose, setupEventHandlers, authToken, user?.email]);

  // Load Jitsi script
  useEffect(() => {
    if (window.JitsiMeetExternalAPI) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Jitsi script');
      toast({
        title: 'Error',
        description: 'Failed to load video conferencing service',
        variant: 'destructive',
      });
    };

    document.body.appendChild(script);

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }
    };
  }, []);

  // Base styles for all devices
  const containerStyles: React.CSSProperties = {
    width: '100%',
    height: '100vh', // Full viewport height minus header
    minHeight: '500px',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  };

  // Mobile-specific styles
  if (isMobile) {
    containerStyles.position = 'fixed';
    containerStyles.top = 0;
    containerStyles.left = 0;
    containerStyles.right = 0;
    containerStyles.bottom = 0;
    containerStyles.height = '100vh';
    containerStyles.width = '100vw';
    containerStyles.borderRadius = 0;
    containerStyles.zIndex = 50;
  }

  return (
    <div 
      ref={jitsiContainerRef} 
      style={containerStyles}
      className={`jitsi-container ${isMobile ? 'mobile' : ''}`}
    />
  );
};

export default JitsiMeet;
