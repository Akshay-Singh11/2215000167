import React from 'react';
import { useTheme } from './Layout';

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'custom';
type IconVariant = 'default' | 'solid' | 'outline' | 'mini';

interface IconProps {
  icon: React.ReactNode;
  size?: IconSize;
  color?: string;
  className?: string;
  variant?: IconVariant;
  customSize?: string;
}

const Icon: React.FC<IconProps> = ({
  icon,
  size = 'md',
  color,
  className = '',
  variant = 'default',
  customSize,
}) => {
  const { darkMode } = useTheme();
  
  // Size classes
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
    '2xl': 'w-10 h-10',
    '3xl': 'w-12 h-12',
    custom: customSize || 'w-5 h-5',
  };
  
  // Get color class
  const getColorClass = () => {
    if (color) return color;
    
    // Default colors based on theme
    return darkMode ? 'text-gray-300' : 'text-gray-700';
  };
  
  return (
    <div 
      className={`
        inline-flex items-center justify-center
        ${sizeClasses[size]}
        ${getColorClass()}
        ${className}
      `}
    >
      {icon}
    </div>
  );
};

export default Icon;
