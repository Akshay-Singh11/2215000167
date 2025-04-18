import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from './Layout';

interface ActionItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
}

interface FloatingActionButtonProps {
  icon: React.ReactNode;
  items: ActionItem[];
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'small' | 'medium' | 'large';
  color?: string;
  showLabels?: boolean;
  className?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  items,
  position = 'bottom-right',
  size = 'medium',
  color,
  showLabels = true,
  className = '',
}) => {
  const { darkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  
  // Get size dimensions
  const getSizeDimensions = () => {
    switch (size) {
      case 'small':
        return { button: 'w-12 h-12', icon: 'w-5 h-5', item: 'w-10 h-10', itemIcon: 'w-4 h-4' };
      case 'large':
        return { button: 'w-16 h-16', icon: 'w-7 h-7', item: 'w-14 h-14', itemIcon: 'w-6 h-6' };
      case 'medium':
      default:
        return { button: 'w-14 h-14', icon: 'w-6 h-6', item: 'w-12 h-12', itemIcon: 'w-5 h-5' };
    }
  };
  
  // Get position classes
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'left-6 bottom-6';
      case 'top-right':
        return 'right-6 top-6';
      case 'top-left':
        return 'left-6 top-6';
      case 'bottom-right':
      default:
        return 'right-6 bottom-6';
    }
  };
  
  // Get default color based on theme
  const getDefaultColor = () => {
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#6366f1';
    return primaryColor;
  };
  
  // Calculate item positions
  const getItemPosition = (index: number) => {
    const totalItems = items.length;
    const radius = 80; // Distance from main button
    const angleStep = (Math.PI / 2) / (totalItems - 1 || 1);
    const startAngle = Math.PI / 4; // 45 degrees
    
    // Adjust angle based on position
    let angle;
    switch (position) {
      case 'bottom-left':
        angle = startAngle + (index * angleStep);
        return {
          bottom: `${radius * Math.sin(angle)}px`,
          left: `${radius * Math.cos(angle)}px`,
        };
      case 'top-right':
        angle = startAngle + (index * angleStep);
        return {
          top: `${radius * Math.sin(angle)}px`,
          right: `${radius * Math.cos(angle)}px`,
        };
      case 'top-left':
        angle = startAngle + (index * angleStep);
        return {
          top: `${radius * Math.sin(angle)}px`,
          left: `${radius * Math.cos(angle)}px`,
        };
      case 'bottom-right':
      default:
        angle = startAngle + (index * angleStep);
        return {
          bottom: `${radius * Math.sin(angle)}px`,
          right: `${radius * Math.cos(angle)}px`,
        };
    }
  };
  
  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Toggle menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  // Handle item click
  const handleItemClick = (onClick: () => void) => {
    onClick();
    setIsOpen(false);
  };
  
  const { button, icon: iconSize, item, itemIcon } = getSizeDimensions();
  const positionClasses = getPositionClasses();
  const buttonColor = color || getDefaultColor();
  
  return (
    <div 
      ref={buttonRef}
      className={`fixed ${positionClasses} z-50 ${className}`}
    >
      {/* Action items */}
      {items.map((actionItem, index) => (
        <div
          key={index}
          className={`absolute ${item} rounded-full flex items-center justify-center transition-all duration-300 shadow-lg transform ${
            isOpen 
              ? 'scale-100 opacity-100' 
              : 'scale-0 opacity-0'
          }`}
          style={{
            ...getItemPosition(index),
            backgroundColor: actionItem.color || buttonColor,
            transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
          }}
          onClick={() => handleItemClick(actionItem.onClick)}
        >
          <div className={`${itemIcon} text-white`}>
            {actionItem.icon}
          </div>
          
          {/* Label */}
          {showLabels && (
            <div 
              className={`absolute whitespace-nowrap px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                isOpen ? 'opacity-100' : 'opacity-0'
              } ${
                darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
              } shadow-md`}
              style={{
                ...(position.includes('right') 
                  ? { right: '100%', marginRight: '10px' } 
                  : { left: '100%', marginLeft: '10px' }),
                transitionDelay: isOpen ? `${(index * 50) + 100}ms` : '0ms',
              }}
            >
              {actionItem.label}
            </div>
          )}
        </div>
      ))}
      
      {/* Main button */}
      <div
        className={`${button} rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-transform duration-300 transform ${
          isOpen ? 'rotate-45' : ''
        }`}
        style={{ backgroundColor: buttonColor }}
        onClick={toggleMenu}
      >
        <div className={`${iconSize} text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default FloatingActionButton;
