
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  title?: string;
  timestamp: Date;
  upvotes: number;
  downvotes: number;
  comments: Comment[];
  tags: string[];
  isResearch?: boolean;
  userVote?: 'up' | 'down' | null;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: Date;
  upvotes: number;
  userVote?: 'up' | 'down' | null;
}

export interface Poll {
  id: string;
  author: string;
  question: string;
  options: PollOption[];
  timestamp: Date;
  totalVotes: number;
  userVoted?: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  avatar: string;
  isJoined: boolean;
  category: string;
}

interface SocialContextType {
  posts: Post[];
  polls: Poll[];
  groups: Group[];
  addPost: (post: Omit<Post, 'id' | 'timestamp' | 'upvotes' | 'downvotes' | 'comments'>) => void;
  addComment: (postId: string, comment: Omit<Comment, 'id' | 'timestamp' | 'upvotes'>) => void;
  votePost: (postId: string, voteType: 'up' | 'down') => void;
  voteComment: (postId: string, commentId: string, voteType: 'up' | 'down') => void;
  addPoll: (poll: Omit<Poll, 'id' | 'timestamp' | 'totalVotes'>) => void;
  votePoll: (pollId: string, optionId: string) => void;
  joinGroup: (groupId: string) => void;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
};

const generateId = () => Math.random().toString(36).substr(2, 9);

const initialPosts: Post[] = [
  {
    id: '1',
    author: 'Dr. Sarah Chen',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=6366f1&color=fff',
    title: 'Breakthrough in Quantum Computing',
    content: 'Just published my latest research on quantum error correction. We achieved a 99.9% fidelity rate using our new algorithm. This could be a game-changer for quantum computing scalability.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    upvotes: 45,
    downvotes: 2,
    comments: [
      {
        id: '1',
        author: 'Alex Martinez',
        avatar: 'https://ui-avatars.com/api/?name=Alex+Martinez&background=f59e0b&color=fff',
        content: 'This is incredible! Have you considered the implications for cryptography?',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        upvotes: 12
      }
    ],
    tags: ['quantum', 'research', 'computing'],
    isResearch: true
  },
  {
    id: '2',
    author: 'Prof. Michael Johnson',
    avatar: 'https://ui-avatars.com/api/?name=Michael+Johnson&background=10b981&color=fff',
    content: 'What are your thoughts on the ethical implications of AI in decision-making processes? Should we have stricter regulations?',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    upvotes: 23,
    downvotes: 8,
    comments: [],
    tags: ['ai', 'ethics', 'discussion']
  }
];

const initialPolls: Poll[] = [
  {
    id: '1',
    author: 'Emily Rodriguez',
    question: 'Which field will have the biggest impact on society in the next decade?',
    options: [
      { id: '1', text: 'Artificial Intelligence', votes: 45 },
      { id: '2', text: 'Climate Technology', votes: 32 },
      { id: '3', text: 'Biotechnology', votes: 28 },
      { id: '4', text: 'Space Exploration', votes: 15 }
    ],
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    totalVotes: 120
  }
];

const initialGroups: Group[] = [
  {
    id: '1',
    name: 'AI Research Hub',
    description: 'Discussion and collaboration on artificial intelligence research',
    members: 1247,
    avatar: 'https://ui-avatars.com/api/?name=AI+Research&background=3b82f6&color=fff',
    isJoined: true,
    category: 'Technology'
  },
  {
    id: '2',
    name: 'Climate Science Network',
    description: 'Scientists and researchers working on climate solutions',
    members: 892,
    avatar: 'https://ui-avatars.com/api/?name=Climate+Science&background=10b981&color=fff',
    isJoined: false,
    category: 'Environment'
  },
  {
    id: '3',
    name: 'Philosophy & Ethics',
    description: 'Exploring philosophical questions and ethical debates',
    members: 567,
    avatar: 'https://ui-avatars.com/api/?name=Philosophy&background=8b5cf6&color=fff',
    isJoined: true,
    category: 'Humanities'
  }
];

export const SocialProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [polls, setPolls] = useState<Poll[]>(initialPolls);
  const [groups, setGroups] = useState<Group[]>(initialGroups);

  const addPost = (newPost: Omit<Post, 'id' | 'timestamp' | 'upvotes' | 'downvotes' | 'comments'>) => {
    const post: Post = {
      ...newPost,
      id: generateId(),
      timestamp: new Date(),
      upvotes: 0,
      downvotes: 0,
      comments: []
    };
    setPosts(prev => [post, ...prev]);
  };

  const addComment = (postId: string, newComment: Omit<Comment, 'id' | 'timestamp' | 'upvotes'>) => {
    const comment: Comment = {
      ...newComment,
      id: generateId(),
      timestamp: new Date(),
      upvotes: 0
    };
    
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, comment] }
        : post
    ));
  };

  const votePost = (postId: string, voteType: 'up' | 'down') => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const currentVote = post.userVote;
        let newUpvotes = post.upvotes;
        let newDownvotes = post.downvotes;
        let newUserVote: 'up' | 'down' | null = voteType;

        // Remove previous vote
        if (currentVote === 'up') newUpvotes--;
        if (currentVote === 'down') newDownvotes--;

        // If clicking same vote, remove it
        if (currentVote === voteType) {
          newUserVote = null;
        } else {
          // Add new vote
          if (voteType === 'up') newUpvotes++;
          if (voteType === 'down') newDownvotes++;
        }

        return {
          ...post,
          upvotes: newUpvotes,
          downvotes: newDownvotes,
          userVote: newUserVote
        };
      }
      return post;
    }));
  };

  const voteComment = (postId: string, commentId: string, voteType: 'up' | 'down') => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map(comment => {
            if (comment.id === commentId) {
              const currentVote = comment.userVote;
              let newUpvotes = comment.upvotes;
              let newUserVote: 'up' | 'down' | null = voteType;

              if (currentVote === 'up') newUpvotes--;
              
              if (currentVote === voteType) {
                newUserVote = null;
              } else {
                if (voteType === 'up') newUpvotes++;
              }

              return {
                ...comment,
                upvotes: newUpvotes,
                userVote: newUserVote
              };
            }
            return comment;
          })
        };
      }
      return post;
    }));
  };

  const addPoll = (newPoll: Omit<Poll, 'id' | 'timestamp' | 'totalVotes'>) => {
    const poll: Poll = {
      ...newPoll,
      id: generateId(),
      timestamp: new Date(),
      totalVotes: 0
    };
    setPolls(prev => [poll, ...prev]);
  };

  const votePoll = (pollId: string, optionId: string) => {
    setPolls(prev => prev.map(poll => {
      if (poll.id === pollId && !poll.userVoted) {
        return {
          ...poll,
          options: poll.options.map(option => 
            option.id === optionId 
              ? { ...option, votes: option.votes + 1 }
              : option
          ),
          totalVotes: poll.totalVotes + 1,
          userVoted: optionId
        };
      }
      return poll;
    }));
  };

  const joinGroup = (groupId: string) => {
    setGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          isJoined: !group.isJoined,
          members: group.isJoined ? group.members - 1 : group.members + 1
        };
      }
      return group;
    }));
  };

  return (
    <SocialContext.Provider value={{
      posts,
      polls,
      groups,
      addPost,
      addComment,
      votePost,
      voteComment,
      addPoll,
      votePoll,
      joinGroup
    }}>
      {children}
    </SocialContext.Provider>
  );
};
