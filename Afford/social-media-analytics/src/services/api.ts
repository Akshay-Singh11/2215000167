import axios from 'axios';
import { User, Post, Comment } from '../types';
import { fetchMockUsers, fetchMockPosts, fetchMockComments } from './mockApi';

// Flag to determine whether to use mock API or real API
const USE_MOCK_API = true; // Set to false when real API is available

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Replace with the actual API base URL
  timeout: 10000,
});

// Cache for storing API responses to minimize API calls
const cache = {
  users: null as User[] | null,
  posts: null as Post[] | null,
  comments: null as Comment[] | null,
  lastFetched: {
    users: 0,
    posts: 0,
    comments: 0,
  },
  // Cache expiration time in milliseconds (5 minutes)
  expirationTime: 5 * 60 * 1000,
};

// Function to check if cache is valid
const isCacheValid = (key: 'users' | 'posts' | 'comments'): boolean => {
  const now = Date.now();
  return (
    cache[key] !== null &&
    now - cache.lastFetched[key] < cache.expirationTime
  );
};

// API functions
export const fetchUsers = async (): Promise<User[]> => {
  if (isCacheValid('users')) {
    return cache.users as User[];
  }

  try {
    let data;
    if (USE_MOCK_API) {
      data = await fetchMockUsers();
    } else {
      const response = await api.get('/users');
      data = response.data;
    }

    cache.users = data;
    cache.lastFetched.users = Date.now();
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const fetchPosts = async (): Promise<Post[]> => {
  if (isCacheValid('posts')) {
    return cache.posts as Post[];
  }

  try {
    let data;
    if (USE_MOCK_API) {
      data = await fetchMockPosts();
    } else {
      const response = await api.get('/posts');
      data = response.data;
    }

    cache.posts = data;
    cache.lastFetched.posts = Date.now();
    return data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const fetchComments = async (): Promise<Comment[]> => {
  if (isCacheValid('comments')) {
    return cache.comments as Comment[];
  }

  try {
    let data;
    if (USE_MOCK_API) {
      data = await fetchMockComments();
    } else {
      const response = await api.get('/comments');
      data = response.data;
    }

    cache.comments = data;
    cache.lastFetched.comments = Date.now();
    return data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

// Function to invalidate cache
export const invalidateCache = (key?: 'users' | 'posts' | 'comments') => {
  if (key) {
    cache[key] = null;
    cache.lastFetched[key] = 0;
  } else {
    cache.users = null;
    cache.posts = null;
    cache.comments = null;
    cache.lastFetched.users = 0;
    cache.lastFetched.posts = 0;
    cache.lastFetched.comments = 0;
  }
};

export default {
  fetchUsers,
  fetchPosts,
  fetchComments,
  invalidateCache,
};
