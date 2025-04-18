import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Post, Comment, UserWithStats, PostWithComments } from '../types';
import { fetchUsers, fetchPosts, fetchComments } from '../services/api';

// Define the context type
interface SocialMediaContextType {
  users: User[];
  posts: Post[];
  comments: Comment[];
  loading: boolean;
  error: string | null;
  topUsers: UserWithStats[];
  trendingPosts: PostWithComments[];
  feedPosts: PostWithComments[];
  refreshData: () => Promise<void>;
}

// Create the context with default values
const SocialMediaContext = createContext<SocialMediaContextType>({
  users: [],
  posts: [],
  comments: [],
  loading: false,
  error: null,
  topUsers: [],
  trendingPosts: [],
  feedPosts: [],
  refreshData: async () => {},
});

// Custom hook to use the context
export const useSocialMedia = () => useContext(SocialMediaContext);

// Provider component
interface SocialMediaProviderProps {
  children: ReactNode;
}

export const SocialMediaProvider: React.FC<SocialMediaProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [topUsers, setTopUsers] = useState<UserWithStats[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<PostWithComments[]>([]);
  const [feedPosts, setFeedPosts] = useState<PostWithComments[]>([]);

  // Function to fetch all data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersData, postsData, commentsData] = await Promise.all([
        fetchUsers(),
        fetchPosts(),
        fetchComments(),
      ]);
      
      setUsers(usersData);
      setPosts(postsData);
      setComments(commentsData);
      
      // Process the data
      processData(usersData, postsData, commentsData);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data. Please try again later.');
      setLoading(false);
      console.error('Error fetching data:', err);
    }
  };

  // Function to process the data and calculate derived values
  const processData = (usersData: User[], postsData: Post[], commentsData: Comment[]) => {
    // Calculate top users (users with most commented posts)
    const userStats = usersData.map(user => {
      const userPosts = postsData.filter(post => post.userId === user.id);
      const postIds = userPosts.map(post => post.id);
      const userComments = commentsData.filter(comment => postIds.includes(comment.postId));
      
      return {
        ...user,
        postCount: userPosts.length,
        commentCount: userComments.length,
      };
    });
    
    // Sort users by comment count and get top 5
    const sortedUsers = [...userStats].sort((a, b) => b.commentCount - a.commentCount);
    setTopUsers(sortedUsers.slice(0, 5));
    
    // Calculate trending posts (posts with maximum comments)
    const postsWithComments = postsData.map(post => {
      const postComments = commentsData.filter(comment => comment.postId === post.id);
      const postUser = usersData.find(user => user.id === post.userId);
      
      return {
        ...post,
        comments: postComments,
        user: postUser,
      };
    });
    
    // Find the maximum comment count
    const maxCommentCount = Math.max(...postsWithComments.map(post => post.comments.length));
    
    // Get all posts with the maximum comment count
    const trending = postsWithComments.filter(post => post.comments.length === maxCommentCount);
    setTrendingPosts(trending);
    
    // Sort posts by creation date for the feed (newest first)
    const sortedPosts = [...postsWithComments].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setFeedPosts(sortedPosts);
  };

  // Function to refresh data
  const refreshData = async () => {
    await fetchData();
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
    
    // Set up polling for real-time updates (every 30 seconds)
    const intervalId = setInterval(() => {
      fetchData();
    }, 30000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Context value
  const value = {
    users,
    posts,
    comments,
    loading,
    error,
    topUsers,
    trendingPosts,
    feedPosts,
    refreshData,
  };

  return (
    <SocialMediaContext.Provider value={value}>
      {children}
    </SocialMediaContext.Provider>
  );
};
