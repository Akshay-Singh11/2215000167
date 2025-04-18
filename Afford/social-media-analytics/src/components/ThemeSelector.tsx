import React, { useState, useEffect, useRef } from 'react';
import { SunIcon, MoonIcon, SwatchIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useTheme } from './Layout';

interface ThemeOption {
  name: string;
  value: string;
  primaryColor: string;
  secondaryColor: string;
  isDark: boolean;
}

interface ThemeSelectorProps {
  onThemeChange?: (theme: ThemeOption) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onThemeChange }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>(
    darkMode ? themes[1] : themes[0]
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Available themes
  const themes: ThemeOption[] = [
    {
      name: 'Light',
      value: 'light',
      primaryColor: '#6366f1', // indigo-500
      secondaryColor: '#a855f7', // purple-500
      isDark: false,
    },
    {
      name: 'Dark',
      value: 'dark',
      primaryColor: '#818cf8', // indigo-400
      secondaryColor: '#c084fc', // purple-400
      isDark: true,
    },
    {
      name: 'Ocean',
      value: 'ocean',
      primaryColor: '#0ea5e9', // sky-500
      secondaryColor: '#06b6d4', // cyan-500
      isDark: false,
    },
    {
      name: 'Forest',
      value: 'forest',
      primaryColor: '#10b981', // emerald-500
      secondaryColor: '#059669', // emerald-600
      isDark: false,
    },
    {
      name: 'Sunset',
      value: 'sunset',
      primaryColor: '#f97316', // orange-500
      secondaryColor: '#ef4444', // red-500
      isDark: false,
    },
    {
      name: 'Midnight',
      value: 'midnight',
      primaryColor: '#3b82f6', // blue-500
      secondaryColor: '#6366f1', // indigo-500
      isDark: true,
    },
  ];

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

  // Handle theme selection
  const handleThemeSelect = (theme: ThemeOption) => {
    setSelectedTheme(theme);
    setIsOpen(false);
    
    // Toggle dark mode if needed
    if (theme.isDark !== darkMode) {
      toggleDarkMode();
    }
    
    // Call the onThemeChange callback if provided
    if (onThemeChange) {
      onThemeChange(theme);
    }
    
    // Apply theme colors to CSS variables
    document.documentElement.style.setProperty('--color-primary', theme.primaryColor);
    document.documentElement.style.setProperty('--color-secondary', theme.secondaryColor);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full flex items-center justify-center transition-colors ${
          darkMode
            ? 'text-gray-300 hover:text-white hover:bg-gray-700'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
        }`}
        aria-label="Select theme"
      >
        <SwatchIcon className="h-5 w-5" />
      </button>
      
      {isOpen && (
        <div 
          className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          } animate-fade-in`}
          style={{ animationDuration: '0.2s' }}
        >
          <div className={`px-3 py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>
              Select Theme
            </h3>
          </div>
          
          <div className="py-1">
            {themes.map((theme) => (
              <button
                key={theme.value}
                onClick={() => handleThemeSelect(theme)}
                className={`flex items-center justify-between w-full px-4 py-2 text-sm ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                } ${selectedTheme.value === theme.value ? 'bg-opacity-10' : ''}`}
              >
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-3 flex-shrink-0"
                    style={{ 
                      background: `linear-gradient(to right, ${theme.primaryColor}, ${theme.secondaryColor})` 
                    }}
                  ></div>
                  <span className={darkMode ? 'text-gray-200' : 'text-gray-700'}>
                    {theme.name}
                  </span>
                </div>
                
                {selectedTheme.value === theme.value && (
                  <CheckIcon className="h-4 w-4 text-green-500" />
                )}
              </button>
            ))}
          </div>
          
          <div className={`px-3 py-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex justify-between">
              <button
                onClick={() => {
                  if (darkMode) {
                    toggleDarkMode();
                    handleThemeSelect(themes[0]);
                  }
                }}
                className={`flex items-center text-xs px-2 py-1 rounded ${
                  !darkMode 
                    ? 'bg-amber-100 text-amber-800' 
                    : darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <SunIcon className="h-3 w-3 mr-1" />
                Light
              </button>
              
              <button
                onClick={() => {
                  if (!darkMode) {
                    toggleDarkMode();
                    handleThemeSelect(themes[1]);
                  }
                }}
                className={`flex items-center text-xs px-2 py-1 rounded ${
                  darkMode 
                    ? 'bg-indigo-900/30 text-indigo-300' 
                    : darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <MoonIcon className="h-3 w-3 mr-1" />
                Dark
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
