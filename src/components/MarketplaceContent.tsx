import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Star, Upload, FileText, Users, Award, Eye, Share2, Filter, Search, TrendingUp, Clock, Bookmark, Heart, MessageSquare, Shield, Zap, Trophy, File, Video, Image, Music, Archive, Code } from 'lucide-react';
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

  const getFileTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
      case 'pdf collection':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'video':
      case 'video course':
        return <Video className="w-5 h-5 text-blue-500" />;
      case 'figma files':
      case 'design files':
        return <Image className="w-5 h-5 text-purple-500" />;
      case 'code':
      case 'source code':
        return <Code className="w-5 h-5 text-green-500" />;
      case 'audio':
      case 'podcast':
        return <Music className="w-5 h-5 text-orange-500" />;
      case 'archive':
      case 'zip bundle':
        return <Archive className="w-5 h-5 text-gray-500" />;
      default:
        return <File className="w-5 h-5 text-gray-400" />;
    }
  };

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
      verificationLevel: 'expert',
      trustScore: 94,
      price: '$29.99',
      tags: ['React', 'JavaScript', 'Frontend']
    },
    {
      id: 2,
      title: 'Machine Learning Research Papers Collection',
      type: 'PDF',
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
      price: '$49.99',
      tags: ['ML', 'Research', 'AI']
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
      price: '$19.99',
      tags: ['Figma', 'Design', 'UI/UX']
    },
    {
      id: 4,
      title: 'Python Data Science Course',
      type: 'Video Course',
      category: 'Programming',
      author: 'Alex Johnson',
      authorAvatar: '/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png',
      rating: 4.6,
      views: 2100,
      bookmarks: 456,
      likes: 178,
      comments: 89,
      verificationLevel: 'verified',
      trustScore: 91,
      price: '$39.99',
      tags: ['Python', 'Data Science', 'Analytics']
    },
    {
      id: 5,
      title: 'Business Plan Templates',
      type: 'PDF',
      category: 'Business',
      author: 'Maria Garcia',
      authorAvatar: '/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png',
      rating: 4.5,
      views: 876,
      bookmarks: 234,
      likes: 98,
      comments: 34,
      verificationLevel: 'verified',
      trustScore: 88,
      price: '$14.99',
      tags: ['Business', 'Templates', 'Planning']
    },
    {
      id: 6,
      title: 'Web Development Bootcamp',
      type: 'Video Course',
      category: 'Programming',
      author: 'John Smith',
      authorAvatar: '/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png',
      rating: 4.8,
      views: 3200,
      bookmarks: 687,
      likes: 298,
      comments: 156,
      verificationLevel: 'expert',
      trustScore: 95,
      price: '$59.99',
      tags: ['HTML', 'CSS', 'JavaScript']
    },
    {
      id: 7,
      title: 'Statistics Handbook',
      type: 'PDF',
      category: 'Mathematics',
      author: 'Dr. Lisa Wang',
      authorAvatar: '/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png',
      rating: 4.7,
      views: 1456,
      bookmarks: 389,
      likes: 167,
      comments: 78,
      verificationLevel: 'expert',
      trustScore: 92,
      price: '$24.99',
      tags: ['Statistics', 'Math', 'Analysis']
    },
    {
      id: 8,
      title: 'Mobile App Design Kit',
      type: 'Design Files',
      category: 'Design',
      author: 'David Kim',
      authorAvatar: '/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png',
      rating: 4.6,
      views: 987,
      bookmarks: 276,
      likes: 134,
      comments: 45,
      verificationLevel: 'verified',
      trustScore: 89,
      price: '$34.99',
      tags: ['Mobile', 'Design', 'UI Kit']
    },
    {
      id: 9,
      title: 'Physics Lab Experiments',
      type: 'PDF Collection',
      category: 'Science',
      author: 'Prof. Sarah Miller',
      authorAvatar: '/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png',
      rating: 4.4,
      views: 743,
      bookmarks: 198,
      likes: 87,
      comments: 23,
      verificationLevel: 'verified',
      trustScore: 86,
      price: '$18.99',
      tags: ['Physics', 'Lab', 'Experiments']
    },
    {
      id: 10,
      title: 'Digital Marketing Masterclass',
      type: 'Video Course',
      category: 'Business',
      author: 'Rachel Brown',
      authorAvatar: '/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png',
      rating: 4.7,
      views: 1876,
      bookmarks: 423,
      likes: 189,
      comments: 67,
      verificationLevel: 'verified',
      trustScore: 90,
      price: '$44.99',
      tags: ['Marketing', 'Digital', 'Strategy']
    },
    {
      id: 11,
      title: 'JavaScript Source Code Library',
      type: 'Source Code',
      category: 'Programming',
      author: 'Tech Dev',
      authorAvatar: '/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png',
      rating: 4.5,
      views: 1234,
      bookmarks: 345,
      likes: 123,
      comments: 56,
      verificationLevel: 'verified',
      trustScore: 87,
      price: '$22.99',
      tags: ['JavaScript', 'Code', 'Library']
    },
    {
      id: 12,
      title: 'Calculus Study Guide',
      type: 'PDF',
      category: 'Mathematics',
      author: 'Prof. James Wilson',
      authorAvatar: '/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png',
      rating: 4.6,
      views: 892,
      bookmarks: 267,
      likes: 98,
      comments: 34,
      verificationLevel: 'expert',
      trustScore: 93,
      price: '$16.99',
      tags: ['Calculus', 'Math', 'Study Guide']
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

      {/* Materials Tab - Updated with smaller cards and more in grid */}
      {activeTab === 'materials' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getFileTypeIcon(material.type)}
                    <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 text-xs">
                      {material.type}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getVerificationIcon(material.verificationLevel)}
                    <span className={`text-xs font-medium ${getTrustScoreColor(material.trustScore)}`}>
                      {material.trustScore}%
                    </span>
                  </div>
                </div>
                <CardTitle className="text-white text-sm line-clamp-2 mb-2">
                  {material.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={material.authorAvatar} />
                      <AvatarFallback>{material.author[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-gray-300 text-xs font-medium">{material.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-gray-300 text-xs">{material.rating}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1 text-xs">
                  <div className="text-center">
                    <Eye className="w-3 h-3 text-gray-400 mx-auto mb-1" />
                    <span className="text-gray-400">{material.views}</span>
                  </div>
                  <div className="text-center">
                    <Bookmark className="w-3 h-3 text-blue-400 mx-auto mb-1" />
                    <span className="text-gray-400">{material.bookmarks}</span>
                  </div>
                  <div className="text-center">
                    <Heart className="w-3 h-3 text-red-400 mx-auto mb-1" />
                    <span className="text-gray-400">{material.likes}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {material.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {material.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{material.tags.length - 2}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                  <span className="text-green-400 font-bold text-sm">{material.price}</span>
                  <Button size="sm" variant="outline" className="text-xs">
                    <Share2 className="w-3 h-3 mr-1" />
                    Buy
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
