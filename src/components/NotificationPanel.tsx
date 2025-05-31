
import React from 'react';
import { MessageCircle, CheckCircle, Clock, AlertCircle, Users, TrendingUp } from 'lucide-react';

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

  const frequentLearningPartners = [
    {
      name: 'Sarah Chen',
      avatar: 'bg-gradient-to-r from-blue-400 to-purple-400',
      relationship: 'Learn from',
      subject: 'React & TypeScript',
      sessions: 12
    },
    {
      name: 'Mike Rodriguez',
      avatar: 'bg-gradient-to-r from-green-400 to-teal-400',
      relationship: 'Teaches you',
      subject: 'Data Structures',
      sessions: 8
    },
    {
      name: 'Emma Johnson',
      avatar: 'bg-gradient-to-r from-purple-400 to-pink-400',
      relationship: 'Study buddy',
      subject: 'UI/UX Design',
      sessions: 15
    },
    {
      name: 'David Park',
      avatar: 'bg-gradient-to-r from-yellow-400 to-orange-400',
      relationship: 'Learn from',
      subject: 'Node.js APIs',
      sessions: 6
    },
    {
      name: 'Lisa Wang',
      avatar: 'bg-gradient-to-r from-red-400 to-pink-400',
      relationship: 'Mutual learning',
      subject: 'Machine Learning',
      sessions: 9
    }
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

      {/* Frequent Learning Partners */}
      <div className="bg-gradient-to-b from-purple-900 to-blue-900 rounded-2xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="w-5 h-5 text-white" />
          <h3 className="text-white font-semibold">Frequent Learning Partners</h3>
        </div>
        <div className="space-y-3">
          {frequentLearningPartners.map((partner, index) => (
            <div key={index} className="flex items-center justify-between bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${partner.avatar} rounded-full border-2 border-white/20 flex items-center justify-center`}>
                  <span className="text-white text-xs font-bold">
                    {partner.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{partner.name}</p>
                  <p className="text-white/70 text-xs">{partner.relationship}</p>
                  <p className="text-white/60 text-xs">{partner.subject}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-yellow-400 text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>{partner.sessions}</span>
                </div>
                <p className="text-white/60 text-xs">sessions</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
