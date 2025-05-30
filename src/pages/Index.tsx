
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import XPBalanceCard from '../components/XPBalanceCard';
import AnalyticsSection from '../components/AnalyticsSection';
import ContinueLearning from '../components/ContinueLearning';
import NotificationPanel from '../components/NotificationPanel';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6">
              {/* Main Content */}
              <div className="xl:col-span-3 space-y-4 lg:space-y-6">
                <XPBalanceCard />
                <AnalyticsSection />
                <ContinueLearning />
              </div>
              
              {/* Notifications Panel */}
              <div className="xl:col-span-1">
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
