import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSocialMedia } from '../context/SocialMediaContext';
import { useTheme } from '../components/Layout';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import LiveFeedIndicator from '../components/LiveFeedIndicator';
import RefreshButton from '../components/RefreshButton';
import NewPostsNotification from '../components/NewPostsNotification';
import { ClockIcon, PlusCircleIcon, BoltIcon, AdjustmentsHorizontalIcon, ArrowUpCircleIcon } from '@heroicons/react/24/outline';

const FeedPage: React.FC = () => {
  const { feedPosts, loading, error, refreshData } = useSocialMedia();
  const { darkMode } = useTheme();
  const [displayPosts, setDisplayPosts] = useState<number>(10);
  const [activeFilter, setActiveFilter] = useState<string>('latest');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());
  const [newPostsCount, setNewPostsCount] = useState<number>(0);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(true);
  const previousPostsRef = useRef<typeof feedPosts>([]);
  const scrollPositionRef = useRef<number>(0);

  // Check for new posts when feedPosts changes
  useEffect(() => {
    if (previousPostsRef.current.length > 0 && feedPosts.length > previousPostsRef.current.length) {
      const newCount = feedPosts.length - previousPostsRef.current.length;
      setNewPostsCount(prevCount => prevCount + newCount);
    }
    previousPostsRef.current = feedPosts;
  }, [feedPosts]);

  // Auto-refresh the feed every 30 seconds if enabled
  useEffect(() => {
    if (!autoRefreshEnabled) return;

    const intervalId = setInterval(() => {
      if (!document.hidden) {
        refreshData().then(() => {
          setLastRefreshTime(new Date());
        });
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [refreshData, autoRefreshEnabled]);

  // Load more posts
  const loadMorePosts = () => {
    setDisplayPosts((prev) => prev + 10);
  };

  // Save scroll position before refreshing
  const saveScrollPosition = useCallback(() => {
    scrollPositionRef.current = window.scrollY;
  }, []);

  // Restore scroll position after refreshing
  const restoreScrollPosition = useCallback(() => {
    setTimeout(() => {
      window.scrollTo(0, scrollPositionRef.current);
    }, 100);
  }, []);

  // Handle manual refresh with animation
  const handleRefresh = useCallback(() => {
    saveScrollPosition();
    setRefreshing(true);
    refreshData().finally(() => {
      setTimeout(() => {
        setRefreshing(false);
        setLastRefreshTime(new Date());
        setNewPostsCount(0);
        restoreScrollPosition();
      }, 1000);
    });
  }, [refreshData, saveScrollPosition, restoreScrollPosition]);

  // Handle showing new posts
  const handleShowNewPosts = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setNewPostsCount(0);
  }, []);

  return (
    <div>
      {/* New posts notification */}
      <NewPostsNotification
        count={newPostsCount}
        onClick={handleShowNewPosts}
        autoHide={false}
      />

      {/* Page header */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100'} rounded-xl shadow-sm p-6 mb-6 border`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-indigo-500 mr-3" />
              <div className="flex items-center">
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mr-3`}>Live Feed</h1>
                <LiveFeedIndicator pulseColor="red" size="small" />
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Real-time updates showing the newest posts at the top.
              </p>
              <div className="flex items-center text-xs text-gray-500 ml-2">
                <span className="hidden sm:inline">Last updated: </span>
                <span className="ml-1">{lastRefreshTime.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <label className={`relative inline-flex items-center cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <input
                  type="checkbox"
                  checked={autoRefreshEnabled}
                  onChange={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
                  className="sr-only peer"
                />
                <div className={`w-9 h-5 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:${darkMode ? 'bg-indigo-600' : 'bg-indigo-600'}`}></div>
                <span className="ml-2 text-xs font-medium">Auto</span>
              </label>
            </div>

            <RefreshButton
              onClick={handleRefresh}
              isRefreshing={refreshing}
              label="Refresh Feed"
              variant="primary"
              size="medium"
            />
          </div>
        </div>

        {/* Filter tabs */}
        <div className={`mt-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveFilter('latest')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${activeFilter === 'latest'
                ? darkMode
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-indigo-500 text-indigo-600'
                : darkMode
                  ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Latest
            </button>
            <button
              onClick={() => setActiveFilter('popular')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${activeFilter === 'popular'
                ? darkMode
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-indigo-500 text-indigo-600'
                : darkMode
                  ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Popular
            </button>
            <button
              onClick={() => setActiveFilter('following')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${activeFilter === 'following'
                ? darkMode
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-indigo-500 text-indigo-600'
                : darkMode
                  ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Following
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main feed */}
        <div className="lg:flex-1">
          {loading && feedPosts.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <LoadingSpinner size="large" />
              <p className="mt-4 text-gray-500">Loading your feed...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-5 rounded-xl shadow-sm" role="alert">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-500 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <strong className="font-medium">Error!</strong>
                <span className="ml-2"> {error}</span>
              </div>
              <p className="mt-2 text-sm">Please try refreshing the feed or contact support if the problem persists.</p>
            </div>
          ) : (
            <>
              {/* New post composer */}
              <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
                <div className="flex items-center">
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="Your avatar"
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                  <div className="flex-1 ml-3">
                    <input
                      type="text"
                      placeholder="What's on your mind?"
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <button className="ml-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                    Post
                  </button>
                </div>
                <div className="flex mt-3 pt-2 border-t border-gray-100">
                  <button className="flex items-center text-gray-500 hover:text-indigo-600 mr-4 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Photo
                  </button>
                  <button className="flex items-center text-gray-500 hover:text-indigo-600 mr-4 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Video
                  </button>
                  <button className="flex items-center text-gray-500 hover:text-indigo-600 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Location
                  </button>
                </div>
              </div>

              {/* Loading indicator */}
              {loading && (
                <div className={`flex justify-center items-center my-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-lg shadow-sm p-3 border`}>
                  <LoadingSpinner size="small" />
                  <span className={`ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Updating your feed...</span>
                </div>
              )}

              {/* Posts */}
              {feedPosts.length > 0 ? (
                <div className="space-y-6">
                  {feedPosts.slice(0, displayPosts).map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}

                  {/* Load more button */}
                  {displayPosts < feedPosts.length && (
                    <div className="text-center mt-6">
                      <button
                        onClick={loadMorePosts}
                        className={`px-6 py-3 ${darkMode ? 'bg-gray-800 border-gray-700 text-indigo-400 hover:bg-gray-700' : 'bg-white border-gray-200 text-indigo-600 hover:bg-gray-50'} border rounded-lg transition-colors shadow-sm flex items-center mx-auto`}
                      >
                        <PlusCircleIcon className="h-5 w-5 mr-2" />
                        Load More Posts
                      </button>
                    </div>
                  )}

                  {/* End of feed message */}
                  {displayPosts >= feedPosts.length && (
                    <div className={`text-center mt-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-lg shadow-sm p-6 border`}>
                      <ArrowUpCircleIcon className={`h-8 w-8 ${darkMode ? 'text-gray-600' : 'text-gray-300'} mx-auto mb-2`} />
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>You've reached the end of your feed.</p>
                      <div className="mt-3 flex justify-center space-x-3">
                        <button
                          onClick={handleShowNewPosts}
                          className={`px-4 py-2 ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} rounded-lg transition-colors text-sm flex items-center`}
                        >
                          <ArrowUpCircleIcon className="h-4 w-4 mr-1" />
                          Back to Top
                        </button>
                        <RefreshButton
                          onClick={handleRefresh}
                          isRefreshing={refreshing}
                          label="Check for New Posts"
                          variant="secondary"
                          size="small"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className={`text-center py-16 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Your Feed is Empty</h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">Follow more users or create your first post to get started!</p>
                  <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors shadow-sm">
                    Discover Users to Follow
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:w-80 space-y-6">
          {/* Trending topics */}
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm p-5 border`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Trending Topics</h3>
              <BoltIcon className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="space-y-3">
              {['#TechNews', '#DigitalMarketing', '#AITrends', '#WebDevelopment', '#DataScience'].map((topic, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-indigo-600 hover:text-indigo-800 cursor-pointer">{topic}</span>
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{Math.floor(Math.random() * 1000) + 100} posts</span>
                </div>
              ))}
            </div>
            <button className={`w-full mt-4 text-sm ${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'} font-medium`}>
              See All Trends
            </button>
          </div>

          {/* Suggested users */}
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm p-5 border`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Suggested Users</h3>
              <AdjustmentsHorizontalIcon className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((id) => (
                <div key={id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={`https://randomuser.me/api/portraits/${id % 2 === 0 ? 'women' : 'men'}/${id + 10}.jpg`}
                      alt={`Suggested user ${id}`}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                    <div className="ml-3">
                      <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>User Name {id}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>@username{id}</p>
                    </div>
                  </div>
                  <button className={`px-3 py-1 ${darkMode ? 'bg-indigo-900/30 text-indigo-400 hover:bg-indigo-800/40' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'} rounded-full text-xs font-medium transition-colors`}>
                    Follow
                  </button>
                </div>
              ))}
            </div>
            <button className={`w-full mt-4 text-sm ${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'} font-medium`}>
              View More
            </button>
          </div>

          {/* Footer */}
          <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} space-y-2`}>
            <div className="flex flex-wrap gap-x-2">
              <a href="#" className="hover:underline">About</a>
              <a href="#" className="hover:underline">Help Center</a>
              <a href="#" className="hover:underline">Privacy</a>
              <a href="#" className="hover:underline">Terms</a>
            </div>
            <p>© 2025 Social Pulse. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedPage;
