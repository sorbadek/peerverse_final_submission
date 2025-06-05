import React, { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useZkLogin } from '../contexts/ZkLoginContext';
import { toast } from './ui/use-toast';

// Jitsi Meet API types
type JitsiCommand = 'displayName' | 'password' | 'toggleLobby' | 'overwriteConfig' | string;
type JitsiEvent = 'videoConferenceJoined' | 'videoConferenceLeft' | 'readyToClose' | 'participantJoined' | 'participantLeft' | 'error' | string;

interface JitsiMeetAPI {
  dispose: () => void;
  executeCommand: (command: JitsiCommand, ...args: unknown[]) => void;
  addEventListener: (event: JitsiEvent, listener: (...args: unknown[]) => void) => void;
  removeEventListener: (event: JitsiEvent, listener: (...args: unknown[]) => void) => void;
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
  
  // Memoize Jitsi options to prevent unnecessary re-renders
  const jitsiOptions = useMemo<JitsiMeetAPIOptions>(() => {
    let name = displayName;
    
    // Fallback name if displayName is not provided
    if (!name) {
      if (currentAddress) {
        name = `User-${currentAddress.slice(0, 6)}`;
      } else if (user?.name) {
        name = user.name;
      } else if (user?.email) {
        name = user.email.split('@')[0];
      } else {
        name = 'Anonymous';
      }
    }
    
    return {
      roomName,
      parentNode: jitsiContainerRef.current,
      width: '100%',
      height: '100%',
      userInfo: {
        displayName: name,
        email: user?.email || ''
      },
      configOverwrite: {
        startWithAudioMuted: !isHost,
        startWithVideoMuted: !isHost,
        enableWelcomePage: false,
        enableClosePage: false,
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
          'fodeviceselection', 'hangup', 'profile', 'recording',
          'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
          'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
          'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
          'security'
        ],
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
      },
    };
  }, [roomName, displayName, user?.email, user?.name, currentAddress, isHost]);

  // Initialize Jitsi when script is loaded
  const initializeJitsi = useCallback(() => {
    if (!jitsiContainerRef.current || !window.JitsiMeetExternalAPI) {
      console.error('Jitsi container or API not available');
      return () => {};
    }

    if (!isAuthenticated) {
      console.warn('User not authenticated, proceeding as guest');
    }

    try {
      apiRef.current = new window.JitsiMeetExternalAPI('meet.jit.si', jitsiOptions);

      // Event handlers
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

      const handleParticipantJoined = (participant: JitsiParticipant) => {
        console.log('Participant joined:', participant.displayName);
      };

      const handleParticipantLeft = (participant: JitsiParticipant) => {
        console.log('Participant left:', participant.displayName);
      };

      const handleError = (error: Error) => {
        console.error('Jitsi error:', error);
        toast({
          title: 'Error',
          description: 'Failed to initialize video call',
          variant: 'destructive',
        });
      };

      // Add event listeners with proper type assertions
      const listeners = [
        { event: 'videoConferenceJoined' as const, handler: handleVideoConferenceJoined },
        { event: 'videoConferenceLeft' as const, handler: handleVideoConferenceLeft },
        { event: 'readyToClose' as const, handler: handleReadyToClose },
        { event: 'participantJoined' as const, handler: handleParticipantJoined as (...args: unknown[]) => void },
        { event: 'participantLeft' as const, handler: handleParticipantLeft as (...args: unknown[]) => void },
        { event: 'error' as const, handler: handleError as (...args: unknown[]) => void },
      ];

      // Add all event listeners
      listeners.forEach(({ event, handler }) => {
        apiRef.current?.addEventListener(event, handler);
      });

      // Cleanup functionl
      return () => {
        if (apiRef.current) {
          // Remove all event listeners
          listeners.forEach(({ event, handler }) => {
            apiRef.current?.removeEventListener(event, handler);
          });
          // Dispose the API
          apiRef.current.dispose();
          apiRef.current = null;
        }
      };
    } catch (error) {
      console.error('Failed to initialize Jitsi:', error);
      toast({
        title: 'Error',
        description: 'Failed to initialize video call',
        variant: 'destructive',
      });
      return () => {};
    }
  }, [jitsiOptions, isAuthenticated, onClose]);

  useEffect(() => {
    if (typeof window === 'undefined' || window.JitsiMeetExternalAPI) {
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

  // Initialize Jitsi when script is loaded and we have a display name
  useEffect(() => {
    if (scriptLoaded && displayName && displayName !== 'Anonymous') {
      const cleanup = initializeJitsi();
      return cleanup;
    }
    return undefined;
  }, [scriptLoaded, displayName, initializeJitsi]);

  return <div ref={jitsiContainerRef} style={{ width: '100%', height: '100%' }} />;
};

export default JitsiMeet;
