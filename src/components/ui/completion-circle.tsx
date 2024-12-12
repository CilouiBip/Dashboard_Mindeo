import React from 'react';
import { cn } from '../../lib/utils';

interface CompletionCircleProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const CompletionCircle: React.FC<CompletionCircleProps> = ({
  percentage,
  size = 200,
  strokeWidth = 12,
  className
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  const center = size / 2;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
        className={cn("transform -rotate-90", className)}
      >
        <circle
          className="text-[#2D2E3A]"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={center}
          cy={center}
        />
        <circle
          className="text-violet-400 transition-all duration-500 ease-in-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={center}
          cy={center}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold text-white">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
};
