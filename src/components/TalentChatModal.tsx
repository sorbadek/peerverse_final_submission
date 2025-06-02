
import React, { useState } from 'react';
import { Send, X, Phone, Video, Star, Clock, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';

interface TalentChatModalProps {
  talent: any;
  isOpen: boolean;
  onClose: () => void;
}

const TalentChatModal = ({ talent, isOpen, onClose }: TalentChatModalProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'talent',
      text: `Hi! I'm ${talent?.name}. Thanks for reaching out! How can I help you with your project?`,
      timestamp: '2 min ago',
    }
  ]);

  const sendMessage = () => {
    if (message.trim()) {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: 'user',
        text: message,
        timestamp: 'now'
      }]);
      setMessage('');
      
      // Simulate talent response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          sender: 'talent',
          text: "That sounds interesting! I'd be happy to discuss your project in more detail. When would be a good time for a quick call?",
          timestamp: 'now'
        }]);
      }, 1500);
    }
  };

  const getVerificationIcon = (level: string) => {
    return level === 'expert' ? 
      <Shield className="w-4 h-4 text-yellow-500" /> : 
      <Shield className="w-4 h-4 text-blue-500" />;
  };

  if (!isOpen || !talent) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={talent.avatar} />
              <AvatarFallback>{talent.name?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-white font-semibold">{talent.name}</h3>
                {getVerificationIcon(talent.verificationLevel)}
              </div>
              <p className="text-gray-400 text-sm">{talent.title}</p>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span>{talent.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{talent.responseTime}</span>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  talent.availability === 'Available' ? 'bg-green-500' : 'bg-orange-500'
                }`} />
                <span>{talent.availability}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="border-gray-600">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="border-gray-600">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Skills */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex flex-wrap gap-1">
            {talent.skills?.slice(0, 4).map((skill: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {talent.skills?.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{talent.skills.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              className="bg-gray-800 border-gray-600 text-white"
            />
            <Button onClick={sendMessage} className="bg-blue-600 hover:bg-blue-700">
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <span>Response time: {talent.responseTime}</span>
            <span>${talent.hourlyRate}/hour</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentChatModal;
