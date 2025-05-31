import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useToast } from './ui/use-toast';
import LearningResourceCard from './LearningResourceCard';

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

const LearnContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const { toast } = useToast();

  const handleSaveToVault = (resource: LearningResource) => {
    // Here you would typically save to a backend or local storage
    // For now, we'll just show a success message
    toast({
      title: "Saved to Vault",
      description: `"${resource.title}" has been saved to your vault for offline access.`,
    });
  };

  const learningResources: LearningResource[] = [
    {
      id: 1,
      title: "Advanced React Patterns and Best Practices",
      description: "Learn advanced React patterns including hooks, context, and performance optimization techniques.",
      type: "video" as const,
      category: "Frontend",
      level: "Advanced",
      duration: "2h 45m",
      fileSize: "1.2 GB",
      thumbnail: "/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png",
      author: "Sarah Johnson",
      rating: 4.8,
      enrolled: 1250
    },
    {
      id: 2,
      title: "Complete JavaScript Guide",
      description: "Comprehensive guide covering ES6+, async programming, and modern JavaScript development.",
      type: "pdf" as const,
      category: "Frontend",
      level: "Intermediate",
      pages: 340,
      fileSize: "25 MB",
      thumbnail: "/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png",
      author: "Mike Chen",
      rating: 4.9,
      downloaded: 890
    },
    {
      id: 3,
      title: "UI/UX Design Fundamentals",
      description: "Master the principles of user interface and user experience design with practical examples.",
      type: "video" as const,
      category: "Design",
      level: "Beginner",
      duration: "3h 20m",
      fileSize: "1.8 GB",
      thumbnail: "/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png",
      author: "Emily Rodriguez",
      rating: 4.7,
      enrolled: 2100
    },
    {
      id: 4,
      title: "Backend Development with Node.js",
      description: "Build scalable backend applications using Node.js, Express, and MongoDB.",
      type: "video" as const,
      category: "Backend",
      level: "Intermediate",
      duration: "4h 15m",
      fileSize: "2.1 GB",
      thumbnail: "/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png",
      author: "David Park",
      rating: 4.6,
      enrolled: 980
    },
    {
      id: 5,
      title: "Data Structures and Algorithms Handbook",
      description: "Essential data structures and algorithms every programmer should know.",
      type: "pdf" as const,
      category: "Computer Science",
      level: "Advanced",
      pages: 420,
      fileSize: "18 MB",
      thumbnail: "/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png",
      author: "Dr. Lisa Wang",
      rating: 4.9,
      downloaded: 1500
    },
    {
      id: 6,
      title: "Mobile App Development Resources",
      description: "Collection of tools, templates, and assets for mobile app development.",
      type: "file" as const,
      category: "Mobile",
      level: "Intermediate",
      fileCount: 45,
      fileSize: "150 MB",
      thumbnail: "/lovable-uploads/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png",
      author: "Alex Thompson",
      rating: 4.5,
      downloaded: 650
    }
  ];

  const categories = ['all', 'Frontend', 'Backend', 'Design', 'Mobile', 'Computer Science'];
  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredResources = learningResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || resource.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const videoResources = filteredResources.filter(resource => resource.type === 'video');
  const pdfResources = filteredResources.filter(resource => resource.type === 'pdf');
  const fileResources = filteredResources.filter(resource => resource.type === 'file');

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold text-white">Learn</h1>
        <p className="text-gray-400">Access prerecorded videos, PDFs, and learning resources</p>
        
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 bg-gray-900 p-4 rounded-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full lg:w-48 bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {categories.map(category => (
                <SelectItem key={category} value={category} className="text-white hover:bg-gray-700">
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-full lg:w-48 bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {levels.map(level => (
                <SelectItem key={level} value={level} className="text-white hover:bg-gray-700">
                  {level === 'all' ? 'All Levels' : level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900">
          <TabsTrigger value="all" className="text-white data-[state=active]:bg-blue-600">
            All ({filteredResources.length})
          </TabsTrigger>
          <TabsTrigger value="videos" className="text-white data-[state=active]:bg-blue-600">
            Videos ({videoResources.length})
          </TabsTrigger>
          <TabsTrigger value="pdfs" className="text-white data-[state=active]:bg-blue-600">
            PDFs ({pdfResources.length})
          </TabsTrigger>
          <TabsTrigger value="files" className="text-white data-[state=active]:bg-blue-600">
            Files ({fileResources.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => (
              <LearningResourceCard 
                key={resource.id} 
                resource={resource} 
                onSaveToVault={handleSaveToVault}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="videos" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoResources.map(resource => (
              <LearningResourceCard 
                key={resource.id} 
                resource={resource} 
                onSaveToVault={handleSaveToVault}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="pdfs" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pdfResources.map(resource => (
              <LearningResourceCard 
                key={resource.id} 
                resource={resource} 
                onSaveToVault={handleSaveToVault}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="files" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fileResources.map(resource => (
              <LearningResourceCard 
                key={resource.id} 
                resource={resource} 
                onSaveToVault={handleSaveToVault}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No resources found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default LearnContent;
