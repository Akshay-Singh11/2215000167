// Function to get a random avatar image for users
export const getRandomAvatar = (userId: number): string => {
  // We'll use a deterministic approach based on user ID to ensure consistency
  const avatarIndex = userId % 10; // Assuming we have 10 avatar images
  return `https://randomuser.me/api/portraits/${userId % 2 === 0 ? 'men' : 'women'}/${avatarIndex + 1}.jpg`;
};

// Function to get a random image for posts
export const getRandomPostImage = (postId: number): string => {
  // We'll use a deterministic approach based on post ID to ensure consistency
  const imageIndex = postId % 20; // Assuming we have 20 post images
  return `https://picsum.photos/seed/${postId}/800/400`;
};

// Function to get a random color for UI elements
export const getRandomColor = (id: number): string => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-cyan-500',
  ];
  
  return colors[id % colors.length];
};
