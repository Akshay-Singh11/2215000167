import React, { memo } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  onRefresh?: () => void;
  refreshing?: boolean;
  refreshButtonText?: string;
  refreshButtonColor?: 'indigo' | 'red' | 'green';
  children?: React.ReactNode;
}

const colorClasses = {
  indigo: 'from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700',
  red: 'from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600',
  green: 'from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600',
};

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon,
  onRefresh,
  refreshing = false,
  refreshButtonText = 'Refresh Data',
  refreshButtonColor = 'indigo',
  children,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-4 md:mb-0">
          <div className="flex items-center">
            {icon && <div className="mr-3">{icon}</div>}
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          </div>
          {description && (
            <p className="text-gray-600 mt-2">{description}</p>
          )}
        </div>
        
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className={`flex items-center px-4 py-2 bg-gradient-to-r ${colorClasses[refreshButtonColor]} text-white rounded-lg transition-all shadow-sm ${refreshing ? 'animate-pulse' : ''}`}
            aria-label={refreshButtonText}
          >
            <ArrowPathIcon className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : refreshButtonText}
          </button>
        )}
      </div>
      
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
};

export default memo(PageHeader);
