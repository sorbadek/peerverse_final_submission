import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import type { OngoingSession } from '../types/session';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Video, Users, Clock, Loader2 } from 'lucide-react';
import { useSession } from '@/hooks/useSession';
import { useSuiSessions, type SessionData } from '@/hooks/useSuiSessions';
import { toast } from '@/hooks/use-toast';
import { useZkLogin } from '@/contexts/ZkLoginContext';

interface HostSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HostSessionDialog = ({ open, onOpenChange }: HostSessionDialogProps) => {
  const { startSession, addActiveSession } = useSession();
  const navigate = useNavigate();
  const { createSession, wallet, isConnected, walletAddress, isLoading: isSessionLoading } = useSuiSessions();
  const { currentAddress, isAuthenticated, isLoading: isZkLoginLoading } = useZkLogin();
  const [isInitializing, setIsInitializing] = React.useState(true);
  
  // Check if we're still initializing the wallet connection
  React.useEffect(() => {
    if (!isSessionLoading && !isZkLoginLoading) {
      setIsInitializing(false);
    }
  }, [isSessionLoading, isZkLoginLoading]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionData, setSessionData] = useState<Omit<SessionData, 'roomName' | 'createdAt'>>({
    title: '',
    description: '',
    category: '',
    duration: '',
  });

  const categories = ['Frontend', 'Backend', 'Design', 'Computer Science', 'Mobile', 'DevOps'];
  const durations = ['30 min', '45 min', '60 min', '90 min', '120 min'];

  const generateRoomName = (title: string) => {
    const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '');
    const timestamp = Date.now();
    return `tutorHub_${sanitizedTitle}_${timestamp}`;
  };

  const getWalletAddress = useCallback(() => {
    try {
      const walletConnectionInfo = localStorage.getItem('sui-dapp-kit:wallet-connection-info');
      if (walletConnectionInfo) {
        const { state } = JSON.parse(walletConnectionInfo);
        return state?.lastConnectedAccountAddress || null;
      }
    } catch (error) {
      console.error('Error getting wallet from localStorage:', error);
    }
    return null;
  }, []);

  const handleCreateSession = useCallback(async () => {
    const formIsValid = Boolean(
      sessionData.title && 
      sessionData.description && 
      sessionData.category && 
      sessionData.duration
    );
    
    if (!formIsValid || isSubmitting) return;
    
    // Check authentication (zkLogin or wallet)
    if (isInitializing) {
      toast({
        title: 'Initializing...',
        description: 'Please wait while we connect to your wallet.',
      });
      return;
    }
    
    if (!isConnected && !isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in with zkLogin or connect your wallet to create a session.',
        variant: 'destructive',
      });
      return;
    }

    const roomName = generateRoomName(sessionData.title);
    const createdAt = new Date().toISOString();
    
    setIsSubmitting(true);
    
    try {
      const address = walletAddress || currentAddress;
      if (!address) {
        throw new Error('No address found. Please sign in or connect your wallet first.');
      }

      const sessionDataForBlockchain = {
        ...sessionData,
        roomName,
        createdAt,
      };
      
      await createSession(sessionDataForBlockchain);

      const session = {
        id: `session_${Date.now()}`,
        roomName,
        title: sessionData.title,
        isHost: true,
        owner: currentAddress,
      };

      const sessionToStart: OngoingSession = {
        id: Date.now().toString(), // Generate a temporary ID
        title: sessionData.title,
        roomName,
        hostName: 'You',
        participants: 1,
        category: sessionData.category,
        duration: sessionData.duration,
        description: sessionData.description,
        startTime: createdAt,
        isHost: true
      };

      const ongoingSession = addActiveSession(sessionToStart);

      if (!ongoingSession) {
        throw new Error('Failed to create active session');
      }

      startSession(sessionToStart);
      
      toast({
        title: 'Session Started!',
        description: `Your live session "${sessionData.title}" is now active and stored on the blockchain.`,
      });
      
      // Navigate to the JitsiMeet component with the roomId
      navigate(`/session/${roomName}`);
      
      onOpenChange(false);
      setSessionData({
        title: '',
        description: '',
        category: '',
        duration: '',
      });
    } catch (error) {
      console.error('Failed to create session:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create session. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [sessionData, isSubmitting, currentAddress, onOpenChange, createSession, addActiveSession, startSession, isConnected, isAuthenticated, walletAddress, isInitializing, navigate]);

  const isFormValid = Boolean(
    sessionData.title && 
    sessionData.description && 
    sessionData.category && 
    sessionData.duration
  );
  
  const isLoading = isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Video className="mr-2 h-5 w-5" />
            Host a Learning Session
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Share your knowledge with the community through live sessions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="title" className="text-gray-300">Session Title</Label>
            <Input
              id="title"
              placeholder="e.g., React Hooks Masterclass"
              value={sessionData.title}
              onChange={(e) => setSessionData({ ...sessionData, title: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-gray-300">Description</Label>
            <Textarea
              id="description"
              placeholder="What will you be teaching in this session?"
              value={sessionData.description}
              onChange={(e) => setSessionData({ ...sessionData, description: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white mt-1 min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Category</Label>
              <Select 
                value={sessionData.category} 
                onValueChange={(value) => setSessionData({ ...sessionData, category: value })}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {categories.map(category => (
                    <SelectItem key={category} value={category} className="text-white hover:bg-gray-700">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-gray-300">Duration</Label>
              <Select 
                value={sessionData.duration} 
                onValueChange={(value) => setSessionData({ ...sessionData, duration: value })}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-1">
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {durations.map(duration => (
                    <SelectItem key={duration} value={duration} className="text-white hover:bg-gray-700">
                      {duration}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-3">
            <div className="flex items-center text-blue-300 text-sm mb-1">
              <Clock className="mr-2 h-4 w-4" />
              <span className="font-medium">Session Rewards</span>
            </div>
            <p className="text-blue-200 text-sm">
              XP and rewards will be automatically calculated by the system based on session quality and engagement.
            </p>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateSession} 
            disabled={!isFormValid || isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Start Session'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HostSessionDialog;
