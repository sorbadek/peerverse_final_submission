
import React from 'react';
import { Home, BookOpen, Users, MessageSquare, BarChart, Download, Settings, Trash2, LogOut, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
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
    <div className={`fixed left-0 top-0 bg-gray-900 h-screen transition-all duration-300 z-40 ${isOpen ? 'w-64' : 'w-0 lg:w-64'} overflow-hidden lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <img 
            src="/lovable-uploads/f60d0cca-0f77-48f5-8700-a54fdfd0c187.png" 
            alt="PeerVerse Logo" 
            className="h-8 w-auto"
          />
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white p-1"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                item.active 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
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
