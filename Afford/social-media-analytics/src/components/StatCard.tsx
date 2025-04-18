import React, { memo, useState, useEffect } from 'react';
import { useTheme } from './Layout';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'indigo' | 'blue' | 'red' | 'green' | 'orange' | 'yellow' | 'purple' | 'amber';
  className?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isAnimated?: boolean;
  variant?: 'gradient' | 'solid' | 'outline' | 'glass';
}

// Light mode color classes
const lightColorClasses = {
  indigo: {
    bg: 'from-indigo-50 to-purple-50',
    border: 'border-indigo-100',
    iconBg: 'bg-indigo-100',
    iconText: 'text-indigo-500',
    title: 'text-indigo-600',
  },
  blue: {
    bg: 'from-blue-50 to-cyan-50',
    border: 'border-blue-100',
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-500',
    title: 'text-blue-600',
  },
  red: {
    bg: 'from-red-50 to-rose-50',
    border: 'border-red-100',
    iconBg: 'bg-red-100',
    iconText: 'text-red-500',
    title: 'text-red-600',
  },
  green: {
    bg: 'from-green-50 to-emerald-50',
    border: 'border-green-100',
    iconBg: 'bg-green-100',
    iconText: 'text-green-500',
    title: 'text-green-600',
  },
  orange: {
    bg: 'from-orange-50 to-amber-50',
    border: 'border-orange-100',
    iconBg: 'bg-orange-100',
    iconText: 'text-orange-500',
    title: 'text-orange-600',
  },
  yellow: {
    bg: 'from-yellow-50 to-amber-50',
    border: 'border-yellow-100',
    iconBg: 'bg-yellow-100',
    iconText: 'text-yellow-500',
    title: 'text-yellow-600',
  },
  purple: {
    bg: 'from-purple-50 to-fuchsia-50',
    border: 'border-purple-100',
    iconBg: 'bg-purple-100',
    iconText: 'text-purple-500',
    title: 'text-purple-600',
  },
  amber: {
    bg: 'from-amber-50 to-yellow-50',
    border: 'border-amber-100',
    iconBg: 'bg-amber-100',
    iconText: 'text-amber-500',
    title: 'text-amber-600',
  },
};

// Dark mode color classes
const darkColorClasses = {
  indigo: {
    bg: 'from-indigo-900/20 to-purple-900/20',
    border: 'border-indigo-800/30',
    iconBg: 'bg-indigo-800/30',
    iconText: 'text-indigo-400',
    title: 'text-indigo-400',
  },
  blue: {
    bg: 'from-blue-900/20 to-cyan-900/20',
    border: 'border-blue-800/30',
    iconBg: 'bg-blue-800/30',
    iconText: 'text-blue-400',
    title: 'text-blue-400',
  },
  red: {
    bg: 'from-red-900/20 to-rose-900/20',
    border: 'border-red-800/30',
    iconBg: 'bg-red-800/30',
    iconText: 'text-red-400',
    title: 'text-red-400',
  },
  green: {
    bg: 'from-green-900/20 to-emerald-900/20',
    border: 'border-green-800/30',
    iconBg: 'bg-green-800/30',
    iconText: 'text-green-400',
    title: 'text-green-400',
  },
  orange: {
    bg: 'from-orange-900/20 to-amber-900/20',
    border: 'border-orange-800/30',
    iconBg: 'bg-orange-800/30',
    iconText: 'text-orange-400',
    title: 'text-orange-400',
  },
  yellow: {
    bg: 'from-yellow-900/20 to-amber-900/20',
    border: 'border-yellow-800/30',
    iconBg: 'bg-yellow-800/30',
    iconText: 'text-yellow-400',
    title: 'text-yellow-400',
  },
  purple: {
    bg: 'from-purple-900/20 to-fuchsia-900/20',
    border: 'border-purple-800/30',
    iconBg: 'bg-purple-800/30',
    iconText: 'text-purple-400',
    title: 'text-purple-400',
  },
  amber: {
    bg: 'from-amber-900/20 to-yellow-900/20',
    border: 'border-amber-800/30',
    iconBg: 'bg-amber-800/30',
    iconText: 'text-amber-400',
    title: 'text-amber-400',
  },
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  className = '',
  trend,
  isAnimated = true,
  variant = 'gradient',
}) => {
  const { darkMode } = useTheme();
  const colors = darkMode ? darkColorClasses[color] : lightColorClasses[color];
  const [animatedValue, setAnimatedValue] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // Animate the value counting up
  useEffect(() => {
    if (!isAnimated || typeof value !== 'number') return;

    const duration = 1500; // ms
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const currentCount = Math.round(progress * (value as number));

      setAnimatedValue(currentCount);

      if (frame === totalFrames) {
        clearInterval(counter);
      }
    }, frameDuration);

    return () => clearInterval(counter);
  }, [value, isAnimated]);

  // Animate entrance
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Get variant-specific styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'solid':
        return darkMode
          ? `bg-gray-800 border ${colors.border}`
          : `bg-white border ${colors.border}`;
      case 'outline':
        return `bg-transparent border-2 ${colors.border}`;
      case 'glass':
        return darkMode
          ? `bg-gray-800/50 backdrop-blur-sm border ${colors.border} shadow-lg`
          : `bg-white/50 backdrop-blur-sm border ${colors.border} shadow-lg`;
      default: // gradient
        return `bg-gradient-to-br ${colors.bg} border ${colors.border}`;
    }
  };

  // Format the displayed value
  const displayValue = isAnimated && typeof value === 'number' ? animatedValue : value;

  return (
    <div
      className={`p-4 rounded-xl ${getVariantStyles()} ${className} transform transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} hover:shadow-md`}
    >
      <div className="flex items-center justify-between">
        <div className={`p-2.5 ${colors.iconBg} rounded-lg`}>
          <div className={`h-6 w-6 ${colors.iconText}`}>{icon}</div>
        </div>

        {trend && (
          <div className={`flex items-center ${trend.isPositive ? 'text-green-500' : 'text-red-500'} text-sm font-medium`}>
            {trend.isPositive ? (
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            ) : (
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
              </svg>
            )}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>

      <div className="mt-3">
        <p className={`text-sm font-medium ${colors.title} mb-1`}>{title}</p>
        <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {displayValue}
        </p>
      </div>
    </div>
  );
};

export default memo(StatCard);
