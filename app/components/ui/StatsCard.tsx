import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  rank?: number | null;
  percentile?: number | null;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, rank, percentile, className }) => {
  return (
    <div className={`bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700 ${className}`}>
      <h3 className="text-gray-400 text-sm uppercase tracking-wider font-semibold mb-1">{title}</h3>
      <div className="text-2xl font-bold text-white">{value}</div>
      {(percentile !== undefined && percentile !== null) && (
        <div className="text-xs mt-2">
          <span className={`${(percentile || 0) > 50 ? 'text-green-400' : 'text-yellow-400'}`}>
            Top {percentile}%
          </span>
        </div>
      )}
      {rank !== undefined && rank !== null && (
         <div className="text-xs text-gray-500 mt-1">Rank #{rank}</div>
      )}
    </div>
  );
};


