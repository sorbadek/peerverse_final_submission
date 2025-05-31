
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import SocialFeed from '../components/SocialFeed';
import GroupsPanel from '../components/GroupsPanel';
import CreatePostModal from '../components/CreatePostModal';
import CreatePollModal from '../components/CreatePollModal';
import { SocialProvider } from '../components/SocialContext';

const Community = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<'feed' | 'groups' | 'polls'>('feed');

  return (
    <SocialProvider>
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
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-4">Community</h1>
                <div className="flex space-x-4 mb-6">
                  <button
                    onClick={() => setActiveView('feed')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      activeView === 'feed' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Feed
                  </button>
                  <button
                    onClick={() => setActiveView('groups')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      activeView === 'groups' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Groups
                  </button>
                  <button
                    onClick={() => setActiveView('polls')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      activeView === 'polls' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Polls & Surveys
                  </button>
                </div>
              </div>

              <div className="grid lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  {activeView === 'feed' && <SocialFeed />}
                  {activeView === 'groups' && <GroupsPanel />}
                  {activeView === 'polls' && <div className="text-white">Polls coming soon...</div>}
                </div>
                
                <div className="lg:col-span-1">
                  <div className="bg-gray-900 rounded-lg p-4 mb-6">
                    <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                      <CreatePostModal />
                      <CreatePollModal />
                    </div>
                  </div>
                  
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-4">Trending Topics</h3>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-300">#MachineLearning</div>
                      <div className="text-sm text-gray-300">#QuantumPhysics</div>
                      <div className="text-sm text-gray-300">#ClimateScience</div>
                      <div className="text-sm text-gray-300">#DataScience</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SocialProvider>
  );
};

export default Community;
