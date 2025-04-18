import React, { useState } from 'react';
import { useTheme } from './Layout';
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface ApiResponseViewerProps {
  data: any;
  status: 'success' | 'error' | 'loading' | 'idle';
  error?: string | null;
  responseTime?: number | null;
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  onRefresh?: () => void;
}

const ApiResponseViewer: React.FC<ApiResponseViewerProps> = ({
  data,
  status,
  error,
  responseTime,
  endpoint,
  method = 'GET',
  onRefresh,
}) => {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'preview' | 'raw'>('preview');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  // Method color mapping
  const methodColors = {
    GET: darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700',
    POST: darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700',
    PUT: darkMode ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-700',
    DELETE: darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700',
    PATCH: darkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-700',
  };

  // Toggle item expansion
  const toggleItem = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Format JSON for display
  const formatJson = (data: any) => {
    return JSON.stringify(data, null, 2);
  };

  // Render a preview of the data
  const renderPreview = () => {
    if (!data || !Array.isArray(data)) {
      return (
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
          No data to display
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {data.slice(0, 10).map((item, index) => (
          <div 
            key={item.id || index}
            className={`p-4 rounded-lg transition-all duration-200 cursor-pointer ${
              darkMode 
                ? expandedItems[item.id] ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-750' 
                : expandedItems[item.id] ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'
            } border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
            onClick={() => toggleItem(item.id)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  {item.id}
                </div>
                <div>
                  <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {item.name || item.title || `Item ${item.id}`}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {item.email || item.body?.substring(0, 50) || ''}
                  </p>
                </div>
              </div>
              <svg 
                className={`h-5 w-5 transform transition-transform ${
                  expandedItems[item.id] ? 'rotate-180' : ''
                } ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {expandedItems[item.id] && (
              <div className={`mt-3 p-3 rounded-lg text-sm overflow-auto max-h-60 ${
                darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-800'
              }`}>
                <pre className="whitespace-pre-wrap break-words">{formatJson(item)}</pre>
              </div>
            )}
          </div>
        ))}
        
        {data.length > 10 && (
          <div className={`text-center p-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Showing 10 of {data.length} items
          </div>
        )}
      </div>
    );
  };

  // Render raw JSON data
  const renderRawJson = () => {
    return (
      <div className={`p-4 rounded-lg ${
        darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-800'
      } overflow-auto max-h-[500px]`}>
        <pre className="text-sm whitespace-pre-wrap break-words">{formatJson(data)}</pre>
      </div>
    );
  };

  return (
    <div className={`rounded-xl shadow-sm border ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } overflow-hidden`}>
      {/* Header */}
      <div className={`px-4 py-3 flex justify-between items-center border-b ${
        darkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium mr-2 ${methodColors[method]}`}>
            {method}
          </span>
          <span className={`text-sm font-mono ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {endpoint}
          </span>
        </div>
        
        <div className="flex items-center">
          {status === 'success' && (
            <div className="flex items-center text-green-500 mr-3">
              <CheckCircleIcon className="h-5 w-5 mr-1" />
              <span className="text-xs font-medium">
                {responseTime ? `${responseTime}ms` : 'Success'}
              </span>
            </div>
          )}
          
          {status === 'error' && (
            <div className="flex items-center text-red-500 mr-3">
              <XCircleIcon className="h-5 w-5 mr-1" />
              <span className="text-xs font-medium">Error</span>
            </div>
          )}
          
          {onRefresh && (
            <button 
              onClick={onRefresh}
              disabled={status === 'loading'}
              className={`p-1.5 rounded-md ${
                darkMode 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              } transition-colors`}
            >
              <ArrowPathIcon className={`h-4 w-4 ${status === 'loading' ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>
      
      {/* Tabs */}
      <div className={`flex border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'preview'
              ? darkMode 
                ? 'border-indigo-500 text-indigo-400' 
                : 'border-indigo-500 text-indigo-600'
              : darkMode 
                ? 'border-transparent text-gray-400 hover:text-gray-300' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'raw'
              ? darkMode 
                ? 'border-indigo-500 text-indigo-400' 
                : 'border-indigo-500 text-indigo-600'
              : darkMode 
                ? 'border-transparent text-gray-400 hover:text-gray-300' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('raw')}
        >
          Raw JSON
        </button>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
            <p className={`mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Loading data...
            </p>
          </div>
        )}
        
        {status === 'error' && (
          <div className={`p-4 rounded-lg ${
            darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-700'
          }`}>
            <h3 className="font-medium mb-2">Error</h3>
            <p className="text-sm">{error || 'An unknown error occurred'}</p>
          </div>
        )}
        
        {status === 'success' && (
          activeTab === 'preview' ? renderPreview() : renderRawJson()
        )}
        
        {status === 'idle' && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Click the refresh button to fetch data
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiResponseViewer;
