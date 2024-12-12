import React from 'react';
import { BarChart2, TrendingUp, TrendingDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/airtable';
import { getScoreColor } from '../../utils/calculations';
import { formatNumber } from '../../utils/format';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const GlobalScore = () => {
  const { data: globalScore, isLoading: globalLoading, error: globalError } = useQuery({
    queryKey: ['globalScore'],
    queryFn: api.fetchGlobalScore
  });

  const { data: functionScores, isLoading: scoresLoading, error: scoresError } = useQuery({
    queryKey: ['functionScores'],
    queryFn: api.fetchFunctionScores
  });

  if (globalLoading || scoresLoading) return <LoadingSpinner />;
  if (globalError || scoresError) return <ErrorMessage error={(globalError || scoresError) as Error} />;
  if (!globalScore || !functionScores) return null;

  // Sort function scores to get top and bottom performers
  const sortedScores = [...functionScores].sort(
    (a, b) => b.Score_Final_Fonction - a.Score_Final_Fonction
  );
  const topThree = sortedScores.slice(0, 3);
  const bottomThree = sortedScores.slice(-3).reverse();

  return (
    <div className="bg-[#1C1D24] border border-[#2D2E3A] rounded-lg p-8">
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <BarChart2 className="h-8 w-8 text-violet-500" />
            <h1 className="text-2xl font-bold text-white">Score Global</h1>
          </div>
          <div className={`text-6xl font-bold ${getScoreColor(globalScore.Score_Global_Sur_10)}`}>
            {formatNumber(globalScore.Score_Global_Sur_10)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 pt-6 border-t border-[#2D2E3A]">
          {/* Top Performers */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-4">Top Performers</h3>
            <div className="space-y-3">
              {topThree.map((score) => (
                <div key={score.Name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-white">{score.Name}</span>
                  </div>
                  <span className={`font-medium ${getScoreColor(score.Score_Final_Fonction)}`}>
                    {formatNumber(score.Score_Final_Fonction)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Performers */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-4">Need Attention</h3>
            <div className="space-y-3">
              {bottomThree.map((score) => (
                <div key={score.Name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    <span className="text-white">{score.Name}</span>
                  </div>
                  <span className={`font-medium ${getScoreColor(score.Score_Final_Fonction)}`}>
                    {formatNumber(score.Score_Final_Fonction)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalScore;