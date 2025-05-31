
import React, { useState } from 'react';
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal } from 'lucide-react';
import { useSocial } from './SocialContext';
import CommentSection from './CommentSection';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

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
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  const formatScore = (upvotes: number, downvotes: number) => {
    const score = upvotes - downvotes;
    if (score >= 1000) return `${(score / 1000).toFixed(1)}k`;
    return score.toString();
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {posts.map((post) => (
        <Card key={post.id} className="bg-gray-900 border-gray-800 overflow-hidden">
          <CardContent className="p-0">
            {/* Post Header */}
            <div className="flex items-center justify-between p-4 pb-3">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={post.avatar} alt={post.author} />
                  <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-white text-sm">{post.author}</h3>
                    {post.isResearch && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                        Research
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-xs">{formatTimeAgo(post.timestamp)}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <MoreHorizontal size={20} />
              </Button>
            </div>

            {/* Post Content */}
            <div className="px-4 pb-3">
              {post.title && (
                <h4 className="text-lg font-semibold text-white mb-2 leading-tight">{post.title}</h4>
              )}
              <p className="text-gray-200 leading-relaxed mb-3">{post.content}</p>
              
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-blue-400 text-sm hover:text-blue-300 cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Engagement Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800">
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => votePost(post.id, 'up')}
                  className={`flex items-center space-x-2 transition-colors ${
                    post.userVote === 'up' 
                      ? 'text-red-500' 
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart size={20} className={post.userVote === 'up' ? 'fill-current' : ''} />
                  <span className="text-sm font-medium">
                    {formatScore(post.upvotes, post.downvotes)}
                  </span>
                </button>
                
                <button
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                >
                  <MessageCircle size={20} />
                  <span className="text-sm font-medium">{post.comments.length}</span>
                </button>
                
                <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                  <Share size={20} />
                </button>
              </div>
              
              <button className="text-gray-400 hover:text-white transition-colors">
                <Bookmark size={20} />
              </button>
            </div>
            
            {/* Comments Section */}
            {expandedComments.includes(post.id) && (
              <div className="px-4 pb-4">
                <CommentSection postId={post.id} comments={post.comments} />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SocialFeed;
