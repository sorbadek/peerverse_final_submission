
import React, { useState } from 'react';
import { ChevronUp, ChevronDown, MessageSquare, Share } from 'lucide-react';
import { useSocial } from './SocialContext';
import CommentSection from './CommentSection';

const SocialFeed = () => {
  const { posts, votePost } = useSocial();
  const [expandedComments, setExpandedComments] = useState<string[]>([]);

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => 
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div key={post.id} className="bg-gray-900 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <img
              src={post.avatar}
              alt={post.author}
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-white">{post.author}</h3>
                <span className="text-gray-400 text-sm">{formatTimeAgo(post.timestamp)}</span>
                {post.isResearch && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Research</span>
                )}
              </div>
              
              {post.title && (
                <h4 className="text-lg font-semibold text-white mb-2">{post.title}</h4>
              )}
              
              <p className="text-gray-300 mb-4">{post.content}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span key={tag} className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center space-x-6 text-gray-400">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => votePost(post.id, 'up')}
                    className={`p-1 rounded hover:bg-gray-800 transition-colors ${
                      post.userVote === 'up' ? 'text-green-500' : ''
                    }`}
                  >
                    <ChevronUp size={20} />
                  </button>
                  <span className="text-sm">{post.upvotes - post.downvotes}</span>
                  <button
                    onClick={() => votePost(post.id, 'down')}
                    className={`p-1 rounded hover:bg-gray-800 transition-colors ${
                      post.userVote === 'down' ? 'text-red-500' : ''
                    }`}
                  >
                    <ChevronDown size={20} />
                  </button>
                </div>
                
                <button
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center space-x-1 hover:text-white transition-colors"
                >
                  <MessageSquare size={16} />
                  <span className="text-sm">{post.comments.length} comments</span>
                </button>
                
                <button className="flex items-center space-x-1 hover:text-white transition-colors">
                  <Share size={16} />
                  <span className="text-sm">Share</span>
                </button>
              </div>
              
              {expandedComments.includes(post.id) && (
                <div className="mt-4 border-t border-gray-800 pt-4">
                  <CommentSection postId={post.id} comments={post.comments} />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SocialFeed;
