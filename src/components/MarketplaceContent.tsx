
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Star, Upload, FileText, Users, Award, Eye, Share2, Filter, Search, TrendingUp, Clock, Bookmark, Heart, MessageSquare, Shield, Zap, Trophy } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const MarketplaceContent = () => {
  const [activeTab, setActiveTab] = useState('materials');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('trending');

  const categories = ['all', 'Programming', 'AI/ML', 'Design', 'Business', 'Science', 'Mathematics'];
  const sortOptions = [
    { value: 'trending', label: 'Trending' },
    { value: 'newest', label: 'Newest' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'verified', label: 'Verified First' }
  ];

  const marketplaceMaterials = [
    {
      id: 1,
      title: 'Advanced React Patterns & Best Practices',
      type: 'PDF Collection',
      category: 'Programming',
      author: 'Sarah Chen',
      authorAvatar: '/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png',
      rating: 4.8,
      views: 1250,
      bookmarks: 342,
      likes: 89,
      comments: 23,
      verificationLevel: 'expert', // expert, verified, community
      trustScore: 94,
      contributionStreak: 45,
      responseTime: '< 2 hours',
      lastUpdated: '2 days ago',
      difficulty: 'Advanced',
      estimatedTime: '8-12 hours',
      tags: ['React', 'JavaScript', 'Frontend', 'Hooks', 'Performance'],
      preview: 'Complete guide covering advanced React patterns including render props, compound components, and custom hooks...',
      downloads: 892,
      sharing: 156
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
      bookmarks: 278,
      likes: 124,
      comments: 45,
      verificationLevel: 'expert',
      trustScore: 98,
      contributionStreak: 127,
      responseTime: '< 1 hour',
      lastUpdated: '1 week ago',
      difficulty: 'Expert',
      estimatedTime: '20+ hours',
      tags: ['Machine Learning', 'Research', 'AI', 'Deep Learning', 'Neural Networks'],
      preview: 'Curated collection of 25 breakthrough ML research papers with detailed annotations and implementation guides...',
      downloads: 1205,
      sharing: 289
    },
    {
      id: 3,
      title: 'UI/UX Design System Templates',
      type: 'Figma Files',
      category: 'Design',
      author: 'Emma Thompson',
      authorAvatar: '/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png',
      rating: 4.7,
      views: 654,
      bookmarks: 189,
      likes: 67,
      comments: 12,
      verificationLevel: 'verified',
      trustScore: 87,
      contributionStreak: 28,
      responseTime: '< 4 hours',
      lastUpdated: '5 days ago',
      difficulty: 'Intermediate',
      estimatedTime: '4-6 hours',
      tags: ['Figma', 'Design System', 'UI/UX', 'Templates', 'Components'],
      preview: 'Professional design system with 100+ components, style guides, and design tokens for modern applications...',
      downloads: 423,
      sharing: 92
    }
  ];

  const talents = [
    {
      id: 1,
      name: 'Alex Thompson',
      avatar: '/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png',
      skills: ['UI/UX Design', 'Figma', 'Prototyping', 'User Research'],
      rating: 4.9,
      peers: 234,
      completedProjects: 47,
      responseTime: '< 2 hours',
      verificationLevel: 'expert',
      trustScore: 96,
      hourlyRate: '$45/hr',
      availability: 'Available',
      successRate: 98,
      languages: ['English', 'Spanish'],
      timezone: 'EST',
      portfolio: 15
    },
    {
      id: 2,
      name: 'Maria Garcia',
      avatar: '/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png',
      skills: ['Data Analysis', 'Python', 'Statistics', 'Machine Learning'],
      rating: 4.7,
      peers: 156,
      completedProjects: 32,
      responseTime: '< 4 hours',
      verificationLevel: 'verified',
      trustScore: 89,
      hourlyRate: '$38/hr',
      availability: 'Busy',
      successRate: 94,
      languages: ['English', 'Portuguese'],
      timezone: 'PST',
      portfolio: 12
    }
  ];

  const getVerificationIcon = (level: string) => {
    switch (level) {
      case 'expert':
        return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 'verified':
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <Award className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const filteredMaterials = marketplaceMaterials.filter(material => 
    filterCategory === 'all' || material.category === filterCategory
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Marketplace</h1>
          <p className="text-gray-400">Discover premium educational content and connect with talented peers</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Upload className="w-4 h-4 mr-2" />
          Upload Material
        </Button>
      </div>

      {/* Advanced Search and Filters */}
      <div className="bg-gray-800 p-4 rounded-lg space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search materials, skills, or users..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors cursor-pointer">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-blue-600/20 text-blue-400">
                      {material.type}
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-600/20 text-purple-400">
                      {material.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getVerificationIcon(material.verificationLevel)}
                    <span className={`text-sm font-medium ${getTrustScoreColor(material.trustScore)}`}>
                      {material.trustScore}%
                    </span>
                  </div>
                </div>
                <CardTitle className="text-white text-lg line-clamp-2 mb-2">
                  {material.title}
                </CardTitle>
                <p className="text-gray-400 text-sm line-clamp-2">{material.preview}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={material.authorAvatar} />
                      <AvatarFallback>{material.author[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="text-gray-300 text-sm font-medium">{material.author}</span>
                      <div className="flex items-center space-x-1">
                        <Zap className="w-3 h-3 text-orange-400" />
                        <span className="text-xs text-gray-400">{material.contributionStreak} day streak</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-gray-300 text-sm">{material.rating}</span>
                    </div>
                    <span className="text-xs text-gray-400">{material.responseTime}</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="text-center">
                    <Eye className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <span className="text-gray-400">{material.views}</span>
                  </div>
                  <div className="text-center">
                    <Bookmark className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                    <span className="text-gray-400">{material.bookmarks}</span>
                  </div>
                  <div className="text-center">
                    <Heart className="w-4 h-4 text-red-400 mx-auto mb-1" />
                    <span className="text-gray-400">{material.likes}</span>
                  </div>
                  <div className="text-center">
                    <MessageSquare className="w-4 h-4 text-green-400 mx-auto mb-1" />
                    <span className="text-gray-400">{material.comments}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {material.tags.slice(0, 4).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {material.tags.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{material.tags.length - 4} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{material.estimatedTime}</span>
                    <span>•</span>
                    <TrendingUp className="w-3 h-3" />
                    <span>{material.sharing} shares</span>
                  </div>
                  <Button size="sm" variant="outline">
                    <Share2 className="w-4 h-4 mr-1" />
                    Access
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Talents Tab */}
      {activeTab === 'talents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {talents.map((talent) => (
            <Card key={talent.id} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors cursor-pointer">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={talent.avatar} />
                      <AvatarFallback>{talent.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${
                      talent.availability === 'Available' ? 'bg-green-500' : 'bg-orange-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-white font-semibold">{talent.name}</h3>
                      {getVerificationIcon(talent.verificationLevel)}
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-gray-300 text-sm">{talent.rating}</span>
                      </div>
                      <span className={`text-sm font-medium ${getTrustScoreColor(talent.trustScore)}`}>
                        {talent.trustScore}%
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <span>{talent.completedProjects} projects</span>
                      <span>{talent.successRate}% success</span>
                      <span>{talent.responseTime}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  {talent.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {talent.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{talent.skills.length - 3} more
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Peers:</span>
                    <span className="text-gray-300">{talent.peers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Portfolio:</span>
                    <span className="text-gray-300">{talent.portfolio} items</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Rate:</span>
                    <span className="text-green-400 font-medium">{talent.hourlyRate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className={talent.availability === 'Available' ? 'text-green-400' : 'text-orange-400'}>
                      {talent.availability}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700" size="sm">
                    View Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketplaceContent;
