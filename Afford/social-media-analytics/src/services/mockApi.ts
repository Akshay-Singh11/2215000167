import { User, Post, Comment } from '../types';

// Mock data for testing
const mockUsers: User[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  username: `user${i + 1}`,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
}));

const mockPosts: Post[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  userId: Math.floor(Math.random() * 10) + 1, // Random user ID between 1 and 10
  title: `Post ${i + 1} Title`,
  body: `This is the body of post ${i + 1}. It contains some text that represents the content of the post.`,
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000)).toISOString(), // Random date within the last 10 days
}));

const mockComments: Comment[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  postId: Math.floor(Math.random() * 20) + 1, // Random post ID between 1 and 20
  userId: Math.floor(Math.random() * 10) + 1, // Random user ID between 1 and 10
  body: `This is comment ${i + 1}. It's a response to the post.`,
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 5 * 24 * 60 * 60 * 1000)).toISOString(), // Random date within the last 5 days
}));

// Add more comments to specific posts to create trending posts
for (let i = 0; i < 15; i++) {
  mockComments.push({
    id: 51 + i,
    postId: 1, // Add more comments to post 1 to make it trending
    userId: Math.floor(Math.random() * 10) + 1,
    body: `This is an additional comment on the trending post. Comment number ${i + 1}.`,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 2 * 24 * 60 * 60 * 1000)).toISOString(), // Random date within the last 2 days
  });
}

// Mock API functions with delay to simulate network requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchMockUsers = async (): Promise<User[]> => {
  await delay(500); // Simulate network delay
  return [...mockUsers];
};

export const fetchMockPosts = async (): Promise<Post[]> => {
  await delay(700); // Simulate network delay
  return [...mockPosts];
};

export const fetchMockComments = async (): Promise<Comment[]> => {
  await delay(600); // Simulate network delay
  return [...mockComments];
};

export default {
  fetchMockUsers,
  fetchMockPosts,
  fetchMockComments,
};
