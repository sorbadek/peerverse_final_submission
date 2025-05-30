
import React, { useState } from 'react';
import { Bell, Sun, Menu, ChevronDown } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="bg-black border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onMenuClick}
          className="text-white p-2 hover:bg-gray-800 rounded-lg"
        >
          <Menu size={20} />
        </button>
        
        <div className="flex items-center space-x-4">
          <button className="text-white p-2 hover:bg-gray-800 rounded-lg">
            <Sun size={20} />
          </button>
          
          <div className="relative">
            <button className="text-white p-2 hover:bg-gray-800 rounded-lg relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                1
              </span>
            </button>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-2 text-white hover:bg-gray-800 rounded-lg p-2"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
              <span className="text-sm">Sandro Williams</span>
              <ChevronDown size={16} />
            </button>
            
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-50">
                <div className="p-2">
                  <a href="#" className="block px-4 py-2 text-white hover:bg-gray-700 rounded">Profile</a>
                  <a href="#" className="block px-4 py-2 text-white hover:bg-gray-700 rounded">Logout</a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
