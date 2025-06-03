
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import PublicProfileContent from '../components/PublicProfileContent';
import { useAuth } from '../contexts/AuthContext';

const PublicProfile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  
  // Determine if this is the user's own profile
  const isOwnProfile = user?.email === userId || !userId;

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
            <PublicProfileContent 
              isOwnProfile={isOwnProfile} 
              userId={userId}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PublicProfile;
