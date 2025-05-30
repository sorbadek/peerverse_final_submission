
import React from 'react';
import { MessageCircle, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const NotificationPanel = () => {
  const notifications = [
    {
      icon: MessageCircle,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-100',
      title: 'clients comments on your posts about Algorithm tasks',
      time: 'Yesterday',
      type: 'comment'
    },
    {
      icon: CheckCircle,
      iconColor: 'text-green-500',
      iconBg: 'bg-green-100',
      title: 'Well done! You have submitted your tasks of Javascript 1',
      time: 'Yesterday',
      type: 'success'
    },
    {
      icon: Clock,
      iconColor: 'text-red-500', 
      iconBg: 'bg-red-100',
      title: 'Your task is overdue for 13 hours and 39 minutes',
      time: '30 June 2024',
      type: 'urgent'
    },
    {
      icon: AlertCircle,
      iconColor: 'text-orange-500',
      iconBg: 'bg-orange-100', 
      title: 'Mr. Dike add new quiz and some task on PHP course.',
      time: '25 May 2024',
      type: 'info'
    }
  ];

  const avatars = [
    'bg-gradient-to-r from-red-400 to-pink-400',
    'bg-gradient-to-r from-blue-400 to-purple-400', 
    'bg-gradient-to-r from-green-400 to-teal-400',
    'bg-gradient-to-r from-yellow-400 to-orange-400',
    'bg-gradient-to-r from-purple-400 to-indigo-400',
    'bg-gradient-to-r from-pink-400 to-rose-400',
    'bg-gradient-to-r from-indigo-400 to-blue-400',
    'bg-gradient-to-r from-teal-400 to-cyan-400'
  ];

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <div className="bg-white rounded-2xl p-6">
        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <div key={index} className="flex space-x-3">
              <div className={`w-10 h-10 ${notification.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                <notification.icon size={18} className={notification.iconColor} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 mb-1">{notification.title}</p>
                <p className="text-xs text-gray-500">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Avatars */}
      <div className="bg-gradient-to-b from-purple-900 to-blue-900 rounded-2xl p-6">
        <div className="space-y-4">
          {avatars.map((gradient, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`w-12 h-12 ${gradient} rounded-full border-2 border-white/20`}></div>
              {index === 0 && (
                <div className="w-8 h-8 bg-yellow-400 rounded-full border-2 border-white/20"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
