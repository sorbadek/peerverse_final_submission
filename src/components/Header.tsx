
import React from 'react';
import { Bell, Sun, Menu } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import NotificationPopover from './NotificationPopover';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className="bg-black border-b border-gray-800 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onMenuClick}
          className="text-white p-2 hover:bg-gray-800 rounded-lg lg:hidden"
        >
          <Menu size={20} />
        </button>
        
        {/* Spacer for desktop */}
        <div className="hidden lg:block"></div>
        
        <div className="flex items-center space-x-2 lg:space-x-4">
          <button className="text-white p-2 hover:bg-gray-800 rounded-lg">
            <Sun size={20} />
          </button>
          
          <Popover>
            <PopoverTrigger asChild>
              <button className="text-white p-2 hover:bg-gray-800 rounded-lg relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 bg-gray-900 border-gray-700" align="end">
              <NotificationPopover />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
};

export default Header;
