// src/components/JitsiMeet.tsx
import React, { useState, useCallback, useEffect, useRef, useContext } from 'react';
import { useSuiClient } from '@mysten/dapp-kit';
import { useParams } from 'react-router-dom';
import { toast } from './ui/use-toast';
import { AuthContext } from '@/contexts/AuthContext.types';

type JitsiCommand = 'displayName' | 'password' | 'toggleLobby' | 'overwriteConfig' | 'toggleAudio' | 'toggleVideo' | string;
type JitsiEvent = 'videoConferenceJoined' | 'videoConferenceLeft' | 'readyToClose' | 'participantJoined' | 'participantLeft' | 'error' | string;
type JitsiEventHandler = (...args: unknown[]) => void;

interface JitsiMeetAPI {
  dispose: () => void;
  executeCommand: (command: JitsiCommand, ...args: unknown[]) => void;
  on: (event: string, handler: JitsiEventHandler) => void;
  off: (event: string, handler: JitsiEventHandler) => void;
  addEventListener: (event: string, listener: JitsiEventHandler) => void;
  removeEventListener: (event: string, listener: JitsiEventHandler) => void;
  isAudioMuted: () => boolean;
  isVideoMuted: () => boolean;
  getDisplayName: () => string;
  getEmail: () => string | null;
  getRoomName: () => string;
  [key: string]: unknown;
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
    [key: string]: unknown;
  };
  interfaceConfigOverwrite?: {
    [key: string]: unknown;
  };
}

interface JitsiMeetProps {
  roomId?: string;
  onClose: () => void;
  displayName?: string;
  email?: string;
}

interface RoomInfo {
  id: string;
  owner: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  roomName: string;
  createdAt: string;
  isHost: boolean;
  [key: string]: unknown;
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: new (domain: string, options: JitsiMeetAPIOptions) => JitsiMeetAPI;
  }
}

const JitsiMeet: React.FC<JitsiMeetProps> = ({ roomId, onClose, displayName = 'User', email }) => {
  const { user } = useContext(AuthContext);
  const suiClient = useSuiClient();
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const [jitsi, setJitsi] = useState<JitsiMeetAPI | null>(null);
  const [roomInfo, setRoomInfo] = useState<RoomInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch room info from blockchain
  const { roomId: urlRoomId } = useParams<{ roomId: string }>();
  const effectiveRoomId = roomId || urlRoomId;

  // Helper function to validate Sui Object ID format
  const isValidSuiObjectId = (id: string): boolean => {
    return /^(0x)?[0-9a-f]{1,64}$/i.test(id);
  };

  const fetchRoomInfo = useCallback(async () => {
    if (!effectiveRoomId) {
      const errMsg = 'No room ID provided';
      console.error(errMsg);
      setError(errMsg);
      return null;
    }

    // Validate the room ID format
    if (!isValidSuiObjectId(effectiveRoomId)) {
      const errMsg = `Invalid room ID format: ${effectiveRoomId}. Room ID must be a valid Sui Object ID.`;
      console.error(errMsg);
      setError(errMsg);
      return null;
    }
    
    try {
      console.log('Fetching room info for ID:', effectiveRoomId);
      setIsLoading(true);
      setError(null);

      const roomObj = await suiClient.getObject({
        id: effectiveRoomId,
        options: { showContent: true },
      });

      console.log('Raw room object from blockchain:', roomObj);

      if (!roomObj.data?.content) {
        const errMsg = 'Room content not found in blockchain response';
        console.error(errMsg, roomObj);
        setError('Room not found or inaccessible');
        return null;
      }

      // Define the expected shape of the content object
      interface SuiMoveObjectContent {
        dataType: string;
        fields: RoomInfo;
        hasPublicTransfer?: boolean;
        type: string;
      }

      const content = roomObj.data.content as SuiMoveObjectContent;
      console.log('Room content:', content);

      if (content.dataType !== 'moveObject') {
        const errMsg = `Expected moveObject but got ${content.dataType}`;
        console.error(errMsg);
        setError('Invalid room data format');
        return null;
      }

      const roomData = content.fields as RoomInfo;
      console.log('Parsed room data:', roomData);

      // Ensure required fields exist
      if (!roomData.roomName || !roomData.owner) {
        const errMsg = 'Room data is missing required fields';
        console.error(errMsg, roomData);
        setError('Invalid room data: missing required fields');
        return null;
      }

      // Create room info object with proper defaults
      const roomInfo: RoomInfo = {
        id: effectiveRoomId,
        owner: roomData.owner,
        title: roomData.title || 'Untitled Session',
        description: roomData.description || '',
        category: roomData.category || 'General',
        duration: roomData.duration || '30 min',
        roomName: roomData.roomName || `room-${effectiveRoomId.slice(0, 8)}`,
        createdAt: roomData.createdAt || new Date().toISOString(),
        isHost: roomData.owner === (user?.address || ''),
      };

      console.log('Final room info:', roomInfo);
      return roomInfo;
    } catch (err) {
      const errorMsg = err instanceof Error ? 
        `Failed to load room: ${err.message}` : 
        'Failed to load room information';
      console.error('Error fetching room info:', err);
      setError(errorMsg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [effectiveRoomId, suiClient, user?.address]);

  // Load room info when effectiveRoomId changes
  useEffect(() => {
    if (!effectiveRoomId) return;
    
    const loadRoom = async () => {
      const info = await fetchRoomInfo();
      if (info) {
        setRoomInfo(info);
      }
    };

    loadRoom();
  }, [effectiveRoomId, fetchRoomInfo]);

  // Set up Jitsi event handlers
  const setupEventHandlers = useCallback((jitsiInstance: JitsiMeetAPI) => {
    if (!jitsiInstance) return () => {};

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
      console.log('Participant joined:', participant);
    };

    const handleParticipantLeft = (participant: unknown) => {
      console.log('Participant left:', participant);
    };

    const handleError = (error: unknown) => {
      console.error('Jitsi error:', error);
      toast({
        title: 'Conference Error',
        description: 'An error occurred in the video conference',
        variant: 'destructive',
      });
    };

    // Add event listeners
    jitsiInstance.addEventListener('videoConferenceJoined', handleVideoConferenceJoined);
    jitsiInstance.addEventListener('videoConferenceLeft', handleVideoConferenceLeft);
    jitsiInstance.addEventListener('readyToClose', handleReadyToClose);
    jitsiInstance.addEventListener('participantJoined', handleParticipantJoined);
    jitsiInstance.addEventListener('participantLeft', handleParticipantLeft);
    jitsiInstance.addEventListener('error', handleError);

    // Cleanup function
    return () => {
      jitsiInstance.removeEventListener('videoConferenceJoined', handleVideoConferenceJoined);
      jitsiInstance.removeEventListener('videoConferenceLeft', handleVideoConferenceLeft);
      jitsiInstance.removeEventListener('readyToClose', handleReadyToClose);
      jitsiInstance.removeEventListener('participantJoined', handleParticipantJoined);
      jitsiInstance.removeEventListener('participantLeft', handleParticipantLeft);
      jitsiInstance.removeEventListener('error', handleError);
    };
  }, [onClose]);

  // Initialize Jitsi when script is loaded and room info is available
  useEffect(() => {
    if (!scriptLoaded || !roomInfo || !jitsiContainerRef.current) {
      console.log('Waiting for requirements:', { scriptLoaded, hasRoomInfo: !!roomInfo, hasContainer: !!jitsiContainerRef.current });
      return;
    }
    
    console.log('Initializing Jitsi with room:', roomInfo.roomName);

    const container = jitsiContainerRef.current;
    let jitsiInstance: JitsiMeetAPI | null = null;
    const isHost = roomInfo.isHost || false;

    try {
      const userDisplayName = user?.name || displayName;
      const isHost = roomInfo.isHost || false;
      
      const options: JitsiMeetAPIOptions = {
        roomName: roomInfo.roomName,
        parentNode: container,
        width: '100%',
        height: '100%',
        userInfo: {
          displayName: userDisplayName,
          email: user?.email || `${userDisplayName.replace(/\s+/g, '.').toLowerCase()}@tutorhub.xyz`
        },
        configOverwrite: {
          startWithAudioMuted: !isHost,
          startWithVideoMuted: !isHost,
          defaultLanguage: 'en',
          prejoinPageEnabled: false,
          disableDeepLinking: true,
          enableWelcomePage: false,
          enableClosePage: false,
          enableNoAudioDetection: true,
          enableNoisyMicDetection: true,
          disableTileView: false,
          toolbarButtons: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'info', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'shareaudio', 'tileview',
            'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
            'tileview'
          ],
          toolbarConfig: {
            alwaysVisible: false,
            timeout: 4000
          },
          disableRemoteMute: true,
          enableInsecureRoomNameWarning: true,
          enableInsecureRoomWarning: true,
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_BRAND_WATERMARK: false,
          SHOW_POWERED_BY: false,
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          DISABLE_VIDEO_BACKGROUND: false,
          DEFAULT_BACKGROUND: '#000000',
          INITIAL_TOOLBAR_TIMEOUT: 20000,
          TOOLBAR_ALWAYS_VISIBLE: false,
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'info', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'shareaudio', 'tileview',
            'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
            'tileview'
          ]
        },
        onload: () => {
          console.log('Jitsi Meet API loaded');
        }
      };

      console.log('Creating Jitsi instance with options:', {
        roomName: options.roomName,
        userInfo: options.userInfo,
        isHost,
        container: !!container
      });

      jitsiInstance = new window.JitsiMeetExternalAPI('meet.jit.si', options);
      setJitsi(jitsiInstance);
      
      // Set up event handlers
      const cleanup = setupEventHandlers(jitsiInstance);
      
      // Set initial state
      try {
        jitsiInstance.executeCommand('displayName', userDisplayName);
        jitsiInstance.executeCommand('toggleAudio', isHost);
        jitsiInstance.executeCommand('toggleVideo', isHost);
        console.log('Jitsi commands executed successfully');
      } catch (err) {
        console.error('Error setting initial Jitsi state:', err);
      }

      return () => {
        console.log('Cleaning up Jitsi instance');
        if (cleanup) cleanup();
        if (jitsiInstance) {
          jitsiInstance.dispose();
          setJitsi(null);
        }
      };
    } catch (err) {
      console.error('Failed to initialize Jitsi:', err);
      toast({
        title: 'Failed to start video call',
        description: err instanceof Error ? err.message : 'Could not initialize the video conference',
        variant: 'destructive',
      });
      onClose();
    }
  }, [scriptLoaded, roomInfo, user, displayName, setupEventHandlers, onClose]);

  // Load Jitsi script
  useEffect(() => {
    if (typeof window.JitsiMeetExternalAPI !== 'undefined') {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.async = true;
    script.onload = () => {
      console.log('Jitsi script loaded successfully');
      setScriptLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load Jitsi script');
      setError('Failed to load video conferencing service');
    };

    document.body.appendChild(script);

    return () => {
      if (jitsi) {
        jitsi.dispose();
        setJitsi(null);
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [jitsi]);

  if (isLoading || !scriptLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {!scriptLoaded ? 'Loading video service...' : 'Loading session...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Session</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!roomInfo) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600">Session not found</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full" ref={jitsiContainerRef} />
  );
};

export default JitsiMeet;