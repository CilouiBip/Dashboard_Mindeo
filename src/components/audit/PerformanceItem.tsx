import React from 'react';
import { ScoreDisplay } from '../ui/score-display';

interface PerformanceItemProps {
  name: string;
  score: number;
}

export const PerformanceItem: React.FC<PerformanceItemProps> = ({ name, score }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-300">{name}</span>
      <ScoreDisplay value={score} size="sm" />
    </div>
  );
};
