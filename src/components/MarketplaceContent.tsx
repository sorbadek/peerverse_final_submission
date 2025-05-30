
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Star, Upload, FileText, Users, Award, Eye, Share2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const MarketplaceContent = () => {
  const [activeTab, setActiveTab] = useState('materials');

  const marketplaceMaterials = [
    {
      id: 1,
      title: 'Advanced React Patterns & Best Practices',
      type: 'PDF',
      category: 'Programming',
      author: 'Sarah Chen',
      authorAvatar: '/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png',
      rating: 4.8,
      views: 1250,
      xpEarned: 340,
      price: 'Free',
      verified: true,
      tags: ['React', 'JavaScript', 'Frontend']
    },
    {
      id: 2,
      title: 'Machine Learning Research Papers Collection',
      type: 'Document Bundle',
      category: 'AI/ML',
      author: 'Dr. Michael Rodriguez',
      authorAvatar: '/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png',
      rating: 4.9,
      views: 890,
      xpEarned: 520,
      price: 'Premium',
      verified: true,
      tags: ['Machine Learning', 'Research', 'AI']
    }
  ];

  const talents = [
    {
      id: 1,
      name: 'Alex Thompson',
      avatar: '/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png',
      skills: ['UI/UX Design', 'Figma', 'Prototyping'],
      rating: 4.9,
      peers: 234,
      verified: true,
      hourlyRate: '$45/hr'
    },
    {
      id: 2,
      name: 'Maria Garcia',
      avatar: '/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png',
      skills: ['Data Analysis', 'Python', 'Statistics'],
      rating: 4.7,
      peers: 156,
      verified: true,
      hourlyRate: '$38/hr'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Marketplace</h1>
          <p className="text-gray-400">Trade educational materials and find talented peers</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Upload className="w-4 h-4 mr-2" />
          Upload Material
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('materials')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'materials'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Educational Materials
        </button>
        <button
          onClick={() => setActiveTab('talents')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'talents'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Find Talent
        </button>
      </div>

      {/* Materials Tab */}
      {activeTab === 'materials' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {marketplaceMaterials.map((material) => (
            <Card key={material.id} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors cursor-pointer">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="bg-blue-600/20 text-blue-400">
                    {material.type}
                  </Badge>
                  {material.verified && (
                    <Award className="w-4 h-4 text-yellow-500" />
                  )}
                </div>
                <CardTitle className="text-white text-lg line-clamp-2">
                  {material.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={material.authorAvatar} />
                    <AvatarFallback>{material.author[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-gray-300 text-sm">{material.author}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-gray-300">{material.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">{material.views}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {material.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-green-400 font-medium">
                    +{material.xpEarned} XP earned
                  </span>
                  <Button size="sm" variant="outline">
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Talents Tab */}
      {activeTab === 'talents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {talents.map((talent) => (
            <Card key={talent.id} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors cursor-pointer">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={talent.avatar} />
                    <AvatarFallback>{talent.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-white font-semibold">{talent.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-gray-300 text-sm">{talent.rating}</span>
                      {talent.verified && (
                        <Award className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  {talent.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{talent.peers} peers</span>
                  </div>
                  <span className="text-green-400 font-medium">{talent.hourlyRate}</span>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  View Profile
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketplaceContent;
