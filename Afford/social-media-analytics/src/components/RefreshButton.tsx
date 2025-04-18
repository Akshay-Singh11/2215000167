import React, { useState, useEffect } from 'react';
import { ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useTheme } from './Layout';

interface RefreshButtonProps {
  onClick: () => void;
  isRefreshing?: boolean;
  label?: string;
  refreshingLabel?: string;
  successLabel?: string;
  variant?: 'primary' | 'secondary' | 'minimal';
  size?: 'small' | 'medium' | 'large';
  showSuccessState?: boolean;
  className?: string;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({
  onClick,
  isRefreshing = false,
  label = 'Refresh',
  refreshingLabel = 'Refreshing...',
  successLabel = 'Updated!',
  variant = 'primary',
  size = 'medium',
  showSuccessState = true,
  className = '',
}) => {
  const { darkMode } = useTheme();
  const [showSuccess, setShowSuccess] = useState(false);
  const [rotation, setRotation] = useState(0);
  
  // Handle success state after refreshing
  useEffect(() => {
    if (!isRefreshing && showSuccessState && !showSuccess) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isRefreshing, showSuccessState]);
  
  // Handle rotation animation
  useEffect(() => {
    if (isRefreshing) {
      const interval = setInterval(() => {
        setRotation(prev => (prev + 30) % 360);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setRotation(0);
    }
  }, [isRefreshing]);
  
  // Size mappings
  const sizeMap = {
    small: {
      button: 'px-2 py-1 text-xs',
      icon: 'h-3.5 w-3.5 mr-1',
    },
    medium: {
      button: 'px-3 py-1.5 text-sm',
      icon: 'h-4 w-4 mr-1.5',
    },
    large: {
      button: 'px-4 py-2 text-base',
      icon: 'h-5 w-5 mr-2',
    },
  };
  
  // Variant mappings
  const variantMap = {
    primary: {
      default: `bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-sm`,
      refreshing: `bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm opacity-90`,
      success: `bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm`,
    },
    secondary: {
      default: darkMode 
        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
        : 'bg-gray-100 hover:bg-gray-200 text-gray-700',
      refreshing: darkMode 
        ? 'bg-gray-700 text-white opacity-90' 
        : 'bg-gray-100 text-gray-700 opacity-90',
      success: darkMode 
        ? 'bg-gray-700 text-green-400' 
        : 'bg-gray-100 text-green-600',
    },
    minimal: {
      default: darkMode 
        ? 'bg-transparent hover:bg-gray-700 text-gray-300' 
        : 'bg-transparent hover:bg-gray-100 text-gray-600',
      refreshing: darkMode 
        ? 'bg-transparent text-gray-400' 
        : 'bg-transparent text-gray-500',
      success: darkMode 
        ? 'bg-transparent text-green-400' 
        : 'bg-transparent text-green-600',
    },
  };
  
  // Determine current state
  const currentState = showSuccess 
    ? 'success' 
    : isRefreshing 
      ? 'refreshing' 
      : 'default';
  
  return (
    <button
      onClick={!isRefreshing && !showSuccess ? onClick : undefined}
      disabled={isRefreshing || showSuccess}
      className={`flex items-center justify-center rounded-lg transition-all duration-300 ${sizeMap[size].button} ${variantMap[variant][currentState]} ${className}`}
      aria-label={isRefreshing ? refreshingLabel : label}
    >
      {showSuccess ? (
        <>
          <CheckCircleIcon className={`${sizeMap[size].icon}`} />
          <span>{successLabel}</span>
        </>
      ) : (
        <>
          <ArrowPathIcon 
            className={`${sizeMap[size].icon} transition-transform duration-100 ease-in-out`} 
            style={{ transform: `rotate(${rotation}deg)` }} 
          />
          <span>{isRefreshing ? refreshingLabel : label}</span>
        </>
      )}
    </button>
  );
};

export default RefreshButton;
