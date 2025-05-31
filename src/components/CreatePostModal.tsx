
import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useSocial } from './SocialContext';

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
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
      >
        <Plus size={16} />
        <span>Create Post</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-white">Create New Post</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title (optional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter post title..."
                  className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Content *
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your thoughts, research, or ideas..."
                  className="w-full bg-gray-800 text-white rounded-lg p-3 resize-none border border-gray-700 focus:border-blue-500 focus:outline-none"
                  rows={6}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g., research, ai, physics"
                  className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isResearch"
                  checked={isResearch}
                  onChange={(e) => setIsResearch(e.target.checked)}
                  className="rounded border-gray-700"
                />
                <label htmlFor="isResearch" className="text-sm text-gray-300">
                  This is a research post
                </label>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!content.trim()}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreatePostModal;
