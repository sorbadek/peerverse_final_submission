
import React from 'react';
import { Home, BookOpen, Users, MessageSquare, BarChart, Download, Settings, Trash2, LogOut } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: BookOpen, label: 'Learn' },
    { icon: Users, label: 'Tutor Hub' },
    { icon: MessageSquare, label: 'Community' },
    { icon: BarChart, label: 'Grades' },
    { icon: Download, label: 'Downloads' },
    { icon: Settings, label: 'Settings' },
    { icon: Trash2, label: 'Trash' },
    { icon: LogOut, label: 'Log Out' },
  ];

  return (
    <div className={`fixed left-0 top-0 bg-white h-screen transition-all duration-300 z-40 ${isOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">🌐</span>
          </div>
          <span className="text-xl font-bold text-gray-800">PeerVerse</span>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                item.active 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
