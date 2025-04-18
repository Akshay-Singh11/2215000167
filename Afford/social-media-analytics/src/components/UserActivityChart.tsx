import React, { useMemo } from 'react';
import { UserWithStats } from '../types';

interface UserActivityChartProps {
  users: UserWithStats[];
  darkMode?: boolean;
}

const UserActivityChart: React.FC<UserActivityChartProps> = ({ users, darkMode = false }) => {
  // Calculate user activity data for the chart
  const chartData = useMemo(() => {
    // Get the top 5 users by comment count
    const topUsers = [...users]
      .sort((a, b) => b.commentCount - a.commentCount)
      .slice(0, 5);

    const maxComments = Math.max(...topUsers.map(user => user.commentCount));
    const maxPosts = Math.max(...topUsers.map(user => user.postCount));
    const chartHeight = 150; // Height of the chart in pixels
    
    return topUsers.map(user => ({
      id: user.id,
      name: user.name,
      username: user.username,
      commentCount: user.commentCount,
      postCount: user.postCount,
      commentBarHeight: user.commentCount > 0 
        ? Math.max(20, (user.commentCount / maxComments) * chartHeight) 
        : 5,
      postBarHeight: user.postCount > 0 
        ? Math.max(20, (user.postCount / maxPosts) * chartHeight) 
        : 5,
    }));
  }, [users]);

  return (
    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
      <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>User Activity</h3>
      
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
            
            {chartData.map((item) => (
              <div key={item.id} className="flex flex-col items-center flex-1">
                <div className="flex items-end space-x-1">
                  {/* Comments bar */}
                  <div 
                    className="w-5 rounded-t-md transition-all duration-500 ease-in-out hover:opacity-80"
                    style={{ 
                      height: `${item.commentBarHeight}px`,
                      background: `linear-gradient(to top, ${
                        darkMode 
                          ? 'rgb(79, 70, 229), rgb(124, 58, 237)' 
                          : 'rgb(99, 102, 241), rgb(139, 92, 246)'
                      })` 
                    }}
                    title={`${item.name}: ${item.commentCount} comments`}
                  ></div>
                  
                  {/* Posts bar */}
                  <div 
                    className="w-5 rounded-t-md transition-all duration-500 ease-in-out hover:opacity-80"
                    style={{ 
                      height: `${item.postBarHeight}px`,
                      background: `linear-gradient(to top, ${
                        darkMode 
                          ? 'rgb(220, 38, 38), rgb(234, 88, 12)' 
                          : 'rgb(239, 68, 68), rgb(249, 115, 22)'
                      })` 
                    }}
                    title={`${item.name}: ${item.postCount} posts`}
                  ></div>
                </div>
                <div className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'} truncate max-w-[60px] text-center`}>
                  @{item.username}
                </div>
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="mt-6 flex justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-indigo-500 to-purple-500 mr-1"></div>
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Comments</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-red-500 to-orange-500 mr-1"></div>
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Posts</span>
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

export default UserActivityChart;
