import React from 'react';
import { BarChart2, TrendingUp, TrendingDown } from 'lucide-react';
import { GlobalScore } from '../../types/airtable';
import { getScoreColor } from '../../utils/calculations';

interface GlobalScoreCardProps {
  score: GlobalScore;
}

const GlobalScoreCard: React.FC<GlobalScoreCardProps> = ({ score }) => {
  const scoreValue = score.Score_Global_Sur_10;
  
  return (
    <div className="bg-[#1C1D24] border border-[#2D2E3A] rounded-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BarChart2 className="h-6 w-6 text-violet-500" />
          <h2 className="text-xl font-bold text-white">Global Score</h2>
        </div>
        {scoreValue >= 7 ? (
          <TrendingUp className="h-5 w-5 text-green-500" />
        ) : (
          <TrendingDown className="h-5 w-5 text-red-500" />
        )}
      </div>
      <div className="text-center">
        <div className={`text-5xl font-bold ${getScoreColor(scoreValue)}`}>
          {scoreValue.toFixed(1)}
        </div>
        <p className="text-gray-400 mt-2">out of 10</p>
      </div>
    </div>
  );
};

export default GlobalScoreCard;