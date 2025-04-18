import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from './Layout';

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
  width?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ 
  trigger, 
  children, 
  align = 'right',
  width = 'w-48'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { darkMode } = useTheme();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown when pressing escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
      >
        {trigger}
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div 
          className={`absolute z-50 mt-2 ${width} rounded-md shadow-lg ${align === 'right' ? 'right-0' : 'left-0'} origin-top-${align} animate-fade-in`}
          style={{ animationDuration: '0.15s' }}
        >
          <div className={`rounded-md ring-1 ring-black ring-opacity-5 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
            <div className="py-1">
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;

// Dropdown item component for consistent styling
export const DropdownItem: React.FC<{
  icon?: React.ReactNode;
  onClick?: () => void;
  children: React.ReactNode;
  danger?: boolean;
}> = ({ icon, onClick, children, danger = false }) => {
  const { darkMode } = useTheme();
  
  return (
    <button
      className={`flex items-center w-full px-4 py-2 text-sm ${
        danger 
          ? 'text-red-600 hover:bg-red-50 hover:text-red-700' 
          : darkMode 
            ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
      }`}
      onClick={onClick}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

// Dropdown divider component
export const DropdownDivider: React.FC = () => {
  const { darkMode } = useTheme();
  
  return (
    <div className={`my-1 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
  );
};
