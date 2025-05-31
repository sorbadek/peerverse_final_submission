
import React from 'react';
import { Play, FileText, Clock, Star, Users, File, Bookmark } from 'lucide-react';
import { Button } from './ui/button';

interface LearningResource {
  id: number;
  title: string;
  description: string;
  type: 'video' | 'pdf' | 'file';
  category: string;
  level: string;
  duration?: string;
  pages?: number;
  fileCount?: number;
  fileSize: string;
  thumbnail: string;
  author: string;
  rating: number;
  enrolled?: number;
  downloaded?: number;
}

interface LearningResourceCardProps {
  resource: LearningResource;
  onSaveToVault?: (resource: LearningResource) => void;
}

const LearningResourceCard = ({ resource, onSaveToVault }: LearningResourceCardProps) => {
  const getTypeIcon = () => {
    switch (resource.type) {
      case 'video':
        return <Play className="w-4 h-4" />;
      case 'pdf':
        return <FileText className="w-4 h-4" />;
      case 'file':
        return <File className="w-4 h-4" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };

  const getTypeColor = () => {
    switch (resource.type) {
      case 'video':
        return 'bg-red-500';
      case 'pdf':
        return 'bg-orange-500';
      case 'file':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getLevelColor = () => {
    switch (resource.level) {
      case 'Beginner':
        return 'bg-green-500';
      case 'Intermediate':
        return 'bg-yellow-500';
      case 'Advanced':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleSaveToVault = () => {
    if (onSaveToVault) {
      onSaveToVault(resource);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors">
      <div className="relative">
        <img 
          src={resource.thumbnail} 
          alt={resource.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 left-2 flex gap-2">
          <span className={`${getTypeColor()} text-white text-xs px-2 py-1 rounded flex items-center gap-1`}>
            {getTypeIcon()}
            {resource.type.toUpperCase()}
          </span>
          <span className={`${getLevelColor()} text-white text-xs px-2 py-1 rounded`}>
            {resource.level}
          </span>
        </div>
        <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
          {resource.fileSize}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-blue-400 text-sm font-medium">{resource.category}</span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-white text-sm">{resource.rating}</span>
          </div>
        </div>
        
        <h3 className="text-white font-semibold mb-2 line-clamp-2">{resource.title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{resource.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
          <div className="flex items-center gap-4">
            {resource.duration && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{resource.duration}</span>
              </div>
            )}
            {resource.pages && (
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                <span>{resource.pages} pages</span>
              </div>
            )}
            {resource.fileCount && (
              <div className="flex items-center gap-1">
                <File className="w-4 h-4" />
                <span>{resource.fileCount} files</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
            <span className="text-gray-300 text-sm">{resource.author}</span>
          </div>
          {(resource.enrolled || resource.downloaded) && (
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <Users className="w-4 h-4" />
              <span>{resource.enrolled || resource.downloaded}</span>
            </div>
          )}
        </div>
        
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleSaveToVault}
        >
          <Bookmark className="w-4 h-4 mr-2" />
          Save to Vault
        </Button>
      </div>
    </div>
  );
};

export default LearningResourceCard;
