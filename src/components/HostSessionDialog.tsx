
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Video, Users, Clock } from 'lucide-react';
import { useSession } from './SessionManager';
import { toast } from '@/hooks/use-toast';

interface HostSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HostSessionDialog = ({ open, onOpenChange }: HostSessionDialogProps) => {
  const { startSession } = useSession();
  const [sessionData, setSessionData] = useState({
    title: '',
    description: '',
    category: '',
    duration: '',
    maxParticipants: ''
  });

  const categories = ['Frontend', 'Backend', 'Design', 'Computer Science', 'Mobile', 'DevOps'];
  const durations = ['30 min', '45 min', '60 min', '90 min', '120 min'];

  const generateRoomName = (title: string) => {
    // Create a unique room name based on title and timestamp
    const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '');
    const timestamp = Date.now();
    return `tutorHub_${sanitizedTitle}_${timestamp}`;
  };

  const handleCreateSession = () => {
    if (!isFormValid) return;

    const roomName = generateRoomName(sessionData.title);
    
    // Create session object
    const session = {
      id: `session_${Date.now()}`,
      roomName: roomName,
      title: sessionData.title,
      isHost: true
    };

    // Save session data to localStorage for persistence
    const sessionInfo = {
      ...sessionData,
      roomName,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    
    localStorage.setItem(`session_${session.id}`, JSON.stringify(sessionInfo));

    // Start the Jitsi session
    startSession(session);
    
    // Show success toast
    toast({
      title: "Session Started!",
      description: `Your live session "${sessionData.title}" is now active.`,
    });

    // Close dialog and reset form
    onOpenChange(false);
    setSessionData({
      title: '',
      description: '',
      category: '',
      duration: '',
      maxParticipants: ''
    });
  };

  const isFormValid = sessionData.title && sessionData.description && sessionData.category && sessionData.duration;

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
              <Select value={sessionData.category} onValueChange={(value) => setSessionData({ ...sessionData, category: value })}>
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
              <Select value={sessionData.duration} onValueChange={(value) => setSessionData({ ...sessionData, duration: value })}>
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

          <div>
            <Label htmlFor="maxParticipants" className="text-gray-300 flex items-center">
              <Users className="mr-1 h-4 w-4" />
              Max Participants
            </Label>
            <Input
              id="maxParticipants"
              type="number"
              placeholder="20"
              value={sessionData.maxParticipants}
              onChange={(e) => setSessionData({ ...sessionData, maxParticipants: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white mt-1"
            />
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
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateSession}
            disabled={!isFormValid}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            Start Live Session
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HostSessionDialog;
