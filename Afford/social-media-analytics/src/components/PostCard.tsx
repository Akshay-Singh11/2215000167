import React, { useState, useEffect } from 'react';
import { PostWithComments } from '../types';
import { getRandomAvatar, getRandomPostImage } from '../utils/imageUtils';
import { ChatBubbleLeftIcon, HeartIcon, ArrowPathIcon, ShareIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, FireIcon } from '@heroicons/react/24/solid';
import { useTheme } from './Layout';

interface PostCardProps {
  post: PostWithComments;
  showComments?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, showComments = false }) => {
  const { darkMode } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Animation effect when component mounts
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
      }
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  // Generate random engagement numbers
  const likesCount = post.id * 7 + 43;
  const sharesCount = Math.floor(post.id * 2.5) + 12;

  // Check if post is trending (has many comments)
  const isTrending = post.comments.length > 15;

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100'} rounded-xl shadow-md overflow-hidden mb-6 transition-all duration-300 hover:shadow-lg border ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transform transition-all duration-500 ease-in-out`}>
      {/* Post header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={post.user?.avatar || getRandomAvatar(post.userId)}
              alt={post.user?.name || `User ${post.userId}`}
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
            />
            <div className="ml-3">
              <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {post.user?.name || `User ${post.userId}`}
              </h3>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {formatDate(post.createdAt)}
              </p>
            </div>
          </div>

          {isTrending && (
            <div className={`flex items-center px-2 py-1 ${darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-600'} rounded-full text-xs font-medium`}>
              <FireIcon className="h-3 w-3 mr-1" />
              Trending
            </div>
          )}
        </div>
      </div>

      {/* Post content */}
      <div className="px-4 pb-3">
        <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>{post.title}</h2>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-3`}>{post.body}</p>
      </div>

      {/* Post image */}
      <div className="relative">
        <img
          src={post.image || getRandomPostImage(post.id)}
          alt={post.title}
          className="w-full h-48 sm:h-64 md:h-80 object-cover"
        />

        {/* Bookmark button */}
        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={`absolute top-3 right-3 p-2 ${darkMode ? 'bg-gray-800 bg-opacity-70' : 'bg-white bg-opacity-70'} backdrop-blur-sm rounded-full shadow-sm hover:bg-opacity-100 transition-all`}
        >
          <BookmarkIcon className={`h-5 w-5 ${isBookmarked ? 'text-indigo-600 fill-indigo-600' : 'text-gray-600'}`} />
        </button>
      </div>

      {/* Engagement stats */}
      <div className={`px-4 py-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'} flex flex-wrap sm:flex-nowrap items-center justify-between gap-y-2`}>
        <div className="flex items-center space-x-3 sm:space-x-6">
          {/* Like button */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center ${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-500 hover:text-indigo-600'} transition-colors`}
          >
            {isLiked ? (
              <HeartIconSolid className="h-5 w-5 text-red-500 mr-1.5" />
            ) : (
              <HeartIcon className="h-5 w-5 mr-1.5" />
            )}
            <span className="text-sm font-medium">{isLiked ? likesCount + 1 : likesCount}</span>
          </button>

          {/* Comments button */}
          <button
            onClick={() => showComments && setIsExpanded(!isExpanded)}
            className={`flex items-center ${showComments ? (darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-500 hover:text-indigo-600') : (darkMode ? 'text-gray-400' : 'text-gray-500')} transition-colors`}
          >
            <ChatBubbleLeftIcon className="h-5 w-5 mr-1.5" />
            <span className="text-sm font-medium">{post.comments.length}</span>
          </button>

          {/* Share button */}
          <button className={`flex items-center ${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-500 hover:text-indigo-600'} transition-colors`}>
            <ShareIcon className="h-5 w-5 mr-1.5" />
            <span className="text-sm font-medium">{sharesCount}</span>
          </button>
        </div>

        {/* Refresh button */}
        <button className={`text-gray-400 ${darkMode ? 'hover:text-gray-200' : 'hover:text-gray-600'} transition-colors`}>
          <ArrowPathIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Comments section */}
      {isExpanded && showComments && (
        <div className={`p-4 ${darkMode ? 'bg-gray-700 border-gray-700' : 'bg-gray-50 border-gray-100'} border-t`}>
          <h4 className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-3 flex items-center`}>
            <ChatBubbleLeftIcon className="h-4 w-4 mr-1.5 text-indigo-500" />
            Comments ({post.comments.length})
          </h4>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {post.comments.map((comment) => (
              <div key={comment.id} className={`${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-100'} p-3 rounded-lg shadow-sm border`}>
                <div className="flex items-center mb-2">
                  <img
                    src={getRandomAvatar(comment.userId)}
                    alt={`User ${comment.userId}`}
                    className="w-7 h-7 rounded-full object-cover border border-gray-200"
                  />
                  <div className="ml-2">
                    <span className={`text-xs font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      User {comment.userId}
                    </span>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{Math.floor(Math.random() * 24) + 1}h ago</p>
                  </div>
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{comment.body}</p>

                {/* Comment actions */}
                <div className="mt-2 flex items-center space-x-4">
                  <button className={`text-xs ${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-500 hover:text-indigo-600'} transition-colors flex items-center`}>
                    <HeartIcon className="h-3 w-3 mr-1" />
                    Like
                  </button>
                  <button className={`text-xs ${darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-500 hover:text-indigo-600'} transition-colors flex items-center`}>
                    <ChatBubbleLeftIcon className="h-3 w-3 mr-1" />
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add comment input */}
          <div className="mt-4 flex items-center">
            <img
              src={getRandomAvatar(99)}
              alt="Your avatar"
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
            />
            <div className="flex-1 ml-2">
              <input
                type="text"
                placeholder="Write a comment..."
                className={`w-full px-3 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
