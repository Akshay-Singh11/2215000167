import React, { useMemo } from 'react';
import { PostWithComments } from '../types';

interface EngagementChartProps {
  posts: PostWithComments[];
  darkMode?: boolean;
}

const EngagementChart: React.FC<EngagementChartProps> = ({ posts, darkMode = false }) => {
  // Calculate engagement data for the chart
  const chartData = useMemo(() => {
    // Get the 5 most recent posts
    const recentPosts = [...posts]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .reverse(); // Reverse to show oldest to newest (left to right)

    const maxComments = Math.max(...recentPosts.map(post => post.comments.length));
    const chartHeight = 150; // Height of the chart in pixels
    
    return recentPosts.map(post => ({
      id: post.id,
      title: post.title.length > 20 ? post.title.substring(0, 20) + '...' : post.title,
      commentCount: post.comments.length,
      barHeight: post.comments.length > 0 
        ? Math.max(20, (post.comments.length / maxComments) * chartHeight) 
        : 5, // Minimum bar height of 5px or 20px if there are comments
    }));
  }, [posts]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
      <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Engagement Trends</h3>
      
      {chartData.length > 0 ? (
        <div className="relative h-[200px]">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between text-xs text-gray-500">
            <span>High</span>
            <span>Low</span>
          </div>
          
          {/* Chart bars */}
          <div className="ml-10 flex items-end justify-between h-[150px] border-b border-l relative">
            {/* Horizontal grid lines */}
            <div className="absolute left-0 right-0 top-0 h-[1px] bg-gray-200 opacity-30"></div>
            <div className="absolute left-0 right-0 top-[50px] h-[1px] bg-gray-200 opacity-30"></div>
            <div className="absolute left-0 right-0 top-[100px] h-[1px] bg-gray-200 opacity-30"></div>
            
            {chartData.map((item, index) => (
              <div key={item.id} className="flex flex-col items-center flex-1">
                <div 
                  className="w-12 rounded-t-md transition-all duration-500 ease-in-out hover:opacity-80"
                  style={{ 
                    height: `${item.barHeight}px`,
                    background: `linear-gradient(to top, ${
                      darkMode 
                        ? 'rgb(79, 70, 229), rgb(124, 58, 237)' 
                        : 'rgb(99, 102, 241), rgb(139, 92, 246)'
                    })` 
                  }}
                  title={`${item.title}: ${item.commentCount} comments`}
                ></div>
                <div className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formatDate(posts[posts.length - chartData.length + index].createdAt)}
                </div>
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="mt-6 flex justify-center">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-indigo-500 to-purple-500 mr-1"></div>
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Comments per post</span>
            </div>
          </div>
        </div>
      ) : (
        <div className={`flex items-center justify-center h-[150px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          No data available
        </div>
      )}
    </div>
  );
};

export default EngagementChart;
