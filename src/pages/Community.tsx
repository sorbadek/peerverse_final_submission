
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import SocialFeed from '../components/SocialFeed';
import GroupsPanel from '../components/GroupsPanel';
import CreatePostModal from '../components/CreatePostModal';
import CreatePollModal from '../components/CreatePollModal';
import { SocialProvider } from '../components/SocialContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { TrendingUp, Users, MessageSquare } from 'lucide-react';

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
          
          <main className="flex-1 overflow-auto bg-gray-950">
            <div className="max-w-6xl mx-auto px-4 py-6">
              {/* Header Section */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Community</h1>
                <p className="text-gray-400">Connect, share, and discover with fellow researchers and learners</p>
              </div>

              <div className="grid lg:grid-cols-12 gap-6">
                {/* Left Sidebar */}
                <div className="lg:col-span-3 space-y-4">
                  {/* Quick Actions */}
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-lg">Share Something</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <CreatePostModal />
                      <CreatePollModal />
                    </CardContent>
                  </Card>

                  {/* Navigation */}
                  <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="p-3">
                      <div className="space-y-1">
                        <Button
                          variant={activeView === 'feed' ? 'default' : 'ghost'}
                          onClick={() => setActiveView('feed')}
                          className="w-full justify-start text-left"
                        >
                          <MessageSquare size={16} className="mr-2" />
                          Feed
                        </Button>
                        <Button
                          variant={activeView === 'groups' ? 'default' : 'ghost'}
                          onClick={() => setActiveView('groups')}
                          className="w-full justify-start text-left"
                        >
                          <Users size={16} className="mr-2" />
                          Groups
                        </Button>
                        <Button
                          variant={activeView === 'polls' ? 'default' : 'ghost'}
                          onClick={() => setActiveView('polls')}
                          className="w-full justify-start text-left"
                        >
                          <TrendingUp size={16} className="mr-2" />
                          Polls & Surveys
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-6">
                  {activeView === 'feed' && <SocialFeed />}
                  {activeView === 'groups' && <GroupsPanel />}
                  {activeView === 'polls' && (
                    <Card className="bg-gray-900 border-gray-800">
                      <CardContent className="p-8 text-center">
                        <TrendingUp size={48} className="mx-auto text-gray-600 mb-4" />
                        <h3 className="text-white text-lg font-semibold mb-2">Polls & Surveys</h3>
                        <p className="text-gray-400 mb-4">Create and participate in community polls to gather insights and opinions.</p>
                        <CreatePollModal />
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                {/* Right Sidebar */}
                <div className="lg:col-span-3 space-y-4">
                  {/* Trending Topics */}
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-lg flex items-center">
                        <TrendingUp size={20} className="mr-2" />
                        Trending
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { tag: 'MachineLearning', posts: '2.4k posts' },
                        { tag: 'QuantumPhysics', posts: '1.8k posts' },
                        { tag: 'ClimateScience', posts: '1.2k posts' },
                        { tag: 'DataScience', posts: '956 posts' },
                        { tag: 'Neuroscience', posts: '743 posts' }
                      ].map((topic) => (
                        <div key={topic.tag} className="flex justify-between items-center">
                          <div>
                            <p className="text-white font-medium">#{topic.tag}</p>
                            <p className="text-gray-400 text-xs">{topic.posts}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Quick Stats */}
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-lg">Community Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Active Members</span>
                        <span className="text-white font-semibold">12.4k</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Posts Today</span>
                        <span className="text-white font-semibold">247</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Research Papers</span>
                        <span className="text-white font-semibold">1.2k</span>
                      </div>
                    </CardContent>
                  </Card>
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
