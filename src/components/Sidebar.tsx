
import React from 'react';
import { Home, BookOpen, Users, MessageSquare, BarChart, Download, Settings, Trash2, LogOut, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: BookOpen, label: 'Learn', path: '/learn' },
    { icon: Users, label: 'Tutor Hub', path: '/tutor-hub' },
    { icon: MessageSquare, label: 'Community', path: '/community' },
    { icon: BarChart, label: 'Grades', path: '/grades' },
    { icon: Download, label: 'Downloads', path: '/downloads' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: Trash2, label: 'Trash', path: '/trash' },
    { icon: LogOut, label: 'Log Out', path: '/logout' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

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
            <button
              key={index}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors w-full text-left ${
                location.pathname === item.path
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
