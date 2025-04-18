import React from 'react';
import { useTheme } from './Layout';

type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type IconButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'ghost';

interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  disabled?: boolean;
  className?: string;
  label?: string;
  showTooltip?: boolean;
  tooltipPosition?: 'top' | 'right' | 'bottom' | 'left';
  ariaLabel?: string;
  badge?: number | string;
  badgeColor?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  size = 'md',
  variant = 'primary',
  rounded = 'md',
  disabled = false,
  className = '',
  label,
  showTooltip = false,
  tooltipPosition = 'top',
  ariaLabel,
  badge,
  badgeColor,
}) => {
  const { darkMode } = useTheme();
  
  // Size classes
  const sizeClasses = {
    xs: 'p-1',
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
    xl: 'p-3',
  };
  
  // Icon size classes
  const iconSizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  };
  
  // Rounded classes
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };
  
  // Variant classes
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return darkMode
          ? 'bg-indigo-900/20 text-indigo-400 hover:bg-indigo-800/30 active:bg-indigo-700/40'
          : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 active:bg-indigo-200';
      case 'secondary':
        return darkMode
          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 active:bg-gray-600'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300';
      case 'success':
        return darkMode
          ? 'bg-green-900/20 text-green-400 hover:bg-green-800/30 active:bg-green-700/40'
          : 'bg-green-50 text-green-600 hover:bg-green-100 active:bg-green-200';
      case 'danger':
        return darkMode
          ? 'bg-red-900/20 text-red-400 hover:bg-red-800/30 active:bg-red-700/40'
          : 'bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200';
      case 'warning':
        return darkMode
          ? 'bg-amber-900/20 text-amber-400 hover:bg-amber-800/30 active:bg-amber-700/40'
          : 'bg-amber-50 text-amber-600 hover:bg-amber-100 active:bg-amber-200';
      case 'info':
        return darkMode
          ? 'bg-blue-900/20 text-blue-400 hover:bg-blue-800/30 active:bg-blue-700/40'
          : 'bg-blue-50 text-blue-600 hover:bg-blue-100 active:bg-blue-200';
      case 'light':
        return darkMode
          ? 'bg-gray-700 text-white hover:bg-gray-600 active:bg-gray-500'
          : 'bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 border border-gray-200';
      case 'dark':
        return darkMode
          ? 'bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-700'
          : 'bg-gray-800 text-white hover:bg-gray-700 active:bg-gray-600';
      case 'ghost':
        return darkMode
          ? 'bg-transparent text-gray-300 hover:bg-gray-800/50 active:bg-gray-700/50'
          : 'bg-transparent text-gray-700 hover:bg-gray-100/50 active:bg-gray-200/50';
      default:
        return darkMode
          ? 'bg-indigo-900/20 text-indigo-400 hover:bg-indigo-800/30 active:bg-indigo-700/40'
          : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 active:bg-indigo-200';
    }
  };
  
  // Tooltip position classes
  const tooltipPositionClasses = {
    top: 'bottom-full mb-2 left-1/2 transform -translate-x-1/2',
    right: 'left-full ml-2 top-1/2 transform -translate-y-1/2',
    bottom: 'top-full mt-2 left-1/2 transform -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 transform -translate-y-1/2',
  };
  
  // Badge position classes
  const badgePositionClass = 'absolute -top-1 -right-1';
  
  return (
    <div className="relative inline-flex">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          inline-flex items-center justify-center
          ${sizeClasses[size]}
          ${roundedClasses[rounded]}
          ${getVariantClasses()}
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
        aria-label={ariaLabel || label || 'Button'}
      >
        <span className={iconSizeClasses[size]}>
          {icon}
        </span>
        
        {label && (
          <span className="ml-2 text-sm font-medium">{label}</span>
        )}
      </button>
      
      {/* Badge */}
      {badge !== undefined && (
        <span 
          className={`
            ${badgePositionClass}
            flex items-center justify-center
            ${size === 'xs' || size === 'sm' ? 'min-w-[14px] h-[14px] text-[10px]' : 'min-w-[18px] h-[18px] text-xs'}
            rounded-full font-medium
            ${badgeColor || (darkMode ? 'bg-red-500 text-white' : 'bg-red-500 text-white')}
          `}
        >
          {badge}
        </span>
      )}
      
      {/* Tooltip */}
      {showTooltip && label && (
        <div 
          className={`
            absolute ${tooltipPositionClasses[tooltipPosition]}
            px-2 py-1 text-xs font-medium
            ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-900 text-white'}
            rounded shadow-lg
            opacity-0 invisible group-hover:opacity-100 group-hover:visible
            transition-opacity duration-200
            whitespace-nowrap
            z-50
          `}
        >
          {label}
          <div 
            className={`
              absolute w-2 h-2 transform rotate-45
              ${darkMode ? 'bg-gray-800' : 'bg-gray-900'}
              ${tooltipPosition === 'top' ? 'top-full -mt-1 left-1/2 -translate-x-1/2' : ''}
              ${tooltipPosition === 'right' ? 'right-full -mr-1 top-1/2 -translate-y-1/2' : ''}
              ${tooltipPosition === 'bottom' ? 'bottom-full -mb-1 left-1/2 -translate-x-1/2' : ''}
              ${tooltipPosition === 'left' ? 'left-full -ml-1 top-1/2 -translate-y-1/2' : ''}
            `}
          />
        </div>
      )}
    </div>
  );
};

export default IconButton;
