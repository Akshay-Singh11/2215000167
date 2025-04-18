import React, { useState, useCallback, useMemo } from 'react';
import { useSocialMedia } from '../context/SocialMediaContext';
import { useTheme } from '../components/Layout';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import PostCard from '../components/PostCard';
import UserCard from '../components/UserCard';
import EngagementChart from '../components/EngagementChart';
import UserActivityChart from '../components/UserActivityChart';
import {
  ChartBarIcon,
  UserGroupIcon,
  FireIcon,
  ChatBubbleLeftRightIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  ExclamationCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';

const DashboardPage: React.FC = () => {
  const {
    feedPosts,
    topUsers,
    trendingPosts,
    loading,
    error,
    refreshData
  } = useSocialMedia();
  const { darkMode } = useTheme();

  const [refreshing, setRefreshing] = useState(false);

  // Calculate metrics for dashboard
  const metrics = useMemo(() => {
    const totalPosts = feedPosts.length;
    const totalUsers = new Set(feedPosts.map(post => post.userId)).size;
    const totalComments = feedPosts.reduce((sum, post) => sum + post.comments.length, 0);
    const avgCommentsPerPost = totalPosts > 0 ? Math.round((totalComments / totalPosts) * 10) / 10 : 0;

    return {
      totalPosts,
      totalUsers,
      totalComments,
      avgCommentsPerPost
    };
  }, [feedPosts]);

  // Handle refresh with loading state
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshData();
    setTimeout(() => setRefreshing(false), 800);
  }, [refreshData]);

  // Render stats cards
  const renderStatsCards = useMemo(() => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Posts"
        value={metrics.totalPosts}
        icon={<ChartBarIcon className="h-5 w-5" />}
        color="blue"
      />
      <StatCard
        title="Active Users"
        value={metrics.totalUsers}
        icon={<UserGroupIcon className="h-5 w-5" />}
        color="indigo"
      />
      <StatCard
        title="Total Comments"
        value={metrics.totalComments}
        icon={<ChatBubbleLeftRightIcon className="h-5 w-5" />}
        color="purple"
      />
      <StatCard
        title="Avg. Engagement"
        value={metrics.avgCommentsPerPost}
        icon={<ArrowTrendingUpIcon className="h-5 w-5" />}
        color="green"
      />
    </div>
  ), [metrics]);

  // Render error alert
  const renderError = useMemo(() => (
    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-5 rounded-xl shadow-sm" role="alert">
      <div className="flex items-center">
        <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-3" />
        <strong className="font-medium">Error!</strong>
        <span className="ml-2"> {error}</span>
      </div>
      <p className="mt-2 text-sm">Please try refreshing the data or contact support if the problem persists.</p>
    </div>
  ), [error]);

  return (
    <div>
      {/* Page header with stats */}
      <PageHeader
        title="Analytics Dashboard"
        description="Get a comprehensive overview of your social media performance."
        icon={<SparklesIcon className="h-8 w-8 text-indigo-600" />}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      >
        {renderStatsCards}
      </PageHeader>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col justify-center items-center h-64 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-500">Loading dashboard data...</p>
        </div>
      ) : error ? (
        renderError
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Engagement Chart */}
            <EngagementChart posts={feedPosts} darkMode={darkMode} />

            {/* User Activity Chart */}
            <UserActivityChart users={topUsers} darkMode={darkMode} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-6" data-testid="dashboard-main-content">
            {/* Latest Posts */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100'} rounded-xl shadow-sm p-6 border`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-indigo-500 mr-2" />
                  <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Latest Activity</h2>
                </div>
                <Link
                  to="/"
                  className={`text-sm ${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'} flex items-center`}
                >
                  View All <ArrowRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>

              <div className="space-y-4">
                {feedPosts.slice(0, 3).map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>

            {/* Trending Content */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100'} rounded-xl shadow-sm p-6 border`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FireIcon className="h-5 w-5 text-red-500 mr-2" />
                  <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Trending Content</h2>
                </div>
                <Link
                  to="/trending"
                  className={`text-sm ${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'} flex items-center`}
                >
                  View All <ArrowRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>

              {trendingPosts.length > 0 ? (
                <div className="space-y-4">
                  {trendingPosts.slice(0, 2).map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center py-6`}>No trending posts available at this time.</p>
              )}
            </div>
          </div>

          {/* Top Users */}
          <div className="lg:col-span-1">
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100'} rounded-xl shadow-sm p-6 border sticky top-20`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <UserGroupIcon className="h-5 w-5 text-indigo-500 mr-2" />
                  <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Top Influencers</h2>
                </div>
                <Link
                  to="/top-users"
                  className={`text-sm ${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'} flex items-center`}
                >
                  View All <ArrowRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>

              {topUsers.length > 0 ? (
                <div className="space-y-4">
                  {topUsers.slice(0, 3).map((user, index) => (
                    <UserCard key={user.id} user={user} rank={index + 1} />
                  ))}
                </div>
              ) : (
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center py-6`}>No user data available at this time.</p>
              )}

              {/* Quick Stats */}
              <div className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-4 text-white">
                <h3 className="font-bold mb-2">Quick Insights</h3>
                <p className="text-indigo-100 text-sm">
                  Top users generate {topUsers.reduce((sum, user) => sum + user.commentCount, 0)} comments
                  across {topUsers.reduce((sum, user) => sum + user.postCount, 0)} posts.
                </p>
              </div>
            </div>
          </div>
        </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
