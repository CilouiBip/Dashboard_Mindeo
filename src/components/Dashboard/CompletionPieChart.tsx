import React from 'react';

interface CompletionPieChartProps {
  completed: number;
  total: number;
}

const CompletionPieChart: React.FC<CompletionPieChartProps> = ({ completed, total }) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative h-24 w-24">
      <svg className="transform -rotate-90 h-full w-full">
        {/* Background circle */}
        <circle
          className="text-[#2D2E3A]"
          strokeWidth="4"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="48"
          cy="48"
        />
        {/* Progress circle */}
        <circle
          className="text-violet-500 transition-all duration-500"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="48"
          cy="48"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-semibold text-white">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};

export default CompletionPieChart;