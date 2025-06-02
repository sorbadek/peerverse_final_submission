
import React, { useState } from 'react';
import { ArrowLeft, Upload, FileText, Video, Image, Code, Music, Archive, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const UploadMaterial = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: '',
    level: 'Beginner',
    tags: [],
    newTag: '',
    author: '',
    estimatedTime: '',
    prerequisites: '',
    learningOutcomes: '',
    files: []
  });

  const categories = ['Programming', 'AI/ML', 'Design', 'Business', 'Science', 'Mathematics'];
  const types = ['PDF', 'Video Course', 'Code Repository', 'Design Files', 'Audio/Podcast', 'Archive'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'PDF': return <FileText className="w-5 h-5" />;
      case 'Video Course': return <Video className="w-5 h-5" />;
      case 'Design Files': return <Image className="w-5 h-5" />;
      case 'Code Repository': return <Code className="w-5 h-5" />;
      case 'Audio/Podcast': return <Music className="w-5 h-5" />;
      case 'Archive': return <Archive className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: ''
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }));
  };

  const removeFile = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically upload the files and save the material data
    toast({
      title: "Material Uploaded Successfully!",
      description: `"${formData.title}" has been shared with the community.`,
    });
    navigate('/marketplace');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/marketplace')}
            className="mr-4 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Marketplace
          </Button>
          <h1 className="text-3xl font-bold">Share Learning Material</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Enter material title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full h-24 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="Describe your learning material"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    required
                  >
                    <option value="">Select type</option>
                    {types.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Level *</label>
                  <select
                    value={formData.level}
                    onChange={(e) => handleInputChange('level', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Additional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Author Name</label>
                <Input
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Your name or organization"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Estimated Learning Time</label>
                <Input
                  value={formData.estimatedTime}
                  onChange={(e) => handleInputChange('estimatedTime', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="e.g., 2 hours, 30 minutes, 1 week"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Prerequisites</label>
                <textarea
                  value={formData.prerequisites}
                  onChange={(e) => handleInputChange('prerequisites', e.target.value)}
                  className="w-full h-20 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="What should learners know before using this material?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Learning Outcomes</label>
                <textarea
                  value={formData.learningOutcomes}
                  onChange={(e) => handleInputChange('learningOutcomes', e.target.value)}
                  className="w-full h-20 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="What will learners achieve after completing this material?"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={formData.newTag}
                    onChange={(e) => handleInputChange('newTag', e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-600/20 text-blue-400">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                {formData.type && getTypeIcon(formData.type)}
                <span className="ml-2">Upload Files</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-2">Drop files here or click to browse</p>
                <p className="text-sm text-gray-500 mb-4">Supports: PDF, videos, images, code files, archives</p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  type="button"
                  onClick={() => document.getElementById('file-upload').click()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Choose Files
                </Button>
              </div>

              {formData.files.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-white font-medium">Selected Files:</h4>
                  {formData.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-800 p-3 rounded">
                      <span className="text-gray-300">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/marketplace')}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!formData.title || !formData.description || !formData.category || !formData.type}
            >
              Share Material
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadMaterial;
