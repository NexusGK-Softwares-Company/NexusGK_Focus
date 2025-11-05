import React from 'react';
import { Stats as StatsType } from '../types';
import { Clock, TrendingUp, Calendar, Award } from 'lucide-react';

interface StatsProps {
  stats: StatsType;
}

export const Stats: React.FC<StatsProps> = ({ stats }) => {
  const statItems = [
    {
      icon: <Calendar size={24} />,
      label: 'Today Sessions',
      value: stats.todaySessions,
      color: 'text-blue-400',
    },
    {
      icon: <Clock size={24} />,
      label: 'Today Minutes',
      value: stats.todayMinutes,
      color: 'text-green-400',
    },
    {
      icon: <Award size={24} />,
      label: 'Total Sessions',
      value: stats.totalSessions,
      color: 'text-purple-400',
    },
    {
      icon: <TrendingUp size={24} />,
      label: 'Total Minutes',
      value: stats.totalMinutes,
      color: 'text-orange-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statItems.map((item, index) => (
        <div key={index} className="glass rounded-2xl p-6 shadow-xl">
          <div className={`${item.color} mb-3`}>{item.icon}</div>
          <p className="text-3xl font-bold mb-1">{item.value}</p>
          <p className="text-sm text-white/60">{item.label}</p>
        </div>
      ))}
    </div>
  );
};

