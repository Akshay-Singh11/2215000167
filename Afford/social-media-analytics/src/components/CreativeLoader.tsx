import React, { useState, useEffect } from 'react';
import { useTheme } from './Layout';

interface CreativeLoaderProps {
  size?: 'small' | 'medium' | 'large';
  type?: 'pulse' | 'wave' | 'dots' | 'spinner' | 'blocks';
  color?: string;
  text?: string;
  isLoading?: boolean;
  className?: string;
}

const CreativeLoader: React.FC<CreativeLoaderProps> = ({
  size = 'medium',
  type = 'pulse',
  color,
  text,
  isLoading = true,
  className = '',
}) => {
  const { darkMode } = useTheme();
  const [dots, setDots] = useState('.');
  
  // Get size dimensions
  const getSizeDimensions = () => {
    switch (size) {
      case 'small':
        return { width: 40, height: 40, fontSize: 'text-xs' };
      case 'large':
        return { width: 80, height: 80, fontSize: 'text-lg' };
      case 'medium':
      default:
        return { width: 60, height: 60, fontSize: 'text-sm' };
    }
  };
  
  // Get default color based on theme
  const getDefaultColor = () => {
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#6366f1';
    return primaryColor;
  };
  
  // Animate dots for text
  useEffect(() => {
    if (!text || !isLoading) return;
    
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '.';
        return prev + '.';
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, [text, isLoading]);
  
  // If not loading, don't render
  if (!isLoading) return null;
  
  const { width, height, fontSize } = getSizeDimensions();
  const loaderColor = color || getDefaultColor();
  
  // Render different loader types
  const renderLoader = () => {
    switch (type) {
      case 'wave':
        return (
          <div className="flex items-end justify-center h-full space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 bg-current rounded-full animate-wave"
                style={{
                  height: '30%',
                  animationDelay: `${i * 0.1}s`,
                  backgroundColor: loaderColor,
                }}
              />
            ))}
          </div>
        );
        
      case 'dots':
        return (
          <div className="flex space-x-2 justify-center items-center h-full">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-full animate-bounce"
                style={{
                  width: width / 8,
                  height: width / 8,
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '0.6s',
                  backgroundColor: loaderColor,
                }}
              />
            ))}
          </div>
        );
        
      case 'spinner':
        return (
          <div 
            className="rounded-full border-t-2 animate-spin"
            style={{
              width: width * 0.8,
              height: width * 0.8,
              borderWidth: Math.max(2, width / 20),
              borderColor: `${loaderColor} transparent transparent transparent`,
            }}
          />
        );
        
      case 'blocks':
        return (
          <div className="grid grid-cols-3 gap-1">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-sm"
                style={{
                  width: width / 6,
                  height: width / 6,
                  animationDelay: `${i * 0.1}s`,
                  backgroundColor: loaderColor,
                  opacity: 0.7,
                }}
              />
            ))}
          </div>
        );
        
      case 'pulse':
      default:
        return (
          <div 
            className="rounded-full animate-ping"
            style={{
              width: width * 0.5,
              height: width * 0.5,
              backgroundColor: loaderColor,
              opacity: 0.7,
            }}
          />
        );
    }
  };
  
  return (
    <div 
      className={`flex flex-col items-center justify-center ${className}`}
      style={{ width, height }}
    >
      {renderLoader()}
      
      {text && (
        <div className={`mt-4 ${fontSize} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {text}{dots}
        </div>
      )}
    </div>
  );
};

export default CreativeLoader;
