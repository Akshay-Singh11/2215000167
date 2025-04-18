import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/solid';
import { useTheme } from './Layout';

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items = [], showHome = true }) => {
  const location = useLocation();
  const { darkMode } = useTheme();
  
  // Generate breadcrumbs based on current path if not provided
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    if (items.length > 0) return items;
    
    const paths = location.pathname.split('/').filter(Boolean);
    if (paths.length === 0) return [];
    
    // Map paths to breadcrumb items
    return paths.map((path, index) => {
      // Format the path name (capitalize, replace hyphens with spaces)
      const name = path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      // Create the full path up to this point
      const fullPath = '/' + paths.slice(0, index + 1).join('/');
      
      return { name, path: fullPath };
    });
  };
  
  const breadcrumbs = getBreadcrumbs();
  
  // Don't render if we're on the home page and there are no custom items
  if (breadcrumbs.length === 0 && location.pathname === '/') return null;
  
  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 text-sm">
        {showHome && (
          <li>
            <div className="flex items-center">
              <Link 
                to="/" 
                className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <HomeIcon className="flex-shrink-0 h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Home</span>
              </Link>
            </div>
          </li>
        )}
        
        {breadcrumbs.map((item, index) => (
          <li key={item.path}>
            <div className="flex items-center">
              <ChevronRightIcon 
                className={`flex-shrink-0 h-4 w-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} 
                aria-hidden="true" 
              />
              <Link
                to={item.path}
                className={`ml-1 ${
                  index === breadcrumbs.length - 1
                    ? darkMode 
                      ? 'text-gray-200 font-medium' 
                      : 'text-gray-700 font-medium'
                    : darkMode 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-500 hover:text-gray-700'
                }`}
                aria-current={index === breadcrumbs.length - 1 ? 'page' : undefined}
              >
                {item.name}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
