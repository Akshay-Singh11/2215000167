import React, { useState, useEffect } from 'react';
import { useTheme } from './Layout';

interface ApiMetric {
  endpoint: string;
  responseTime: number;
  dataCount: number;
  timestamp: Date;
  color: string;
}

interface ApiMetricsChartProps {
  metrics: ApiMetric[];
  height?: number;
  showLegend?: boolean;
  animate?: boolean;
}

const ApiMetricsChart: React.FC<ApiMetricsChartProps> = ({
  metrics,
  height = 200,
  showLegend = true,
  animate = true,
}) => {
  const { darkMode } = useTheme();
  const [animationProgress, setAnimationProgress] = useState(0);
  
  // Animation effect
  useEffect(() => {
    if (!animate) {
      setAnimationProgress(1);
      return;
    }
    
    let start: number | null = null;
    const duration = 1000; // ms
    
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setAnimationProgress(progress);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [animate, metrics]);
  
  // No metrics to display
  if (!metrics || metrics.length === 0) {
    return (
      <div 
        className={`flex items-center justify-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
        style={{ height: `${height}px` }}
      >
        No metrics data available
      </div>
    );
  }
  
  // Calculate chart dimensions
  const maxResponseTime = Math.max(...metrics.map(m => m.responseTime));
  const maxDataCount = Math.max(...metrics.map(m => m.dataCount));
  
  // Normalize values for display
  const normalizedMetrics = metrics.map(metric => ({
    ...metric,
    normalizedResponseTime: (metric.responseTime / maxResponseTime) * 0.8, // 80% of height max
    normalizedDataCount: (metric.dataCount / maxDataCount) * 0.8, // 80% of height max
  }));
  
  return (
    <div className={`w-full ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
      {/* Chart header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          API Performance Metrics
        </h3>
        {showLegend && (
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-indigo-500 rounded-sm mr-1"></div>
              <span>Response Time</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-emerald-500 rounded-sm mr-1"></div>
              <span>Data Count</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Chart container */}
      <div 
        className={`relative ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b border-l`}
        style={{ height: `${height}px` }}
      >
        {/* Horizontal grid lines */}
        <div className="absolute inset-0">
          <div className={`absolute left-0 right-0 top-0 h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} opacity-50`}></div>
          <div className={`absolute left-0 right-0 top-1/4 h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} opacity-50`}></div>
          <div className={`absolute left-0 right-0 top-2/4 h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} opacity-50`}></div>
          <div className={`absolute left-0 right-0 top-3/4 h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} opacity-50`}></div>
        </div>
        
        {/* Y-axis labels */}
        <div className="absolute -left-8 inset-y-0 flex flex-col justify-between text-xs opacity-70">
          <span>Max</span>
          <span>Min</span>
        </div>
        
        {/* Bars */}
        <div className="absolute inset-0 flex items-end justify-around">
          {normalizedMetrics.map((metric, index) => (
            <div key={index} className="flex items-end space-x-1">
              {/* Response time bar */}
              <div 
                className="w-5 bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-sm transition-all duration-1000 ease-out transform hover:scale-105"
                style={{ 
                  height: `${metric.normalizedResponseTime * 100 * animationProgress}%`,
                  opacity: 0.8 + (index * 0.05),
                }}
                title={`${metric.endpoint}: ${metric.responseTime}ms`}
              ></div>
              
              {/* Data count bar */}
              <div 
                className="w-5 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-sm transition-all duration-1000 ease-out transform hover:scale-105"
                style={{ 
                  height: `${metric.normalizedDataCount * 100 * animationProgress}%`,
                  opacity: 0.8 + (index * 0.05),
                  transitionDelay: `${index * 100}ms`,
                }}
                title={`${metric.endpoint}: ${metric.dataCount} items`}
              ></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* X-axis labels */}
      <div className="flex justify-around mt-2">
        {normalizedMetrics.map((metric, index) => (
          <div key={index} className="text-xs text-center">
            <div 
              className={`w-4 h-4 mx-auto mb-1 rounded-full`} 
              style={{ backgroundColor: metric.color }}
            ></div>
            <span>{metric.endpoint}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApiMetricsChart;
