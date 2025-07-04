import React, { useState, useMemo } from 'react';
import { Video, Users, Plus, Clock, Star, TrendingUp, Award } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import OngoingSessionCard from './OngoingSessionCard';
import HostSessionDialog from './HostSessionDialog';
import XPContributionTracker from './XPContributionTracker';
import CertificateNotification from './CertificateNotification';
import { useCertificates } from '../hooks/useCertificates';
import { useToast } from './ui/use-toast';
import { useSession } from '@/hooks/useSession';
import { useSuiSessions } from '@/hooks/useSuiSessions';
import { OngoingSession as SessionType } from '@/types/session';

interface OngoingSession extends SessionType {
  host: string;
  isLive: boolean;
}

const TutorHubContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showHostDialog, setShowHostDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCertificateNotification, setShowCertificateNotification] = useState(false);
  const [newCertificate, setNewCertificate] = useState(null);
  
  const { issueCertificate } = useCertificates();
  const { toast } = useToast();
  const { activeSessions, removeActiveSession } = useSession();
  const { sessions: blockchainSessions, isLoading } = useSuiSessions();

  // Define the expected session type from the blockchain
  interface BlockchainSession {
    id: string;
    owner: string;
    title: string;
    description: string;
    category: string;
    duration: string;
    room_name: string;
    created_at: string;
  }

  // Convert blockchain sessions to the expected format
  const formattedBlockchainSessions = useMemo(() => 
    (blockchainSessions as BlockchainSession[] || []).map((session) => ({
      id: `sui_${session.id}`,
      title: session.title,
      description: session.description,
      category: session.category,
      duration: session.duration,
      host: session.owner,
      hostName: session.owner,
      participants: 0, // Will be updated when users join
      roomName: session.room_name,
      startTime: session.created_at,
      isLive: true,
      isHost: session.owner === activeSessions.find(s => s.roomName === session.room_name)?.hostName
    })),
    [blockchainSessions, activeSessions]
  );

  // Convert activeSessions to the expected format
  const ongoingSessions: OngoingSession[] = useMemo(() => 
    activeSessions.map((session) => ({
      ...session,
      host: session.hostName, // Add host as an alias for hostName
      isLive: true, // Add isLive flag
      // Ensure all required properties from OngoingSession are included
      id: session.id,
      roomName: session.roomName,
      title: session.title,
      hostName: session.hostName,
      participants: session.participants,
      category: session.category,
      duration: session.duration,
      description: session.description,
      startTime: session.startTime,
      isHost: session.isHost || false
    })),
    [activeSessions]
  );

  // Combine active sessions with blockchain sessions, removing duplicates
  const displaySessions = useMemo(() => {
    const activeRoomNames = new Set(activeSessions.map(s => s.roomName));
    const uniqueBlockchainSessions = formattedBlockchainSessions.filter(
      session => !activeRoomNames.has(session.roomName)
    );
    return [...ongoingSessions, ...uniqueBlockchainSessions];
  }, [ongoingSessions, formattedBlockchainSessions, activeSessions]);

  const handleSessionCompletion = (session: OngoingSession) => {
    // If it's an active session, remove it
    if (activeSessions.some(s => s.id === session.id)) {
      removeActiveSession(session.id);
    }
    // Calculate XP based on session duration and type
    const durationMinutes = parseInt(session.duration);
    const xpEarned = Math.max(50, Math.floor(durationMinutes * 2)); // Base 2 XP per minute, minimum 50

    // Issue certificate for completed session
    const certificate = issueCertificate({
      title: `${session.title} - Session Completion`,
      type: 'session',
      issuer: 'PeerVerse Community',
      sessionDuration: session.duration,
      xpEarned
    });

    setNewCertificate(certificate);
    setShowCertificateNotification(true);

    toast({
      title: "Session Completed!",
      description: `You've earned a certificate for "${session.title}" and gained ${xpEarned} XP!`,
    });

    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setShowCertificateNotification(false);
    }, 5000);
  };

  const categories = ['all', 'Frontend', 'Backend', 'Design', 'Computer Science', 'Mobile'];

  const filteredSessions = displaySessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       session.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || session.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Certificate Notification */}
      {showCertificateNotification && newCertificate && (
        <CertificateNotification
          certificate={newCertificate}
          onClose={() => setShowCertificateNotification(false)}
        />
      )}

      {/* Header Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Tutor Hub</h1>
            <p className="text-gray-400 mt-2">Decentralized P2P Learning Platform</p>
          </div>
          <Button 
            onClick={() => setShowHostDialog(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 w-full lg:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Host a Session
          </Button>
        </div>

        {/* XP Contribution Tracker */}
        <XPContributionTracker />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 bg-gray-900 p-4 rounded-lg">
        <div className="relative flex-1">
          <Input
            placeholder="Search ongoing sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap ${
                selectedCategory === category 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category === 'all' ? 'All Categories' : category}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="ongoing" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-900">
          <TabsTrigger value="ongoing" className="text-white data-[state=active]:bg-blue-600">
            <Video className="mr-2 h-4 w-4" />
            Live Sessions ({filteredSessions.length})
          </TabsTrigger>
          <TabsTrigger value="schedule" className="text-white data-[state=active]:bg-blue-600">
            <Clock className="mr-2 h-4 w-4" />
            Scheduled
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="text-white data-[state=active]:bg-blue-600">
            <Award className="mr-2 h-4 w-4" />
            Leaderboard
          </TabsTrigger>
        </TabsList>
        
        <div className="flex flex-col space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading sessions from blockchain...</p>
          </div>
        ) : filteredSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session, index) => (
              <OngoingSessionCard
                key={`${session.id}-${index}-${Date.now()}`}
                session={session}
                onComplete={() => handleSessionCompletion(session)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Video className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-200">No sessions found</h3>
            <p className="mt-1 text-sm text-gray-400">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Be the first to start a session!'}
            </p>
            <div className="mt-6">
              <Button
                onClick={() => setShowHostDialog(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                Host a Session
              </Button>
            </div>
          </div>
        )}
      </div>
        
        <TabsContent value="schedule" className="mt-6">
          <div className="text-center py-12">
            <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-400 text-lg">Scheduled sessions will appear here</p>
            <p className="text-gray-500 mt-2">Schedule a session to help the community learn!</p>
          </div>
        </TabsContent>
        
        <TabsContent value="leaderboard" className="mt-6">
          <div className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Top Contributors This Month
            </h3>
            <div className="space-y-3">
              {[
                { rank: 1, name: 'Sarah Chen', xp: 2450, sessions: 15 },
                { rank: 2, name: 'Mike Rodriguez', xp: 2180, sessions: 12 },
                { rank: 3, name: 'Emma Johnson', xp: 1950, sessions: 11 },
                { rank: 4, name: 'David Park', xp: 1720, sessions: 9 },
                { rank: 5, name: 'Lisa Wang', xp: 1590, sessions: 8 }
              ].map(contributor => (
                <div key={contributor.rank} className="flex items-center justify-between bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      contributor.rank === 1 ? 'bg-yellow-500 text-black' :
                      contributor.rank === 2 ? 'bg-gray-400 text-black' :
                      contributor.rank === 3 ? 'bg-amber-600 text-white' :
                      'bg-gray-600 text-white'
                    }`}>
                      {contributor.rank}
                    </div>
                    <div>
                      <p className="text-white font-medium">{contributor.name}</p>
                      <p className="text-gray-400 text-sm">{contributor.sessions} sessions hosted</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{contributor.xp} XP</p>
                    <div className="flex items-center text-yellow-400 text-sm">
                      <Star className="h-3 w-3 mr-1" />
                      <span>Top Contributor</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Host Session Dialog */}
      <HostSessionDialog 
        open={showHostDialog} 
        onOpenChange={setShowHostDialog}
      />
    </div>
  );
};

export default TutorHubContent;
