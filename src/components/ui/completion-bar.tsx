import React from 'react';
import { cn } from '../../lib/utils';

interface CompletionBarProps {
  percentage: number;
  className?: string;
}

export const CompletionBar: React.FC<CompletionBarProps> = ({ percentage, className }) => {
  return (
    <div className={cn('w-full bg-[#2D2E3A] rounded-full overflow-hidden', className)}>
      <div
        className="bg-violet-400 h-full transition-all duration-500 ease-in-out"
        style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
      />
    </div>
  );
};
