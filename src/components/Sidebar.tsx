
import React from 'react';
import { Home, BookOpen, Users, MessageSquare, ShoppingBag, Vault, User, Settings, LogOut, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const mainMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: BookOpen, label: 'Learn', path: '/learn' },
    { icon: Users, label: 'Tutor Hub', path: '/tutor-hub' },
    { icon: MessageSquare, label: 'Community', path: '/community' },
    { icon: ShoppingBag, label: 'Marketplace', path: '/marketplace' },
    { icon: Vault, label: 'Vault', path: '/vault' },
    { icon: User, label: 'Public Profile', path: '/public-profile' },
  ];

  const bottomMenuItems = [
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: LogOut, label: 'Log Out', path: '/logout' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className={`fixed left-0 top-0 bg-gray-900 h-screen transition-all duration-300 z-40 ${isOpen ? 'w-64' : 'w-0 lg:w-64'} overflow-hidden lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <img 
            src="/lovable-uploads/fbcd878a-13d9-4472-bbad-e95c8dddd985.png" 
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
        
        <nav className="space-y-2 flex-1">
          {mainMenuItems.map((item, index) => (
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

        <div className="space-y-2 mt-auto">
          {bottomMenuItems.map((item, index) => (
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
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
