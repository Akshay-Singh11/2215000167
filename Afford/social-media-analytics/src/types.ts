// User type definition
export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
}

// Post type definition
export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
  createdAt: string;
}

// Comment type definition
export interface Comment {
  id: number;
  postId: number;
  userId: number;
  body: string;
  createdAt: string;
  name?: string; // Optional field for compatibility with JSONPlaceholder API
  email?: string; // Optional field for compatibility with JSONPlaceholder API
}

// Notification type definition
export interface Notification {
  id: number;
  title: string;
  time: string;
  read: boolean;
}

// Theme type definition
export interface Theme {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  isDark: boolean;
}
