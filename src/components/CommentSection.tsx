
import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useSocial, Comment } from './SocialContext';

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
}

const CommentSection = ({ postId, comments }: CommentSectionProps) => {
  const { addComment, voteComment } = useSocial();
  const [newComment, setNewComment] = useState('');

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(postId, {
        author: 'Current User',
        avatar: 'https://ui-avatars.com/api/?name=Current+User&background=6366f1&color=fff',
        content: newComment.trim()
      });
      setNewComment('');
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmitComment} className="space-y-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full bg-gray-800 text-white rounded-lg p-3 resize-none border border-gray-700 focus:border-blue-500 focus:outline-none"
          rows={3}
        />
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Comment
        </button>
      </form>

      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start space-x-3">
            <img
              src={comment.avatar}
              alt={comment.author}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-white text-sm">{comment.author}</span>
                <span className="text-gray-400 text-xs">{formatTimeAgo(comment.timestamp)}</span>
              </div>
              <p className="text-gray-300 text-sm mb-2">{comment.content}</p>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => voteComment(postId, comment.id, 'up')}
                    className={`p-1 rounded hover:bg-gray-700 transition-colors ${
                      comment.userVote === 'up' ? 'text-green-500' : 'text-gray-400'
                    }`}
                  >
                    <ChevronUp size={14} />
                  </button>
                  <span className="text-xs text-gray-400">{comment.upvotes}</span>
                  <button
                    onClick={() => voteComment(postId, comment.id, 'down')}
                    className={`p-1 rounded hover:bg-gray-700 transition-colors ${
                      comment.userVote === 'down' ? 'text-red-500' : 'text-gray-400'
                    }`}
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
