import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from './Layout';

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface AnimatedChartProps {
  data: DataPoint[];
  title?: string;
  height?: number;
  type?: 'bar' | 'line' | 'area' | 'pie' | 'donut';
  showLabels?: boolean;
  showValues?: boolean;
  showLegend?: boolean;
  animate?: boolean;
  className?: string;
}

const AnimatedChart: React.FC<AnimatedChartProps> = ({
  data,
  title,
  height = 200,
  type = 'bar',
  showLabels = true,
  showValues = true,
  showLegend = true,
  animate = true,
  className = '',
}) => {
  const { darkMode } = useTheme();
  const [animationProgress, setAnimationProgress] = useState(0);
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Get default colors
  const getDefaultColors = () => {
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#6366f1';
    const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-secondary').trim() || '#a855f7';
    
    const defaultColors = [
      primaryColor,
      secondaryColor,
      '#3b82f6', // blue-500
      '#10b981', // emerald-500
      '#f97316', // orange-500
      '#ef4444', // red-500
      '#8b5cf6', // violet-500
      '#ec4899', // pink-500
    ];
    
    return defaultColors;
  };
  
  // Assign colors to data points
  const dataWithColors = data.map((point, index) => ({
    ...point,
    color: point.color || getDefaultColors()[index % getDefaultColors().length],
  }));
  
  // Find max value for scaling
  const maxValue = Math.max(...data.map(point => point.value));
  
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
  }, [animate, data]);
  
  // Render different chart types
  const renderChart = () => {
    switch (type) {
      case 'line':
        return renderLineChart();
      case 'area':
        return renderAreaChart();
      case 'pie':
        return renderPieChart();
      case 'donut':
        return renderDonutChart();
      case 'bar':
      default:
        return renderBarChart();
    }
  };
  
  // Render bar chart
  const renderBarChart = () => {
    const barWidth = 100 / (dataWithColors.length * 2); // Width with spacing
    
    return (
      <div className="relative h-full flex items-end">
        {/* Y-axis */}
        <div 
          className={`absolute left-0 h-full w-px ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
        />
        
        {/* X-axis */}
        <div 
          className={`absolute bottom-0 w-full h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
        />
        
        {/* Bars */}
        <div className="relative w-full h-full pt-6 pb-8 pl-6 flex items-end justify-around">
          {dataWithColors.map((point, index) => {
            const normalizedHeight = (point.value / maxValue) * 100 * animationProgress;
            
            return (
              <div key={index} className="flex flex-col items-center">
                {/* Bar */}
                <div 
                  className="w-full rounded-t-sm transition-all duration-1000 ease-out transform hover:brightness-110"
                  style={{
                    height: `${normalizedHeight}%`,
                    width: `${barWidth}%`,
                    backgroundColor: point.color,
                    transitionDelay: `${index * 100}ms`,
                  }}
                />
                
                {/* Label */}
                {showLabels && (
                  <div 
                    className={`absolute -bottom-6 text-xs font-medium text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                    style={{
                      width: `${barWidth}%`,
                      left: `${index * (100 / dataWithColors.length) + (barWidth / 2)}%`,
                      transform: 'translateX(-50%)',
                    }}
                  >
                    {point.label}
                  </div>
                )}
                
                {/* Value */}
                {showValues && (
                  <div 
                    className={`absolute text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}
                    style={{
                      bottom: `${normalizedHeight}%`,
                      left: `${index * (100 / dataWithColors.length) + (barWidth / 2)}%`,
                      transform: 'translate(-50%, -100%)',
                      opacity: animationProgress,
                    }}
                  >
                    {point.value}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Render line chart
  const renderLineChart = () => {
    // Generate SVG path for line
    const generateLinePath = () => {
      const points = dataWithColors.map((point, index) => {
        const x = (index / (dataWithColors.length - 1)) * 100;
        const y = 100 - ((point.value / maxValue) * 100 * animationProgress);
        return `${x},${y}`;
      });
      
      return `M ${points.join(' L ')}`;
    };
    
    return (
      <div className="relative h-full w-full pt-6 pb-8 pl-6">
        {/* Y-axis */}
        <div 
          className={`absolute left-0 h-full w-px ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
        />
        
        {/* X-axis */}
        <div 
          className={`absolute bottom-0 w-full h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
        />
        
        {/* Grid lines */}
        <div className="absolute inset-0 pt-6 pb-8 pl-6">
          {[0.25, 0.5, 0.75].map((pos, i) => (
            <div 
              key={i}
              className={`absolute w-full h-px ${darkMode ? 'bg-gray-700/30' : 'bg-gray-300/50'}`}
              style={{ top: `${pos * 100}%` }}
            />
          ))}
        </div>
        
        {/* SVG for line */}
        <svg 
          className="absolute inset-0 pt-6 pb-8 pl-6 overflow-visible" 
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          {/* Line */}
          <path
            d={generateLinePath()}
            fill="none"
            stroke={dataWithColors[0].color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 1000,
              strokeDashoffset: 1000 - (animationProgress * 1000),
              transition: 'stroke-dashoffset 1.5s ease-out',
            }}
          />
          
          {/* Data points */}
          {dataWithColors.map((point, index) => {
            const x = (index / (dataWithColors.length - 1)) * 100;
            const y = 100 - ((point.value / maxValue) * 100 * animationProgress);
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill="white"
                stroke={point.color}
                strokeWidth="2"
                style={{
                  opacity: animationProgress,
                  transition: `opacity 0.3s ease-out ${index * 100}ms`,
                }}
              />
            );
          })}
        </svg>
        
        {/* Labels */}
        {showLabels && (
          <div className="absolute bottom-0 w-full flex justify-between px-6">
            {dataWithColors.map((point, index) => (
              <div 
                key={index}
                className={`absolute text-xs font-medium text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                style={{
                  bottom: '-20px',
                  left: `${(index / (dataWithColors.length - 1)) * 100}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                {point.label}
              </div>
            ))}
          </div>
        )}
        
        {/* Values */}
        {showValues && (
          <div className="absolute inset-0 pt-6 pb-8 pl-6">
            {dataWithColors.map((point, index) => {
              const x = (index / (dataWithColors.length - 1)) * 100;
              const y = 100 - ((point.value / maxValue) * 100);
              
              return (
                <div 
                  key={index}
                  className={`absolute text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}
                  style={{
                    top: `${y}%`,
                    left: `${x}%`,
                    transform: 'translate(-50%, -150%)',
                    opacity: animationProgress,
                    transition: `opacity 0.3s ease-out ${index * 100}ms`,
                  }}
                >
                  {point.value}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };
  
  // Render area chart
  const renderAreaChart = () => {
    // Generate SVG path for area
    const generateAreaPath = () => {
      const points = dataWithColors.map((point, index) => {
        const x = (index / (dataWithColors.length - 1)) * 100;
        const y = 100 - ((point.value / maxValue) * 100 * animationProgress);
        return `${x},${y}`;
      });
      
      return `M 0,100 L ${points.join(' L ')} L 100,100 Z`;
    };
    
    return (
      <div className="relative h-full w-full pt-6 pb-8 pl-6">
        {/* Y-axis */}
        <div 
          className={`absolute left-0 h-full w-px ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
        />
        
        {/* X-axis */}
        <div 
          className={`absolute bottom-0 w-full h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
        />
        
        {/* Grid lines */}
        <div className="absolute inset-0 pt-6 pb-8 pl-6">
          {[0.25, 0.5, 0.75].map((pos, i) => (
            <div 
              key={i}
              className={`absolute w-full h-px ${darkMode ? 'bg-gray-700/30' : 'bg-gray-300/50'}`}
              style={{ top: `${pos * 100}%` }}
            />
          ))}
        </div>
        
        {/* SVG for area */}
        <svg 
          className="absolute inset-0 pt-6 pb-8 pl-6" 
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          {/* Area */}
          <path
            d={generateAreaPath()}
            fill={`url(#areaGradient-${title?.replace(/\s+/g, '-') || 'chart'})`}
            opacity={0.7 * animationProgress}
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient 
              id={`areaGradient-${title?.replace(/\s+/g, '-') || 'chart'}`} 
              x1="0%" 
              y1="0%" 
              x2="0%" 
              y2="100%"
            >
              <stop 
                offset="0%" 
                stopColor={dataWithColors[0].color} 
                stopOpacity="0.8" 
              />
              <stop 
                offset="100%" 
                stopColor={dataWithColors[0].color} 
                stopOpacity="0.1" 
              />
            </linearGradient>
          </defs>
          
          {/* Line on top of area */}
          <path
            d={`M ${dataWithColors.map((point, index) => {
              const x = (index / (dataWithColors.length - 1)) * 100;
              const y = 100 - ((point.value / maxValue) * 100 * animationProgress);
              return `${x},${y}`;
            }).join(' L ')}`}
            fill="none"
            stroke={dataWithColors[0].color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 1000,
              strokeDashoffset: 1000 - (animationProgress * 1000),
              transition: 'stroke-dashoffset 1.5s ease-out',
            }}
          />
          
          {/* Data points */}
          {dataWithColors.map((point, index) => {
            const x = (index / (dataWithColors.length - 1)) * 100;
            const y = 100 - ((point.value / maxValue) * 100 * animationProgress);
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill="white"
                stroke={point.color}
                strokeWidth="2"
                style={{
                  opacity: animationProgress,
                  transition: `opacity 0.3s ease-out ${index * 100}ms`,
                }}
              />
            );
          })}
        </svg>
        
        {/* Labels */}
        {showLabels && (
          <div className="absolute bottom-0 w-full flex justify-between px-6">
            {dataWithColors.map((point, index) => (
              <div 
                key={index}
                className={`absolute text-xs font-medium text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                style={{
                  bottom: '-20px',
                  left: `${(index / (dataWithColors.length - 1)) * 100}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                {point.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  // Render pie chart
  const renderPieChart = () => {
    const total = dataWithColors.reduce((sum, point) => sum + point.value, 0);
    let startAngle = 0;
    
    return (
      <div className="relative h-full flex items-center justify-center">
        <svg 
          className="w-full h-full" 
          viewBox="-50 -50 100 100"
        >
          {/* Pie slices */}
          {dataWithColors.map((point, index) => {
            const percentage = point.value / total;
            const angle = percentage * 360 * animationProgress;
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            // Calculate coordinates
            const x1 = Math.cos(startAngle * Math.PI / 180) * 40;
            const y1 = Math.sin(startAngle * Math.PI / 180) * 40;
            
            const endAngle = startAngle + angle;
            const x2 = Math.cos(endAngle * Math.PI / 180) * 40;
            const y2 = Math.sin(endAngle * Math.PI / 180) * 40;
            
            // Create path
            const path = [
              `M 0 0`,
              `L ${x1} ${y1}`,
              `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');
            
            const slice = (
              <path
                key={index}
                d={path}
                fill={point.color}
                stroke={darkMode ? '#1f2937' : 'white'}
                strokeWidth="1"
                style={{
                  transition: 'all 1s ease-out',
                  transformOrigin: 'center',
                  transform: `scale(${animationProgress})`,
                  opacity: animationProgress,
                }}
              />
            );
            
            // Update start angle for next slice
            startAngle += angle;
            
            return slice;
          })}
        </svg>
        
        {/* Legend */}
        {showLegend && (
          <div 
            className={`absolute right-0 top-0 p-2 rounded-md text-xs ${
              darkMode ? 'bg-gray-800/70 text-white' : 'bg-white/70 text-gray-800'
            }`}
            style={{
              backdropFilter: 'blur(4px)',
              opacity: animationProgress,
              transition: 'opacity 0.5s ease-out',
            }}
          >
            {dataWithColors.map((point, index) => (
              <div key={index} className="flex items-center mb-1 last:mb-0">
                <div 
                  className="w-3 h-3 rounded-sm mr-2"
                  style={{ backgroundColor: point.color }}
                />
                <span>{point.label}</span>
                {showValues && (
                  <span className="ml-2 font-medium">
                    {Math.round((point.value / total) * 100)}%
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  // Render donut chart
  const renderDonutChart = () => {
    const total = dataWithColors.reduce((sum, point) => sum + point.value, 0);
    let startAngle = 0;
    
    return (
      <div className="relative h-full flex items-center justify-center">
        <svg 
          className="w-full h-full" 
          viewBox="-50 -50 100 100"
        >
          {/* Donut slices */}
          {dataWithColors.map((point, index) => {
            const percentage = point.value / total;
            const angle = percentage * 360 * animationProgress;
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            // Calculate coordinates
            const innerRadius = 20;
            const outerRadius = 40;
            
            const x1Outer = Math.cos(startAngle * Math.PI / 180) * outerRadius;
            const y1Outer = Math.sin(startAngle * Math.PI / 180) * outerRadius;
            const x1Inner = Math.cos(startAngle * Math.PI / 180) * innerRadius;
            const y1Inner = Math.sin(startAngle * Math.PI / 180) * innerRadius;
            
            const endAngle = startAngle + angle;
            const x2Outer = Math.cos(endAngle * Math.PI / 180) * outerRadius;
            const y2Outer = Math.sin(endAngle * Math.PI / 180) * outerRadius;
            const x2Inner = Math.cos(endAngle * Math.PI / 180) * innerRadius;
            const y2Inner = Math.sin(endAngle * Math.PI / 180) * innerRadius;
            
            // Create path
            const path = [
              `M ${x1Outer} ${y1Outer}`,
              `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2Outer} ${y2Outer}`,
              `L ${x2Inner} ${y2Inner}`,
              `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1Inner} ${y1Inner}`,
              'Z'
            ].join(' ');
            
            const slice = (
              <path
                key={index}
                d={path}
                fill={point.color}
                stroke={darkMode ? '#1f2937' : 'white'}
                strokeWidth="1"
                style={{
                  transition: 'all 1s ease-out',
                  transformOrigin: 'center',
                  transform: `scale(${animationProgress})`,
                  opacity: animationProgress,
                }}
              />
            );
            
            // Update start angle for next slice
            startAngle += angle;
            
            return slice;
          })}
          
          {/* Center text */}
          {showValues && (
            <text
              x="0"
              y="0"
              textAnchor="middle"
              dominantBaseline="middle"
              className={`text-xs font-bold ${darkMode ? 'fill-white' : 'fill-gray-800'}`}
              style={{
                opacity: animationProgress,
                transition: 'opacity 0.5s ease-out',
              }}
            >
              {total}
            </text>
          )}
        </svg>
        
        {/* Legend */}
        {showLegend && (
          <div 
            className={`absolute right-0 top-0 p-2 rounded-md text-xs ${
              darkMode ? 'bg-gray-800/70 text-white' : 'bg-white/70 text-gray-800'
            }`}
            style={{
              backdropFilter: 'blur(4px)',
              opacity: animationProgress,
              transition: 'opacity 0.5s ease-out',
            }}
          >
            {dataWithColors.map((point, index) => (
              <div key={index} className="flex items-center mb-1 last:mb-0">
                <div 
                  className="w-3 h-3 rounded-sm mr-2"
                  style={{ backgroundColor: point.color }}
                />
                <span>{point.label}</span>
                {showValues && (
                  <span className="ml-2 font-medium">
                    {Math.round((point.value / total) * 100)}%
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div 
      ref={chartRef}
      className={`w-full ${className}`}
      style={{ height: `${height}px` }}
    >
      {/* Chart title */}
      {title && (
        <div className={`text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {title}
        </div>
      )}
      
      {/* Chart container */}
      <div className="w-full h-full">
        {renderChart()}
      </div>
    </div>
  );
};

export default AnimatedChart;
