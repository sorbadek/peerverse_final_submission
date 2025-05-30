
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Search, Filter, SortAsc, Grid, List, FileText, Video, Image, Code, Music, Archive, File, Download, Share2, Eye, Calendar, Folder, Star, Bookmark } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const VaultContent = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('date');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fileTypes = ['all', 'PDF', 'Video', 'Image', 'Code', 'Audio', 'Archive'];
  const sortOptions = [
    { value: 'date', label: 'Date Added' },
    { value: 'name', label: 'Name' },
    { value: 'type', label: 'File Type' },
    { value: 'size', label: 'Size' }
  ];

  const getFileTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'video':
        return <Video className="w-5 h-5 text-blue-500" />;
      case 'image':
        return <Image className="w-5 h-5 text-purple-500" />;
      case 'code':
        return <Code className="w-5 h-5 text-green-500" />;
      case 'audio':
        return <Music className="w-5 h-5 text-orange-500" />;
      case 'archive':
        return <Archive className="w-5 h-5 text-gray-500" />;
      default:
        return <File className="w-5 h-5 text-gray-400" />;
    }
  };

  const savedMaterials = [
    {
      id: 1,
      title: 'Advanced React Patterns & Best Practices',
      type: 'PDF',
      category: 'Programming',
      author: 'Sarah Chen',
      authorAvatar: '/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png',
      dateAdded: '2024-01-15',
      size: '2.4 MB',
      rating: 4.8,
      tags: ['React', 'JavaScript', 'Frontend'],
      thumbnail: '/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png'
    },
    {
      id: 2,
      title: 'Machine Learning Fundamentals Video Course',
      type: 'Video',
      category: 'AI/ML',
      author: 'Dr. Michael Rodriguez',
      authorAvatar: '/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png',
      dateAdded: '2024-01-10',
      size: '1.2 GB',
      rating: 4.9,
      tags: ['ML', 'Python', 'AI'],
      thumbnail: '/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png'
    },
    {
      id: 3,
      title: 'UI Design System Templates',
      type: 'Image',
      category: 'Design',
      author: 'Emma Thompson',
      authorAvatar: '/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png',
      dateAdded: '2024-01-08',
      size: '45 MB',
      rating: 4.7,
      tags: ['Figma', 'Design', 'UI/UX'],
      thumbnail: '/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png'
    },
    {
      id: 4,
      title: 'Python Data Science Scripts',
      type: 'Code',
      category: 'Programming',
      author: 'Alex Johnson',
      authorAvatar: '/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png',
      dateAdded: '2024-01-05',
      size: '8.7 MB',
      rating: 4.6,
      tags: ['Python', 'Data Science', 'Scripts'],
      thumbnail: '/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png'
    },
    {
      id: 5,
      title: 'Business Podcast Series',
      type: 'Audio',
      category: 'Business',
      author: 'Maria Garcia',
      authorAvatar: '/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png',
      dateAdded: '2024-01-03',
      size: '156 MB',
      rating: 4.5,
      tags: ['Business', 'Podcast', 'Strategy'],
      thumbnail: '/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png'
    },
    {
      id: 6,
      title: 'Web Development Toolkit',
      type: 'Archive',
      category: 'Programming',
      author: 'John Smith',
      authorAvatar: '/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png',
      dateAdded: '2024-01-01',
      size: '234 MB',
      rating: 4.8,
      tags: ['HTML', 'CSS', 'JavaScript'],
      thumbnail: '/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png'
    }
  ];

  const filteredMaterials = savedMaterials.filter(material => {
    const matchesType = filterType === 'all' || material.type.toLowerCase() === filterType.toLowerCase();
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const categories = [...new Set(savedMaterials.map(material => material.category))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Vault</h1>
          <p className="text-gray-400">Organize and access your saved educational materials</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Folder className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-white">{savedMaterials.length}</p>
                <p className="text-sm text-gray-400">Total Materials</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bookmark className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-white">{categories.length}</p>
                <p className="text-sm text-gray-400">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-white">{savedMaterials.filter(m => m.type === 'PDF').length}</p>
                <p className="text-sm text-gray-400">Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Video className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-white">{savedMaterials.filter(m => m.type === 'Video').length}</p>
                <p className="text-sm text-gray-400">Videos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 p-4 rounded-lg space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search your materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            {fileTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type}
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
                Sort by {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Materials Grid/List */}
      {viewMode === 'grid' ? (
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
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-gray-300 text-xs">{material.rating}</span>
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
                  <Badge variant="outline" className="text-xs">
                    {material.category}
                  </Badge>
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

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(material.dateAdded).toLocaleDateString()}</span>
                  </div>
                  <span>{material.size}</span>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <Eye className="w-3 h-3 mr-1" />
                    Open
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {getFileTypeIcon(material.type)}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">{material.title}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <span>{material.author}</span>
                        <span>•</span>
                        <span>{material.category}</span>
                        <span>•</span>
                        <span>{new Date(material.dateAdded).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant="secondary" className="text-xs">
                      {material.type}
                    </Badge>
                    <span className="text-sm text-gray-400">{material.size}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-300">{material.rating}</span>
                    </div>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredMaterials.length === 0 && (
        <div className="text-center py-12">
          <Folder className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No materials found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default VaultContent;
