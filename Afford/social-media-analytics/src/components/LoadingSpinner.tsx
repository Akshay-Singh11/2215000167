import React, { memo } from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'indigo' | 'blue' | 'red' | 'green' | 'gray';
  className?: string;
}

// Size and color mappings for better reusability
const sizeClasses = {
  small: 'h-4 w-4 border-2',
  medium: 'h-8 w-8 border-2',
  large: 'h-12 w-12 border-3',
};

const colorClasses = {
  indigo: 'border-indigo-500',
  blue: 'border-blue-500',
  red: 'border-red-500',
  green: 'border-green-500',
  gray: 'border-gray-500',
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'indigo',
  className = ''
}) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-t-0 border-r-0 ${sizeClasses[size]} ${colorClasses[color]}`}
        aria-label="Loading"
        role="status"
      ></div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(LoadingSpinner);
