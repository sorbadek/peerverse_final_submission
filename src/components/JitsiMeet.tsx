import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useZkLogin } from '../contexts/ZkLoginContext';
import { toast } from './ui/use-toast';

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
  const { user, isAuthenticated } = useAuth();
  const { currentAddress } = useZkLogin();
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<JitsiMeetAPI | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
  
  // Get user display name
  const getDisplayName = useCallback(() => {
    if (displayName) return displayName;
    
    if (currentAddress) {
      return `User-${currentAddress.slice(0, 6)}`;
    } else if (user?.name) {
      return user.name;
    } else if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Anonymous';
  }, [displayName, currentAddress, user]);

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

        const options: JitsiMeetAPIOptions = {
          roomName: roomName,
          parentNode: jitsiContainer,
          width: '100%',
          height: '100%',
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
          },
          userInfo: {
            displayName,
            email: ''
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
  }, [scriptLoaded, roomName, isHost, user?.email, getDisplayName, onClose, setupEventHandlers]);

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

  return <div ref={jitsiContainerRef} style={{ width: '100%', height: '100%' }} />;
};

export default JitsiMeet;
