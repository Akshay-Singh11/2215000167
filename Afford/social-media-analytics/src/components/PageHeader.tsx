import React, { memo } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useTheme } from './Layout';
import RefreshButton from './RefreshButton';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  onRefresh?: () => void;
  refreshing?: boolean;
  refreshButtonText?: string;
  refreshButtonColor?: 'indigo' | 'red' | 'green';
  refreshButtonVariant?: 'primary' | 'secondary' | 'minimal';
  showLiveIndicator?: boolean;
  liveIndicatorColor?: 'red' | 'green' | 'indigo';
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
  refreshButtonVariant = 'primary',
  showLiveIndicator = false,
  liveIndicatorColor = 'red',
  children,
}) => {
  const { darkMode } = useTheme();
  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100'} rounded-xl shadow-sm p-6 mb-6 border`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-4 md:mb-0">
          <div className="flex items-center">
            {icon && <div className="mr-3">{icon}</div>}
            <div className="flex items-center">
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} ${showLiveIndicator ? 'mr-3' : ''}`}>{title}</h1>
              {showLiveIndicator && (
                <div className="flex-shrink-0">
                  <span className={`inline-flex h-3 w-3 rounded-full ${liveIndicatorColor === 'red' ? 'bg-red-500' : liveIndicatorColor === 'green' ? 'bg-green-500' : 'bg-indigo-500'} animate-pulse`}></span>
                </div>
              )}
            </div>
          </div>
          {description && (
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>{description}</p>
          )}
        </div>

        {onRefresh && (
          <RefreshButton
            onClick={onRefresh}
            isRefreshing={refreshing}
            label={refreshButtonText}
            variant={refreshButtonVariant}
            size="medium"
          />
        )}
      </div>

      {children && <div className="mt-6">{children}</div>}
    </div>
  );
};

export default memo(PageHeader);
