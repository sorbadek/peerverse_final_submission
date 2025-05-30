
import React, { useEffect, useRef } from 'react';

interface JitsiMeetProps {
  roomName: string;
  displayName: string;
  onClose: () => void;
  isHost?: boolean;
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

const JitsiMeet = ({ roomName, displayName, onClose, isHost = false }: JitsiMeetProps) => {
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);

  useEffect(() => {
    // Load Jitsi Meet API script if not already loaded
    if (!window.JitsiMeetExternalAPI) {
      const script = document.createElement('script');
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      script.onload = initializeJitsi;
      document.head.appendChild(script);
    } else {
      initializeJitsi();
    }

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
      }
    };
  }, []);

  const initializeJitsi = () => {
    if (jitsiContainerRef.current && window.JitsiMeetExternalAPI) {
      const domain = 'meet.jit.si';
      const options = {
        roomName: roomName,
        width: '100%',
        height: '100%',
        parentNode: jitsiContainerRef.current,
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
        userInfo: {
          displayName: displayName,
        }
      };

      apiRef.current = new window.JitsiMeetExternalAPI(domain, options);

      // Event listeners
      apiRef.current.addEventListener('videoConferenceJoined', () => {
        console.log('User joined the conference');
      });

      apiRef.current.addEventListener('videoConferenceLeft', () => {
        console.log('User left the conference');
        onClose();
      });

      apiRef.current.addEventListener('readyToClose', () => {
        onClose();
      });

      // If host, give moderator privileges
      if (isHost) {
        apiRef.current.addEventListener('participantJoined', (participant: any) => {
          console.log('Participant joined:', participant);
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="bg-gray-900 p-4 flex items-center justify-between">
        <h2 className="text-white text-lg font-semibold">
          Live Session: {roomName}
        </h2>
        <button
          onClick={onClose}
          className="text-white hover:text-red-400 px-4 py-2 bg-red-600 rounded"
        >
          Leave Session
        </button>
      </div>
      <div ref={jitsiContainerRef} className="flex-1" />
    </div>
  );
};

export default JitsiMeet;
