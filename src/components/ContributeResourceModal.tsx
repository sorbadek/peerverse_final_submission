
import React, { useState } from 'react';
import { X, Upload, FileText, Video, File, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useToast } from './ui/use-toast';

interface ContributeResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContribute: (resource: any) => void;
}

const ContributeResourceModal = ({ isOpen, onClose, onContribute }: ContributeResourceModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    category: '',
    level: '',
    duration: '',
    pages: '',
    fileCount: '',
    fileSize: '',
    author: ''
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.type || !formData.category || !formData.level) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newResource = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      type: formData.type as 'video' | 'pdf' | 'file',
      category: formData.category,
      level: formData.level,
      duration: formData.type === 'video' ? formData.duration : undefined,
      pages: formData.type === 'pdf' ? parseInt(formData.pages) : undefined,
      fileCount: formData.type === 'file' ? parseInt(formData.fileCount) : undefined,
      fileSize: formData.fileSize,
      thumbnail: "/image/a8e6790e-ddf9-4561-8b5d-9181ba1ce938.png",
      author: formData.author,
      rating: 4.5,
      enrolled: 0,
      downloaded: 0
    };

    onContribute(newResource);
    toast({
      title: "Resource Contributed!",
      description: "Thank you for contributing to the learning community.",
    });
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      type: '',
      category: '',
      level: '',
      duration: '',
      pages: '',
      fileCount: '',
      fileSize: '',
      author: ''
    });
    onClose();
  };

  const getTypeIcon = () => {
    switch (formData.type) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'pdf':
        return <FileText className="w-5 h-5" />;
      case 'file':
        return <File className="w-5 h-5" />;
      default:
        return <Upload className="w-5 h-5" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <Card className="bg-gray-900 border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-800">
          <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
            {getTypeIcon()}
            Contribute Learning Resource
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </Button>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter resource title"
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe what this resource covers"
                  className="bg-gray-800 border-gray-700 text-white min-h-[80px]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name *
                </label>
                <Input
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  placeholder="Enter your name"
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>
            </div>

            {/* Resource Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Resource Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Type *
                  </label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="video" className="text-white hover:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4" />
                          Video
                        </div>
                      </SelectItem>
                      <SelectItem value="pdf" className="text-white hover:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          PDF
                        </div>
                      </SelectItem>
                      <SelectItem value="file" className="text-white hover:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <File className="w-4 h-4" />
                          File Bundle
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category *
                  </label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="Frontend" className="text-white hover:bg-gray-700">Frontend</SelectItem>
                      <SelectItem value="Backend" className="text-white hover:bg-gray-700">Backend</SelectItem>
                      <SelectItem value="Design" className="text-white hover:bg-gray-700">Design</SelectItem>
                      <SelectItem value="Mobile" className="text-white hover:bg-gray-700">Mobile</SelectItem>
                      <SelectItem value="Computer Science" className="text-white hover:bg-gray-700">Computer Science</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Level *
                  </label>
                  <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="Beginner" className="text-white hover:bg-gray-700">Beginner</SelectItem>
                      <SelectItem value="Intermediate" className="text-white hover:bg-gray-700">Intermediate</SelectItem>
                      <SelectItem value="Advanced" className="text-white hover:bg-gray-700">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Type-specific fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.type === 'video' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Duration
                    </label>
                    <Input
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      placeholder="e.g., 2h 30m"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                )}

                {formData.type === 'pdf' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Number of Pages
                    </label>
                    <Input
                      type="number"
                      value={formData.pages}
                      onChange={(e) => handleInputChange('pages', e.target.value)}
                      placeholder="e.g., 150"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                )}

                {formData.type === 'file' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Number of Files
                    </label>
                    <Input
                      type="number"
                      value={formData.fileCount}
                      onChange={(e) => handleInputChange('fileCount', e.target.value)}
                      placeholder="e.g., 25"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    File Size
                  </label>
                  <Input
                    value={formData.fileSize}
                    onChange={(e) => handleInputChange('fileSize', e.target.value)}
                    placeholder="e.g., 1.5 GB or 25 MB"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
            </div>

            {/* File Upload Area */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Upload Resource</h3>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">Drag and drop your files here, or click to browse</p>
                <p className="text-sm text-gray-500">Supports videos, PDFs, and zip files up to 500MB</p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                >
                  Choose Files
                </Button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="flex-1 text-gray-400"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Contribute Resource
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContributeResourceModal;
