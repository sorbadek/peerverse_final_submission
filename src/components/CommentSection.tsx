
import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Heart, Reply } from 'lucide-react';
import { useSocial, Comment } from './SocialContext';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

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
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  return (
    <div className="space-y-4 mt-4 pt-4 border-t border-gray-800">
      <form onSubmit={handleSubmitComment} className="flex items-start space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://ui-avatars.com/api/?name=Current+User&background=6366f1&color=fff" />
          <AvatarFallback>CU</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="min-h-[60px] bg-gray-900 border-gray-700 text-white resize-none"
            rows={2}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!newComment.trim()}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Comment
            </Button>
          </div>
        </div>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.avatar} alt={comment.author} />
              <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="bg-gray-900 rounded-2xl px-4 py-3">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold text-white text-sm">{comment.author}</span>
                  <span className="text-gray-400 text-xs">{formatTimeAgo(comment.timestamp)}</span>
                </div>
                <p className="text-gray-200 text-sm leading-relaxed">{comment.content}</p>
              </div>
              <div className="flex items-center space-x-4 mt-2 px-2">
                <button
                  onClick={() => voteComment(postId, comment.id, 'up')}
                  className={`flex items-center space-x-1 text-xs transition-colors ${
                    comment.userVote === 'up' ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart size={14} className={comment.userVote === 'up' ? 'fill-current' : ''} />
                  <span>{comment.upvotes}</span>
                </button>
                <button className="flex items-center space-x-1 text-xs text-gray-400 hover:text-white transition-colors">
                  <Reply size={14} />
                  <span>Reply</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
