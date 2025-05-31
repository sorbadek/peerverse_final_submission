
import React, { useState } from 'react';
import { X, Plus, Image, Hash, MapPin } from 'lucide-react';
import { useSocial } from './SocialContext';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

const CreatePostModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isResearch, setIsResearch] = useState(false);
  const { addPost } = useSocial();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      addPost({
        author: 'Current User',
        avatar: 'https://ui-avatars.com/api/?name=Current+User&background=6366f1&color=fff',
        title: title.trim() || undefined,
        content: content.trim(),
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        isResearch
      });
      
      setTitle('');
      setContent('');
      setTags('');
      setIsResearch(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-start"
      >
        <Plus size={16} className="mr-2" />
        Create Post
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <Card className="bg-gray-900 border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-800">
              <CardTitle className="text-xl font-semibold text-white">Create Post</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </Button>
            </CardHeader>

            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* User Info */}
                <div className="flex items-center space-x-3 p-4 pb-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="https://ui-avatars.com/api/?name=Current+User&background=6366f1&color=fff" />
                    <AvatarFallback>CU</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-white">Current User</p>
                    <p className="text-xs text-gray-400">Posting to Community</p>
                  </div>
                </div>

                <div className="px-4 space-y-4">
                  {/* Title Input */}
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Add a title (optional)"
                    className="w-full bg-transparent text-white text-lg placeholder-gray-500 border-none outline-none resize-none"
                  />

                  {/* Content Input */}
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full bg-transparent text-white placeholder-gray-500 border-none outline-none resize-none min-h-[120px] text-base"
                    required
                  />

                  {/* Tags Input */}
                  <div className="flex items-center space-x-2">
                    <Hash size={16} className="text-gray-400" />
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="Add tags (comma-separated)"
                      className="flex-1 bg-transparent text-white placeholder-gray-500 border-none outline-none text-sm"
                    />
                  </div>

                  {/* Research Toggle */}
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isResearch"
                      checked={isResearch}
                      onChange={(e) => setIsResearch(e.target.checked)}
                      className="rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="isResearch" className="text-sm text-gray-300">
                      This is a research post
                    </label>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between p-4 border-t border-gray-800">
                  <div className="flex items-center space-x-4">
                    <Button type="button" variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <Image size={16} className="mr-1" />
                      Photo
                    </Button>
                    <Button type="button" variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <MapPin size={16} className="mr-1" />
                      Location
                    </Button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsOpen(false)}
                      className="text-gray-400"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={!content.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CreatePostModal;
