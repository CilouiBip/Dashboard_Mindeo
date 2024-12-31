import React from 'react';
import { useQuery } from 'react-query';
import { api } from '../lib/api';
import { BarChart2, TrendingUp, TrendingDown } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { Link } from 'react-router-dom';

const Home = () => {
  const {
    data: globalScore,
    isLoading,
    error,
  } = useQuery('globalScore', api.fetchGlobalScore);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error as Error} />;
  if (!globalScore) return null;

  const getScoreColor = (score: number) => {
    if (score >= 7) return 'text-green-500';
    if (score >= 4) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="p-6 space-y-8">
      {/* Global Score Section */}
      <div className="bg-[#1C1D24] border border-[#2D2E3A] rounded-lg p-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <BarChart2 className="h-8 w-8 text-violet-500" />
            <h1 className="text-2xl font-bold text-white">Score Global</h1>
          </div>
          <div
            className={`text-6xl font-bold ${getScoreColor(globalScore.score)}`}
          >
            {globalScore.score.toFixed(1)}
          </div>
          <div className="flex items-center justify-center space-x-2">
            {globalScore.trend > 0 ? (
              <TrendingUp className="h-5 w-5 text-green-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-500" />
            )}
            <span
              className={
                globalScore.trend > 0 ? 'text-green-500' : 'text-red-500'
              }
            >
              {Math.abs(globalScore.trend)}% depuis le dernier mois
            </span>
          </div>
        </div>
      </div>

      {/* Function Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {globalScore.functions.map((func) => (
          <Link
            key={func.name}
            to={`/dashboard/${func.name.toLowerCase()}`}
            className="bg-[#1C1D24] border border-[#2D2E3A] rounded-lg p-6 hover:border-violet-500/50 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">{func.name}</h3>
              {func.score >= 7 ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className={`text-3xl font-bold ${getScoreColor(func.score)}`}>
              {func.score.toFixed(1)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
