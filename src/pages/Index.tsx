
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import XPBalanceCard from '../components/XPBalanceCard';
import AnalyticsSection from '../components/AnalyticsSection';
import ContinueLearning from '../components/ContinueLearning';
import NotificationPanel from '../components/NotificationPanel';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-black flex w-full">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className="flex-1 flex flex-col">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-3 space-y-6">
                <XPBalanceCard />
                <AnalyticsSection />
                <ContinueLearning />
              </div>
              
              {/* Notifications Panel */}
              <div className="lg:col-span-1">
                <NotificationPanel />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
