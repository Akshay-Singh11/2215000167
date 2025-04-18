import React, { useState, useEffect } from 'react';
import { useTheme } from './Layout';

interface LiveFeedIndicatorProps {
  pulseColor?: 'red' | 'green' | 'indigo';
  size?: 'small' | 'medium' | 'large';
  label?: string;
  showLabel?: boolean;
  className?: string;
}

const LiveFeedIndicator: React.FC<LiveFeedIndicatorProps> = ({
  pulseColor = 'red',
  size = 'medium',
  label = 'LIVE',
  showLabel = true,
  className = '',
}) => {
  const { darkMode } = useTheme();
  const [isVisible, setIsVisible] = useState(true);
  
  // Simulate network activity with blinking
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(prev => !prev);
      setTimeout(() => setIsVisible(true), 200);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Size mappings
  const sizeMap = {
    small: {
      dot: 'h-2 w-2',
      container: 'text-xs py-0.5 px-1.5',
    },
    medium: {
      dot: 'h-2.5 w-2.5',
      container: 'text-xs py-1 px-2',
    },
    large: {
      dot: 'h-3 w-3',
      container: 'text-sm py-1 px-2.5',
    },
  };
  
  // Color mappings
  const colorMap = {
    red: {
      dot: 'bg-red-500',
      pulse: 'bg-red-500',
      text: darkMode ? 'text-red-400' : 'text-red-600',
      bg: darkMode ? 'bg-red-900/20' : 'bg-red-50',
      border: darkMode ? 'border-red-800/30' : 'border-red-100',
    },
    green: {
      dot: 'bg-green-500',
      pulse: 'bg-green-500',
      text: darkMode ? 'text-green-400' : 'text-green-600',
      bg: darkMode ? 'bg-green-900/20' : 'bg-green-50',
      border: darkMode ? 'border-green-800/30' : 'border-green-100',
    },
    indigo: {
      dot: 'bg-indigo-500',
      pulse: 'bg-indigo-500',
      text: darkMode ? 'text-indigo-400' : 'text-indigo-600',
      bg: darkMode ? 'bg-indigo-900/20' : 'bg-indigo-50',
      border: darkMode ? 'border-indigo-800/30' : 'border-indigo-100',
    },
  };
  
  return (
    <div className={`inline-flex items-center rounded-full border ${colorMap[pulseColor].border} ${colorMap[pulseColor].bg} ${sizeMap[size].container} ${className}`}>
      <div className="relative flex">
        <div className={`${sizeMap[size].dot} rounded-full ${colorMap[pulseColor].dot} ${isVisible ? 'opacity-100' : 'opacity-30'} transition-opacity duration-200`}></div>
        <div className={`absolute inset-0 ${sizeMap[size].dot} rounded-full ${colorMap[pulseColor].pulse} animate-ping opacity-75`}></div>
      </div>
      {showLabel && (
        <span className={`ml-1.5 font-semibold ${colorMap[pulseColor].text}`}>
          {label}
        </span>
      )}
    </div>
  );
};

export default LiveFeedIndicator;
