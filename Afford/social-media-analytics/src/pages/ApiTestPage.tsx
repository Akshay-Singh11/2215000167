import React, { useState } from 'react';
import { useTheme } from '../components/Layout';
import PageHeader from '../components/PageHeader';
import ApiResponseViewer from '../components/ApiResponseViewer';
import StatCard from '../components/StatCard';
import { CodeBracketIcon, ArrowPathIcon, CheckCircleIcon, ExclamationTriangleIcon, UserGroupIcon, DocumentTextIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { fetchUsers, fetchPosts, fetchComments } from '../services/api';
import { User, Post, Comment } from '../types';

// API Test types
type ApiEndpoint = 'users' | 'posts' | 'comments';
type ApiResponse = User[] | Post[] | Comment[] | null;
type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

const ApiTestPage: React.FC = () => {
  const { darkMode } = useTheme();
  const [activeEndpoint, setActiveEndpoint] = useState<ApiEndpoint>('users');
  const [response, setResponse] = useState<ApiResponse>(null);
  const [status, setStatus] = useState<ApiStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [filterQuery, setFilterQuery] = useState<string>('');

  // API stats
  const [apiStats, setApiStats] = useState({
    users: { count: 0, responseTime: 0, lastTested: null as Date | null },
    posts: { count: 0, responseTime: 0, lastTested: null as Date | null },
    comments: { count: 0, responseTime: 0, lastTested: null as Date | null },
  });

  // Test API endpoints
  const testEndpoint = async (endpoint: ApiEndpoint) => {
    setActiveEndpoint(endpoint);
    setStatus('loading');
    setError(null);
    setResponse(null);
    setResponseTime(null);

    const startTime = performance.now();

    try {
      let data;
      switch (endpoint) {
        case 'users':
          data = await fetchUsers();
          break;
        case 'posts':
          data = await fetchPosts();
          break;
        case 'comments':
          data = await fetchComments();
          break;
      }

      const endTime = performance.now();
      const responseTimeMs = Math.round(endTime - startTime);
      setResponseTime(responseTimeMs);
      setResponse(data);
      setStatus('success');

      // Update API stats
      setApiStats(prev => ({
        ...prev,
        [endpoint]: {
          count: Array.isArray(data) ? data.length : 0,
          responseTime: responseTimeMs,
          lastTested: new Date(),
        }
      }));
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error(`Error fetching ${endpoint}:`, err);
    }
  };

  // Get endpoint URL
  const getEndpointUrl = (endpoint: ApiEndpoint) => {
    switch (endpoint) {
      case 'users':
        return 'https://jsonplaceholder.typicode.com/users';
      case 'posts':
        return 'https://jsonplaceholder.typicode.com/posts';
      case 'comments':
        return 'https://jsonplaceholder.typicode.com/comments';
      default:
        return '';
    }
  };

  // Get endpoint icon
  const getEndpointIcon = (endpoint: ApiEndpoint) => {
    switch (endpoint) {
      case 'users':
        return <UserGroupIcon className="h-5 w-5" />;
      case 'posts':
        return <DocumentTextIcon className="h-5 w-5" />;
      case 'comments':
        return <ChatBubbleLeftRightIcon className="h-5 w-5" />;
      default:
        return <CodeBracketIcon className="h-5 w-5" />;
    }
  };

  // Get endpoint color
  const getEndpointColor = (endpoint: ApiEndpoint): 'blue' | 'indigo' | 'purple' => {
    switch (endpoint) {
      case 'users':
        return 'blue';
      case 'posts':
        return 'indigo';
      case 'comments':
        return 'purple';
      default:
        return 'blue';
    }
  };

  return (
    <div>
      <PageHeader
        title="API Testing"
        description="Test and explore the Social Media API endpoints"
        icon={<CodeBracketIcon className="h-8 w-8 text-indigo-500" />}
      >
        {/* API Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <StatCard
            title="Users API"
            value={apiStats.users.count || '—'}
            icon={<UserGroupIcon className="h-5 w-5" />}
            color="blue"
            variant="glass"
            trend={apiStats.users.lastTested ? { value: apiStats.users.responseTime, isPositive: apiStats.users.responseTime < 500 } : undefined}
          />

          <StatCard
            title="Posts API"
            value={apiStats.posts.count || '—'}
            icon={<DocumentTextIcon className="h-5 w-5" />}
            color="indigo"
            variant="glass"
            trend={apiStats.posts.lastTested ? { value: apiStats.posts.responseTime, isPositive: apiStats.posts.responseTime < 500 } : undefined}
          />

          <StatCard
            title="Comments API"
            value={apiStats.comments.count || '—'}
            icon={<ChatBubbleLeftRightIcon className="h-5 w-5" />}
            color="purple"
            variant="glass"
            trend={apiStats.comments.lastTested ? { value: apiStats.comments.responseTime, isPositive: apiStats.comments.responseTime < 500 } : undefined}
          />
        </div>
      </PageHeader>

      {/* API Endpoints */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button
          onClick={() => testEndpoint('users')}
          className={`p-5 rounded-xl border transition-all transform hover:scale-105 hover:shadow-md ${
            activeEndpoint === 'users'
              ? darkMode
                ? 'bg-blue-900/30 border-blue-700 text-blue-300'
                : 'bg-blue-50 border-blue-200 text-blue-700'
              : darkMode
                ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-750'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-900/40' : 'bg-blue-100'}`}>
              <UserGroupIcon className={`h-6 w-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              GET
            </div>
          </div>
          <h3 className="text-lg font-medium mb-1 text-left">Users API</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-left`}>
            Fetch all users from JSONPlaceholder
          </p>
          {apiStats.users.lastTested && (
            <div className="mt-3 pt-3 border-t border-dashed border-gray-200 dark:border-gray-700">
              <div className="flex justify-between text-xs">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Last tested:</span>
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {apiStats.users.lastTested.toLocaleTimeString()}
                </span>
              </div>
            </div>
          )}
        </button>

        <button
          onClick={() => testEndpoint('posts')}
          className={`p-5 rounded-xl border transition-all transform hover:scale-105 hover:shadow-md ${
            activeEndpoint === 'posts'
              ? darkMode
                ? 'bg-indigo-900/30 border-indigo-700 text-indigo-300'
                : 'bg-indigo-50 border-indigo-200 text-indigo-700'
              : darkMode
                ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-750'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-indigo-900/40' : 'bg-indigo-100'}`}>
              <DocumentTextIcon className={`h-6 w-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            </div>
            <div className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              GET
            </div>
          </div>
          <h3 className="text-lg font-medium mb-1 text-left">Posts API</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-left`}>
            Fetch all posts from JSONPlaceholder
          </p>
          {apiStats.posts.lastTested && (
            <div className="mt-3 pt-3 border-t border-dashed border-gray-200 dark:border-gray-700">
              <div className="flex justify-between text-xs">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Last tested:</span>
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {apiStats.posts.lastTested.toLocaleTimeString()}
                </span>
              </div>
            </div>
          )}
        </button>

        <button
          onClick={() => testEndpoint('comments')}
          className={`p-5 rounded-xl border transition-all transform hover:scale-105 hover:shadow-md ${
            activeEndpoint === 'comments'
              ? darkMode
                ? 'bg-purple-900/30 border-purple-700 text-purple-300'
                : 'bg-purple-50 border-purple-200 text-purple-700'
              : darkMode
                ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-750'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-900/40' : 'bg-purple-100'}`}>
              <ChatBubbleLeftRightIcon className={`h-6 w-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <div className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              GET
            </div>
          </div>
          <h3 className="text-lg font-medium mb-1 text-left">Comments API</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-left`}>
            Fetch all comments from JSONPlaceholder
          </p>
          {apiStats.comments.lastTested && (
            <div className="mt-3 pt-3 border-t border-dashed border-gray-200 dark:border-gray-700">
              <div className="flex justify-between text-xs">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Last tested:</span>
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {apiStats.comments.lastTested.toLocaleTimeString()}
                </span>
              </div>
            </div>
          )}
        </button>
      </div>

      {/* Response Viewer */}
      {activeEndpoint && (
        <ApiResponseViewer
          data={response}
          status={status}
          error={error}
          responseTime={responseTime}
          endpoint={getEndpointUrl(activeEndpoint)}
          method="GET"
          onRefresh={() => testEndpoint(activeEndpoint)}
        />
      )}
    </div>
  );
};

export default ApiTestPage;
