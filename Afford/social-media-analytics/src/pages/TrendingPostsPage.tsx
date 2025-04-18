import React, { useState, useCallback, useMemo } from 'react';
import { useSocialMedia } from '../context/SocialMediaContext';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import { FireIcon, ChatBubbleLeftRightIcon, EyeIcon, ExclamationCircleIcon, InformationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const TrendingPostsPage: React.FC = () => {
  const { trendingPosts, loading, error, refreshData } = useSocialMedia();
  const [refreshing, setRefreshing] = useState(false);

  // Calculate metrics - memoized to prevent recalculation on each render
  const { totalComments, avgEngagement } = useMemo(() => {
    const total = trendingPosts.reduce((sum, post) => sum + post.comments.length, 0);
    return {
      totalComments: total,
      avgEngagement: trendingPosts.length > 0 ? Math.round(total / trendingPosts.length) : 0
    };
  }, [trendingPosts]);

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
        title="Trending Posts"
        value={trendingPosts.length}
        icon={<FireIcon className="h-5 w-5" />}
        color="red"
      />

      <StatCard
        title="Total Comments"
        value={totalComments}
        icon={<ChatBubbleLeftRightIcon className="h-5 w-5" />}
        color="orange"
      />

      <StatCard
        title="Avg. Engagement"
        value={avgEngagement}
        icon={<EyeIcon className="h-5 w-5" />}
        color="amber"
      />
    </div>
  ), [trendingPosts.length, totalComments, avgEngagement]);

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
    <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
      </svg>
      <h3 className="text-lg font-medium text-gray-800 mb-2">No Trending Content Yet</h3>
      <p className="text-gray-500 max-w-md mx-auto mb-6">We're waiting for content to start trending. Check back soon or create engaging posts to appear here!</p>
      <button
        onClick={handleRefresh}
        className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-colors shadow-sm"
      >
        Refresh Trends
      </button>
    </div>
  ), [handleRefresh]);

  // Render tips section
  const renderTips = useMemo(() => (
    <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <InformationCircleIcon className="h-5 w-5 text-indigo-500 mr-2" />
        Tips for Creating Trending Content
      </h3>
      <ul className="space-y-2 text-gray-600">
        <li className="flex items-start">
          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
          <span>Post content that encourages discussion and comments</span>
        </li>
        <li className="flex items-start">
          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
          <span>Use high-quality images that capture attention</span>
        </li>
        <li className="flex items-start">
          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
          <span>Engage with comments on your posts to boost visibility</span>
        </li>
      </ul>
    </div>
  ), []);

  return (
    <div>
      {/* Page header with stats */}
      <PageHeader
        title="Trending Content"
        description="Discover the most popular and engaging posts on our platform right now."
        icon={<FireIcon className="h-8 w-8 text-red-500" />}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        refreshButtonText="Refresh Trends"
        refreshButtonColor="red"
      >
        {renderStatsCards}
      </PageHeader>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col justify-center items-center h-64 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <LoadingSpinner size="large" color="red" />
          <p className="mt-4 text-gray-500">Discovering trending content...</p>
        </div>
      ) : error ? (
        renderError
      ) : (
        <>
          {/* Trending info */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl shadow-md p-6 text-white mb-6">
            <div className="flex items-start">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg mr-4">
                <FireIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Hot Right Now</h3>
                <p className="text-red-100">
                  {trendingPosts.length > 0
                    ? `Showing ${trendingPosts.length} post${trendingPosts.length > 1 ? 's' : ''} with ${trendingPosts[0]?.comments.length} comments each. These posts are generating significant engagement!`
                    : 'No trending posts available at this time. Check back soon for hot content!'}
                </p>
              </div>
            </div>
          </div>

          {/* Trending posts */}
          {trendingPosts.length > 0 ? (
            <div className="space-y-6">
              {trendingPosts.map((post) => (
                <PostCard key={post.id} post={post} showComments={true} />
              ))}
            </div>
          ) : renderEmptyState}

          {/* Engagement tips */}
          {trendingPosts.length > 0 && renderTips}
        </>
      )}
    </div>
  );
};

export default TrendingPostsPage;
