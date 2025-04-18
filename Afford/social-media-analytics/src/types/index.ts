// User type
export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  avatar?: string; // We'll use random images for avatars
}

// Post type
export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
  createdAt: string;
  image?: string; // We'll use random images for posts
}

// Comment type
export interface Comment {
  id: number;
  postId: number;
  userId: number;
  body: string;
  createdAt: string;
}

// User with post and comment counts
export interface UserWithStats extends User {
  postCount: number;
  commentCount: number;
}

// Post with comments
export interface PostWithComments extends Post {
  comments: Comment[];
  user?: User;
}
