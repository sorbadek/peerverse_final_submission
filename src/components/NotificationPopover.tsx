
import React, { useState } from 'react';
import { MessageCircle, CheckCircle, Clock, AlertCircle, X, MoreHorizontal, Bell } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

interface Notification {
  id: string;
  type: 'comment' | 'success' | 'urgent' | 'info';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  avatar?: string;
  author?: string;
}

const NotificationPopover = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'comment',
      title: 'New Comment',
      message: 'Sarah commented on your post about Algorithm tasks',
      time: '2 min ago',
      isRead: false,
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=3b82f6&color=fff',
      author: 'Sarah Johnson'
    },
    {
      id: '2',
      type: 'success',
      title: 'Task Completed',
      message: 'Well done! You have submitted your JavaScript 1 assignment',
      time: '1 hour ago',
      isRead: false
    },
    {
      id: '3',
      type: 'urgent',
      title: 'Overdue Task',
      message: 'Your Python assignment is overdue for 2 hours',
      time: '2 hours ago',
      isRead: false
    },
    {
      id: '4',
      type: 'info',
      title: 'New Course Material',
      message: 'Dr. Smith added new quiz and tasks to React course',
      time: 'Yesterday',
      isRead: true
    },
    {
      id: '5',
      type: 'comment',
      title: 'New Like',
      message: 'Alex liked your research paper on Machine Learning',
      time: '2 days ago',
      isRead: true,
      avatar: 'https://ui-avatars.com/api/?name=Alex+Chen&background=10b981&color=fff',
      author: 'Alex Chen'
    }
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return MessageCircle;
      case 'success':
        return CheckCircle;
      case 'urgent':
        return Clock;
      case 'info':
        return AlertCircle;
      default:
        return AlertCircle;
    }
  };

  const getIconColors = (type: string) => {
    switch (type) {
      case 'comment':
        return 'text-blue-400 bg-blue-400/10';
      case 'success':
        return 'text-green-400 bg-green-400/10';
      case 'urgent':
        return 'text-red-400 bg-red-400/10';
      case 'info':
        return 'text-orange-400 bg-orange-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
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

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="w-full max-h-96 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <h3 className="text-white font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={markAllAsRead}
            className="text-blue-400 hover:text-blue-300 text-xs"
          >
            Mark all read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell size={32} className="mx-auto text-gray-600 mb-2" />
            <p className="text-gray-400 text-sm">No notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {notifications.map((notification) => {
              const Icon = getIcon(notification.type);
              const iconColors = getIconColors(notification.type);
              
              return (
                <div 
                  key={notification.id}
                  className={`p-4 hover:bg-gray-800/50 transition-colors cursor-pointer group ${
                    !notification.isRead ? 'bg-gray-800/30' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex space-x-3">
                    <div className="flex-shrink-0">
                      {notification.avatar ? (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={notification.avatar} alt={notification.author} />
                          <AvatarFallback>{notification.author?.charAt(0)}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconColors}`}>
                          <Icon size={16} />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium mb-1">
                            {notification.title}
                          </p>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            {notification.time}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-2">
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                          >
                            <X size={12} className="text-gray-400 hover:text-white" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <Button 
          variant="ghost" 
          className="w-full text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
          size="sm"
        >
          View all notifications
        </Button>
      </div>
    </div>
  );
};

export default NotificationPopover;
