import React, { useState, useEffect } from 'react';
import { useTheme } from '../components/Layout';
import PageHeader from '../components/PageHeader';
import Card3D from '../components/Card3D';
import ParticleBackground from '../components/ParticleBackground';
import CreativeLoader from '../components/CreativeLoader';
import AnimatedChart from '../components/AnimatedChart';
import FloatingActionButton from '../components/FloatingActionButton';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  DocumentTextIcon, 
  ChatBubbleLeftRightIcon,
  PlusIcon,
  ArrowPathIcon,
  BoltIcon,
  SparklesIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import { fetchUsers, fetchPosts, fetchComments } from '../services/api';

const CreativeDashboardPage: React.FC = () => {
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    posts: 0,
    comments: 0,
    engagement: 0,
    trending: 0
  });
  const [chartData, setChartData] = useState({
    activity: [] as { label: string; value: number }[],
    engagement: [] as { label: string; value: number }[],
    distribution: [] as { label: string; value: number }[]
  });
  
  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Fetch data from API
        const [users, posts, comments] = await Promise.all([
          fetchUsers(),
          fetchPosts(),
          fetchComments()
        ]);
        
        // Calculate stats
        const engagement = Math.round((comments.length / posts.length) * 100) / 100;
        const trending = Math.floor(Math.random() * 10) + 1;
        
        // Update stats
        setStats({
          users: users.length,
          posts: posts.length,
          comments: comments.length,
          engagement,
          trending
        });
        
        // Generate chart data
        generateChartData(users, posts, comments);
        
        // Simulate loading for demo purposes
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Generate chart data
  const generateChartData = (users: any[], posts: any[], comments: any[]) => {
    // Activity chart data (posts per day)
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const activity = days.map(day => ({
      label: day,
      value: Math.floor(Math.random() * 50) + 10
    }));
    
    // Engagement chart data
    const engagement = [
      { label: 'Likes', value: Math.floor(Math.random() * 500) + 200 },
      { label: 'Comments', value: comments.length },
      { label: 'Shares', value: Math.floor(Math.random() * 200) + 50 },
      { label: 'Saves', value: Math.floor(Math.random() * 100) + 20 }
    ];
    
    // Content distribution chart data
    const distribution = [
      { label: 'Images', value: Math.floor(Math.random() * 40) + 30 },
      { label: 'Videos', value: Math.floor(Math.random() * 30) + 20 },
      { label: 'Text', value: Math.floor(Math.random() * 20) + 10 },
      { label: 'Links', value: Math.floor(Math.random() * 10) + 5 }
    ];
    
    setChartData({
      activity,
      engagement,
      distribution
    });
  };
  
  // Refresh data
  const handleRefresh = () => {
    // Reload data
    window.location.reload();
  };
  
  // Floating action button items
  const fabItems = [
    {
      icon: <ArrowPathIcon className="h-full w-full" />,
      label: 'Refresh',
      onClick: handleRefresh,
      color: '#3b82f6' // blue-500
    },
    {
      icon: <BoltIcon className="h-full w-full" />,
      label: 'Quick Actions',
      onClick: () => console.log('Quick actions clicked'),
      color: '#f97316' // orange-500
    },
    {
      icon: <SparklesIcon className="h-full w-full" />,
      label: 'Create Post',
      onClick: () => console.log('Create post clicked'),
      color: '#8b5cf6' // violet-500
    }
  ];
  
  return (
    <div className="relative min-h-screen">
      {/* Particle background */}
      <ParticleBackground 
        particleCount={darkMode ? 40 : 30}
        particleSize={2}
        particleSpeed={0.3}
        connectionDistance={120}
        interactive={true}
      />
      
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-opacity-70 bg-gray-900">
          <CreativeLoader 
            size="large"
            type="blocks"
            text="Loading dashboard"
          />
        </div>
      )}
      
      {/* Page content */}
      <div className="relative z-10">
        <PageHeader
          title="Creative Dashboard"
          description="Interactive analytics with modern UI elements"
          icon={<RocketLaunchIcon className="h-8 w-8 text-indigo-500" />}
          showLiveIndicator={true}
          liveIndicatorColor="green"
        />
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card3D
            className="rounded-xl p-5 border"
            depth={15}
          >
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Users
                </h3>
                <UserGroupIcon className="h-5 w-5 text-blue-500" />
              </div>
              <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {stats.users}
              </div>
              <div className="text-xs text-green-500 mt-1 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                12% increase
              </div>
            </div>
          </Card3D>
          
          <Card3D
            className="rounded-xl p-5 border"
            depth={15}
          >
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Posts
                </h3>
                <DocumentTextIcon className="h-5 w-5 text-indigo-500" />
              </div>
              <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {stats.posts}
              </div>
              <div className="text-xs text-green-500 mt-1 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                8% increase
              </div>
            </div>
          </Card3D>
          
          <Card3D
            className="rounded-xl p-5 border"
            depth={15}
          >
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Comments
                </h3>
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-purple-500" />
              </div>
              <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {stats.comments}
              </div>
              <div className="text-xs text-green-500 mt-1 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                15% increase
              </div>
            </div>
          </Card3D>
          
          <Card3D
            className="rounded-xl p-5 border"
            depth={15}
          >
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Engagement
                </h3>
                <ChartBarIcon className="h-5 w-5 text-green-500" />
              </div>
              <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {stats.engagement}
              </div>
              <div className="text-xs text-red-500 mt-1 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                3% decrease
              </div>
            </div>
          </Card3D>
          
          <Card3D
            className="rounded-xl p-5 border"
            depth={15}
          >
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Trending
                </h3>
                <BoltIcon className="h-5 w-5 text-yellow-500" />
              </div>
              <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {stats.trending}
              </div>
              <div className="text-xs text-green-500 mt-1 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                5% increase
              </div>
            </div>
          </Card3D>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card3D
            className={`rounded-xl p-5 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
            depth={20}
          >
            <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Activity Overview
            </h3>
            <AnimatedChart
              data={chartData.activity}
              type="area"
              height={250}
              title="Posts per Day"
            />
          </Card3D>
          
          <Card3D
            className={`rounded-xl p-5 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
            depth={20}
          >
            <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Engagement Metrics
            </h3>
            <AnimatedChart
              data={chartData.engagement}
              type="bar"
              height={250}
              title="Interactions"
            />
          </Card3D>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card3D
            className={`rounded-xl p-5 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
            depth={15}
          >
            <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Content Distribution
            </h3>
            <AnimatedChart
              data={chartData.distribution}
              type="donut"
              height={250}
              title="Content Types"
            />
          </Card3D>
          
          <Card3D
            className={`rounded-xl p-5 border ${darkMode ? 'border-gray-700' : 'border-gray-200'} col-span-1 lg:col-span-2`}
            depth={15}
          >
            <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Top Performing Posts
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map(index => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} flex items-center`}
                >
                  <div 
                    className={`w-10 h-10 rounded-lg mr-3 flex items-center justify-center ${
                      index === 1 
                        ? 'bg-yellow-100 text-yellow-600' 
                        : index === 2 
                          ? 'bg-gray-200 text-gray-600' 
                          : 'bg-amber-100 text-amber-600'
                    }`}
                  >
                    #{index}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Popular Post Title {index}
                    </h4>
                    <div className="flex items-center text-xs mt-1">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                        {Math.floor(Math.random() * 1000) + 500} likes
                      </span>
                      <span className="mx-2">•</span>
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                        {Math.floor(Math.random() * 100) + 20} comments
                      </span>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${
                    index === 1 
                      ? 'text-green-500' 
                      : index === 2 
                        ? 'text-blue-500' 
                        : 'text-purple-500'
                  }`}>
                    +{Math.floor(Math.random() * 50) + 10}%
                  </div>
                </div>
              ))}
            </div>
          </Card3D>
        </div>
      </div>
      
      {/* Floating action button */}
      <FloatingActionButton
        icon={<PlusIcon className="h-full w-full" />}
        items={fabItems}
        position="bottom-right"
        size="large"
      />
    </div>
  );
};

export default CreativeDashboardPage;
