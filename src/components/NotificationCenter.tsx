
import React, { useState } from 'react';
import { Bell, Settings, Filter, MoreHorizontal, MessageCircle, CheckCircle, Clock, AlertCircle, Users, X, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface Notification {
  id: string;
  type: 'message' | 'system' | 'collaboration' | 'achievement';
  category: 'comment' | 'success' | 'urgent' | 'info' | 'invitation' | 'reminder';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  avatar?: string;
  author?: string;
  actionable?: boolean;
  action?: {
    label: string;
    type: 'accept' | 'view' | 'join' | 'dismiss';
  };
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'collaboration',
      category: 'invitation',
      title: 'Study Group Invitation',
      message: 'Sarah invited you to join "Advanced React Patterns" study group',
      time: '5 min ago',
      isRead: false,
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=3b82f6&color=fff',
      author: 'Sarah Johnson',
      actionable: true,
      action: { label: 'Join Group', type: 'accept' }
    },
    {
      id: '2',
      type: 'message',
      category: 'comment',
      title: 'New Message',
      message: 'Alex Chen responded to your material upload request',
      time: '12 min ago',
      isRead: false,
      avatar: 'https://ui-avatars.com/api/?name=Alex+Chen&background=10b981&color=fff',
      author: 'Alex Chen',
      actionable: true,
      action: { label: 'View Message', type: 'view' }
    },
    {
      id: '3',
      type: 'system',
      category: 'success',
      title: 'Material Approved',
      message: 'Your "JavaScript Fundamentals" material has been approved and is now live',
      time: '1 hour ago',
      isRead: false,
      actionable: true,
      action: { label: 'View Material', type: 'view' }
    },
    {
      id: '4',
      type: 'collaboration',
      category: 'urgent',
      title: 'Session Starting Soon',
      message: 'Your tutoring session with Emma starts in 15 minutes',
      time: '2 hours ago',
      isRead: false,
      avatar: 'https://ui-avatars.com/api/?name=Emma+Wilson&background=f59e0b&color=fff',
      author: 'Emma Wilson',
      actionable: true,
      action: { label: 'Join Session', type: 'join' }
    },
    {
      id: '5',
      type: 'achievement',
      category: 'success',
      title: 'XP Milestone Reached',
      message: 'Congratulations! You\'ve earned 1000 XP and unlocked "Knowledge Contributor" badge',
      time: '1 day ago',
      isRead: true,
      actionable: true,
      action: { label: 'View Profile', type: 'view' }
    },
    {
      id: '6',
      type: 'system',
      category: 'reminder',
      title: 'Assignment Due Soon',
      message: 'Your Machine Learning assignment is due in 2 days',
      time: '2 days ago',
      isRead: true,
      actionable: true,
      action: { label: 'View Assignment', type: 'view' }
    }
  ]);

  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getIcon = (category: string) => {
    switch (category) {
      case 'comment':
        return MessageCircle;
      case 'success':
        return CheckCircle;
      case 'urgent':
        return Clock;
      case 'info':
      case 'reminder':
        return AlertCircle;
      case 'invitation':
        return Users;
      default:
        return AlertCircle;
    }
  };

  const getIconColors = (category: string, type: string) => {
    if (type === 'achievement') return 'text-yellow-400 bg-yellow-400/10';
    
    switch (category) {
      case 'comment':
        return 'text-blue-400 bg-blue-400/10';
      case 'success':
        return 'text-green-400 bg-green-400/10';
      case 'urgent':
        return 'text-red-400 bg-red-400/10';
      case 'invitation':
        return 'text-purple-400 bg-purple-400/10';
      case 'info':
      case 'reminder':
        return 'text-orange-400 bg-orange-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'message':
        return 'bg-blue-500';
      case 'collaboration':
        return 'bg-purple-500';
      case 'achievement':
        return 'bg-yellow-500';
      case 'system':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const handleAction = (notification: Notification) => {
    console.log(`Handling action: ${notification.action?.type} for notification: ${notification.id}`);
    markAsRead(notification.id);
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesFilter = filterType === 'all' || notif.type === filterType;
    const matchesSearch = searchTerm === '' || 
      notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bell className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Notification Center</h1>
            <p className="text-gray-400">Stay updated with your learning journey</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <Badge className={`${getBadgeColor('system')} text-white`}>
              {unreadCount} unread
            </Badge>
          )}
          <Button variant="outline" size="sm" className="border-gray-600">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search notifications..."
                className="pl-10 bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="flex space-x-2">
              {['all', 'message', 'system', 'collaboration', 'achievement'].map((type) => (
                <Button
                  key={type}
                  variant={filterType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType(type)}
                  className={filterType === type ? "bg-blue-600" : "border-gray-600"}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {unreadCount > 0 && (
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">Quick Actions</span>
              <Button
                onClick={markAllAsRead}
                variant="outline"
                size="sm"
                className="border-gray-600"
              >
                Mark all as read
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-8 text-center">
              <Bell size={32} className="mx-auto text-gray-600 mb-2" />
              <p className="text-gray-400">No notifications found</p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => {
            const Icon = getIcon(notification.category);
            const iconColors = getIconColors(notification.category, notification.type);
            
            return (
              <Card
                key={notification.id}
                className={`bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors cursor-pointer ${
                  !notification.isRead ? 'ring-1 ring-blue-500/20' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex space-x-4">
                    <div className="flex-shrink-0">
                      {notification.avatar ? (
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={notification.avatar} alt={notification.author} />
                          <AvatarFallback>{notification.author?.charAt(0)}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconColors}`}>
                          <Icon size={20} />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-white font-medium">{notification.title}</h3>
                            <Badge className={`${getBadgeColor(notification.type)} text-white text-xs`}>
                              {notification.type}
                            </Badge>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-gray-300 text-sm mb-2">{notification.message}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500 text-xs">{notification.time}</span>
                            {notification.actionable && notification.action && (
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAction(notification);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-xs"
                              >
                                {notification.action.label}
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                        >
                          <X size={14} className="text-gray-400 hover:text-white" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
