
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import TutorHubContent from '../components/TutorHubContent';
import { SessionProvider} from '../components/SessionManager';
import { useSession } from '@/hooks/useSession';
import JitsiMeet from '../components/JitsiMeet';

const TutorHubInner = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentSession, endSession } = useSession();

  // If there's an active session, show Jitsi Meet
  if (currentSession) {
    return (
      <JitsiMeet
        roomId={currentSession.id}
        displayName="User" // In a real app, this would come from user context
        onClose={endSession}
      />
    );
  }

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
            <TutorHubContent />
          </div>
        </main>
      </div>
    </div>
  );
};

const TutorHub = () => {
  return (
    <SessionProvider>
      <TutorHubInner />
    </SessionProvider>
  );
};

export default TutorHub;
