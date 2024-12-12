import React from 'react';
import { BarChart2, TrendingUp, TrendingDown } from 'lucide-react';
import { BusinessFunction } from '../../types/airtable';

interface ScoreCardProps {
  functionName: BusinessFunction;
  score: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ functionName, score }) => {
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 70) return <TrendingUp className="h-6 w-6 text-green-500" />;
    if (score >= 40) return <BarChart2 className="h-6 w-6 text-yellow-500" />;
    return <TrendingDown className="h-6 w-6 text-red-500" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{functionName}</h3>
        {getScoreIcon(score)}
      </div>
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`absolute h-full transition-all duration-500 ${getScoreColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="mt-2 text-right">
        <span className="font-semibold text-gray-700">{score.toFixed(1)}%</span>
      </div>
    </div>
  );
};

export default ScoreCard;