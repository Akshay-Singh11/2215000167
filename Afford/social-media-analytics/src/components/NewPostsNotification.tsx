import React, { useState, useEffect } from 'react';
import { ArrowUpIcon } from '@heroicons/react/24/solid';
import { useTheme } from './Layout';

interface NewPostsNotificationProps {
  count: number;
  onClick: () => void;
  autoHide?: boolean;
  hideAfter?: number;
  className?: string;
}

const NewPostsNotification: React.FC<NewPostsNotificationProps> = ({
  count,
  onClick,
  autoHide = true,
  hideAfter = 5000,
  className = '',
}) => {
  const { darkMode } = useTheme();
  const [isVisible, setIsVisible] = useState(count > 0);
  
  // Auto-hide notification after specified time
  useEffect(() => {
    if (count > 0) {
      setIsVisible(true);
      
      if (autoHide) {
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, hideAfter);
        
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [count, autoHide, hideAfter]);
  
  // Don't render if there are no new posts or notification is hidden
  if (count === 0 || !isVisible) return null;
  
  return (
    <button
      onClick={() => {
        onClick();
        setIsVisible(false);
      }}
      className={`fixed z-30 left-1/2 transform -translate-x-1/2 flex items-center justify-center space-x-2 px-4 py-2 rounded-full shadow-lg transition-all duration-300 animate-bounce ${
        darkMode 
          ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
          : 'bg-white text-indigo-600 hover:bg-gray-50 border border-indigo-100'
      } ${className}`}
      style={{ top: '5rem' }}
    >
      <ArrowUpIcon className="h-4 w-4" />
      <span className="font-medium">
        {count} new {count === 1 ? 'post' : 'posts'}
      </span>
    </button>
  );
};

export default NewPostsNotification;
