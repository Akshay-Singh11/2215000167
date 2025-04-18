import React, { useState, useEffect } from 'react';
import { UserWithStats } from '../types';
import { getRandomAvatar, getRandomColor } from '../utils/imageUtils';
import { ChatBubbleLeftRightIcon, DocumentTextIcon, StarIcon } from '@heroicons/react/24/solid';
import { useTheme } from './Layout';

interface UserCardProps {
  user: UserWithStats;
  rank: number;
}

const UserCard: React.FC<UserCardProps> = ({ user, rank }) => {
  const { darkMode } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  // Animation effect when component mounts
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100 * rank); // Staggered animation
    return () => clearTimeout(timer);
  }, [rank]);

  // Calculate engagement score (just for UI purposes)
  const engagementScore = Math.round((user.commentCount / (user.postCount || 1)) * 10) / 10;

  // Get badge based on rank
  const getBadgeColor = (rank: number) => {
    switch(rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-300 border-yellow-500';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-200 border-gray-400';
      case 3: return 'bg-gradient-to-r from-amber-600 to-amber-500 border-amber-700';
      default: return 'bg-gradient-to-r from-indigo-500 to-purple-500 border-indigo-600';
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] border ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transform transition-all duration-500 ease-in-out`}>
      <div className="relative">
        {/* Banner background */}
        <div className={`h-24 ${getRandomColor(user.id)} opacity-90`}></div>

        {/* User avatar */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-10">
          <div className="relative">
            <img
              src={user.avatar || getRandomAvatar(user.id)}
              alt={user.name}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 ${darkMode ? 'border-gray-800' : 'border-white'} shadow-md`}
            />
            <div className={`absolute -top-2 -right-2 ${getBadgeColor(rank)} text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm`}>
              {rank}
            </div>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="pt-10 sm:pt-12 p-3 sm:p-4 text-center">
        <h3 className={`text-base sm:text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{user.name}</h3>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>@{user.username}</p>

        {/* Engagement score */}
        <div className={`mt-3 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-50 text-indigo-700'}`}>
          <StarIcon className="w-3 h-3 mr-1" />
          Engagement Score: {engagementScore}
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
          <div className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'} p-2 sm:p-3 rounded-lg border`}>
            <div className="flex items-center justify-center mb-1">
              <DocumentTextIcon className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-500'} mr-1`} />
              <p className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Posts</p>
            </div>
            <p className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{user.postCount}</p>
          </div>
          <div className={`${darkMode ? 'bg-indigo-900/20 border-indigo-800/30' : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100'} p-2 sm:p-3 rounded-lg border`}>
            <div className="flex items-center justify-center mb-1">
              <ChatBubbleLeftRightIcon className="w-4 h-4 text-indigo-500 mr-1" />
              <p className="text-xs font-medium text-indigo-500">Comments</p>
            </div>
            <p className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>{user.commentCount}</p>
          </div>
        </div>

        {/* View profile button */}
        <button className="mt-3 sm:mt-4 w-full py-1.5 sm:py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors shadow-sm">
          View Full Profile
        </button>
      </div>
    </div>
  );
};

export default UserCard;
