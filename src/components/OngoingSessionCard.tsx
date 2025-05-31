
import React from 'react';
import { Users, Clock, Star, Play } from 'lucide-react';
import { Button } from './ui/button';
import { useSession } from './SessionManager';
import { toast } from '@/hooks/use-toast';

interface OngoingSession {
  id: string;
  title: string;
  host: string;
  participants: number;
  category: string;
  duration: string;
  isLive: boolean;
  description: string;
}

interface OngoingSessionCardProps {
  session: OngoingSession;
}

const OngoingSessionCard = ({ session }: OngoingSessionCardProps) => {
  const { startSession } = useSession();

  const generateRoomName = (sessionId: string) => {
    // Generate consistent room name for the session
    return `tutorHub_session_${sessionId}`;
  };

  const handleJoinSession = () => {
    const roomName = generateRoomName(session.id);
    
    // Create session object for joining
    const joinSession = {
      id: session.id,
      roomName: roomName,
      title: session.title,
      isHost: false
    };

    // Start the Jitsi session as participant
    startSession(joinSession);
    
    // Show joining toast
    toast({
      title: "Joining Session",
      description: `Joining "${session.title}" hosted by ${session.host}`,
    });

    console.log(`Joining session: ${session.id} in room: ${roomName}`);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-400 text-xs font-medium uppercase tracking-wide">LIVE</span>
            <span className="text-gray-500 text-xs">•</span>
            <span className="text-gray-400 text-xs">{session.category}</span>
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">{session.title}</h3>
          <p className="text-gray-400 text-sm mb-3">{session.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{session.participants}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{session.duration}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">
              {session.host.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <p className="text-white text-sm font-medium">{session.host}</p>
            <div className="flex items-center text-yellow-400 text-xs">
              <Star className="h-3 w-3 mr-1" />
              <span>4.8 rating</span>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleJoinSession}
          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
        >
          <Play className="mr-2 h-4 w-4" />
          Join Session
        </Button>
      </div>
    </div>
  );
};

export default OngoingSessionCard;
