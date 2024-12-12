import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { FunctionScore } from '../../types/airtable';
import { getScoreColor } from '../../utils/calculations';

interface FunctionScoreCardProps {
  score: FunctionScore;
}

const FunctionScoreCard: React.FC<FunctionScoreCardProps> = ({ score }) => {
  return (
    <div className="bg-[#1C1D24] border border-[#2D2E3A] rounded-lg p-6 hover:border-violet-500/50 transition-all">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">{score.Name}</h3>
        {score.Score_Final_Fonction >= 7 ? (
          <TrendingUp className="h-5 w-5 text-green-500" />
        ) : (
          <TrendingDown className="h-5 w-5 text-red-500" />
        )}
      </div>
      
      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <span className="text-sm text-gray-400">Score</span>
          <span className={`text-2xl font-bold ${getScoreColor(score.Score_Final_Fonction)}`}>
            {score.Score_Final_Fonction.toFixed(1)}
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>KPIs in Alert</span>
            <span className="text-red-500 font-medium">{score.Nbr_KPIs_Alert}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>Total KPIs</span>
            <span>{score.Nbr_KPIs}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunctionScoreCard;