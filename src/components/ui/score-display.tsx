import React from 'react';

interface ScoreDisplayProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ value, size = 'md' }) => {
  const getScoreColor = (score: number): string => {
    if (score >= 7) return 'text-green-400';
    if (score >= 5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl'
  };

  return (
    <div className={`font-bold ${sizeClasses[size]} ${getScoreColor(value)}`}>
      {value.toFixed(1)}
    </div>
  );
};
