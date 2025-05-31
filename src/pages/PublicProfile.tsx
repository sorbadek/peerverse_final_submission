
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import PublicProfileContent from '../components/PublicProfileContent';

const PublicProfile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // In a real app, this would be determined by comparing the current user ID with the profile being viewed
  // For now, we'll assume it's the user's own profile when accessed from /public-profile
  const isOwnProfile = true;

  return (
    <div className="min-h-screen bg-black flex w-full">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className="flex-1 flex flex-col w-full lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <PublicProfileContent isOwnProfile={isOwnProfile} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PublicProfile;
