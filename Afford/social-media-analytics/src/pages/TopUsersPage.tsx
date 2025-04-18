import React, { useState, useCallback, useMemo } from 'react';
import { useSocialMedia } from '../context/SocialMediaContext';
import UserCard from '../components/UserCard';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import { TrophyIcon, UserGroupIcon, ChartBarIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';

const TopUsersPage: React.FC = () => {
  const { topUsers, loading, error, refreshData } = useSocialMedia();
  const [refreshing, setRefreshing] = useState(false);

  // Calculate total engagement - memoized to prevent recalculation on each render
  const { totalComments, totalPosts } = useMemo(() => ({
    totalComments: topUsers.reduce((sum, user) => sum + user.commentCount, 0),
    totalPosts: topUsers.reduce((sum, user) => sum + user.postCount, 0)
  }), [topUsers]);

  // Handle refresh with loading state
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshData();
    setTimeout(() => setRefreshing(false), 800); // Add a slight delay for better UX
  }, [refreshData]);

  // Render stats cards
  const renderStatsCards = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title="Top Influencers"
        value={topUsers.length}
        icon={<UserGroupIcon className="h-5 w-5" />}
        color="indigo"
      />

      <StatCard
        title="Total Posts"
        value={totalPosts}
        icon={<ChartBarIcon className="h-5 w-5" />}
        color="blue"
      />

      <StatCard
        title="Total Comments"
        value={totalComments}
        icon={<ChatBubbleLeftRightIcon className="h-5 w-5" />}
        color="purple"
      />
    </div>
  ), [topUsers.length, totalPosts, totalComments]);

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

  // Render empty state
  const renderEmptyState = useMemo(() => (
    <div className="text-center py-10">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <p className="text-gray-500">No user data available at this time.</p>
      <button
        onClick={handleRefresh}
        className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
      >
        Try Again
      </button>
    </div>
  ), [handleRefresh]);

  return (
    <div>
      {/* Page header with stats */}
      <PageHeader
        title="Top Influencers"
        description="Discover the most engaging users driving conversations on our platform."
        icon={<TrophyIcon className="h-8 w-8 text-yellow-500" />}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        refreshButtonText="Refresh Data"
      >
        {renderStatsCards}
      </PageHeader>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col justify-center items-center h-64 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <LoadingSpinner size="large" color="indigo" />
          <p className="mt-4 text-gray-500">Loading top influencers...</p>
        </div>
      ) : error ? (
        renderError
      ) : (
        <>
          {/* Leaderboard */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm9 4a1 1 0 10-2 0v6a1 1 0 102 0V7zm-3 2a1 1 0 10-2 0v4a1 1 0 102 0V9zm-3 3a1 1 0 10-2 0v1a1 1 0 102 0v-1z" clipRule="evenodd" />
              </svg>
              Engagement Leaderboard
            </h2>
            <p className="text-gray-600 mb-6">
              These users have the highest engagement rates based on post comments and interactions.
            </p>

            {topUsers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topUsers.map((user, index) => (
                  <UserCard key={user.id} user={user} rank={index + 1} />
                ))}
              </div>
            ) : renderEmptyState}
          </div>

          {/* Insights card */}
          {topUsers.length > 0 && (
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Engagement Insights</h3>
              <p className="text-indigo-100 mb-4">Our top users generate {totalComments} comments across {totalPosts} posts, demonstrating exceptional community engagement.</p>
              <button className="px-4 py-2 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors font-medium text-sm">
                View Detailed Analytics
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TopUsersPage;
