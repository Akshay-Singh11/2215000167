import React, { memo } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'indigo' | 'blue' | 'red' | 'green' | 'orange' | 'yellow' | 'purple' | 'amber';
  className?: string;
}

const colorClasses = {
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

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  className = '',
}) => {
  const colors = colorClasses[color];
  
  return (
    <div className={`bg-gradient-to-br ${colors.bg} p-4 rounded-lg border ${colors.border} ${className}`}>
      <div className="flex items-center">
        <div className={`p-2 ${colors.iconBg} rounded-lg mr-3`}>
          <div className={colors.iconText}>{icon}</div>
        </div>
        <div>
          <p className={`text-xs font-medium ${colors.title}`}>{title}</p>
          <p className="text-xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default memo(StatCard);
