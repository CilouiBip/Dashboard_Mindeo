import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../api/airtable';
import { BarChart2, ArrowRight, Activity, TrendingUp, TrendingDown } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import Card from '../components/common/Card';
import CircularProgress from '../components/common/CircularProgress';
import { getScoreColor } from '../utils/calculations';
import { formatNumber } from '../utils/format';
import { FunctionIcon } from '../components/audit/FunctionIcon';

const Dashboard = () => {
  const { data: globalScore, isLoading: isGlobalScoreLoading, error: globalScoreError } = useQuery({
    queryKey: ['globalScore'],
    queryFn: api.fetchGlobalScore,
  });

  const { data: functionScores, isLoading: isFunctionScoresLoading, error: functionScoresError } = useQuery({
    queryKey: ['functionScores'],
    queryFn: api.fetchFunctionScores,
  });

  const { data: auditItems, isLoading: isAuditLoading, error: auditError } = useQuery({
    queryKey: ['auditItems'],
    queryFn: api.fetchAuditItems,
  });

  if (isGlobalScoreLoading || isFunctionScoresLoading || isAuditLoading) return <LoadingSpinner />;
  if (globalScoreError || functionScoresError || auditError)
    return <ErrorMessage error={(globalScoreError || functionScoresError || auditError) as Error} />;

  // Sort function scores to get top and bottom performers
  const sortedScores = [...(functionScores || [])].sort(
    (a, b) => b.Score_Final_Fonction - a.Score_Final_Fonction
  );
  const topThree = sortedScores.slice(0, 3);
  const bottomThree = sortedScores.slice(-3).reverse();

  // Calculate completion rates
  const completionByFunction = auditItems?.reduce((acc, item) => {
    const functionName = item.Fonction_Name;
    if (!acc[functionName]) {
      acc[functionName] = { total: 0, completed: 0 };
    }
    acc[functionName].total++;
    if (item.Status === 'Completed') {
      acc[functionName].completed++;
    }
    return acc;
  }, {} as Record<string, { total: number; completed: number }>);

  const totalItems = auditItems?.length || 0;
  const completedItems = auditItems?.filter(item => item.Status === 'Completed').length || 0;
  const completionRate = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="flex items-center space-x-3">
          <Activity className="h-8 w-8 text-violet-500" />
          <h1 className="text-2xl font-medium text-white">Performance Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Global Score */}
          <div className="bg-[#1C1D24] border border-[#2D2E3A] hover:border-violet-500/50 transition-all rounded-lg p-8 lg:col-span-2">
            <div className="space-y-6">
              <h2 className="text-xl font-medium text-center text-white">Score Global</h2>
              <div className={`text-7xl font-bold text-center ${getScoreColor(globalScore?.Score_Global_Sur_10 || 0)}`}>
                {formatNumber(globalScore?.Score_Global_Sur_10 || 0)}
              </div>
              
              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-[#2D2E3A]">
                {/* Top Performers */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-400">Top Performers</h3>
                  <div className="space-y-3">
                    {topThree.map((score) => (
                      <Link
                        key={score.Name}
                        to={`/kpis-mvd?function=${encodeURIComponent(score.Name)}`}
                        className="flex items-center justify-between group hover:bg-[#2D2E3A]/10 p-2 rounded transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <FunctionIcon name={score.Name} className="h-4 w-4 text-violet-400" />
                          <span className="text-sm text-white group-hover:text-violet-400 transition-colors">{score.Name}</span>
                        </div>
                        <span className={`text-sm font-medium ${getScoreColor(score.Score_Final_Fonction)}`}>
                          {formatNumber(score.Score_Final_Fonction)}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Bottom Performers */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-400">Need Attention</h3>
                  <div className="space-y-3">
                    {bottomThree.map((score) => (
                      <Link
                        key={score.Name}
                        to={`/kpis-mvd?function=${encodeURIComponent(score.Name)}`}
                        className="flex items-center justify-between group hover:bg-[#2D2E3A]/10 p-2 rounded transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <FunctionIcon name={score.Name} className="h-4 w-4 text-violet-400" />
                          <span className="text-sm text-white group-hover:text-violet-400 transition-colors">{score.Name}</span>
                        </div>
                        <span className={`text-sm font-medium ${getScoreColor(score.Score_Final_Fonction)}`}>
                          {formatNumber(score.Score_Final_Fonction)}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Global Completion */}
          <div className="bg-[#1C1D24] border border-[#2D2E3A] hover:border-violet-500/50 transition-all rounded-lg p-8">
            <div className="space-y-6 text-center">
              <h2 className="text-xl font-medium text-white">Global Completion</h2>
              <div className="flex justify-center">
                <CircularProgress value={completionRate} size="lg" className="text-violet-500">
                  <div className="text-2xl font-bold text-white">{formatNumber(completionRate)}%</div>
                </CircularProgress>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-400">
                  {completedItems} of {totalItems} actions completed
                </div>
                <div className="h-1.5 bg-[#2D2E3A] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500/20 to-violet-500 rounded-full transition-all"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Function Scores */}
        {functionScores && functionScores.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-medium text-white">Performance by Function</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {functionScores.map((score) => {
                const completion = completionByFunction?.[score.Name] || { total: 0, completed: 0 };
                const completionRate = completion.total > 0 
                  ? (completion.completed / completion.total) * 100 
                  : 0;

                return (
                  <Link
                    key={score.Name}
                    to={`/kpis-mvd?function=${encodeURIComponent(score.Name)}`}
                    className="group"
                  >
                    <div className="bg-[#1C1D24] border border-[#2D2E3A] hover:border-violet-500/50 transition-all rounded-lg p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <FunctionIcon name={score.Name} className="h-5 w-5 text-violet-400" />
                            <h3 className="text-lg font-medium text-white">{score.Name}</h3>
                          </div>
                          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-violet-400 transition-colors" />
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-end justify-between">
                            <span className="text-sm text-gray-400">Score</span>
                            <span className={`text-2xl font-bold ${getScoreColor(score.Score_Final_Fonction)}`}>
                              {formatNumber(score.Score_Final_Fonction)}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Completion</span>
                              <span className="text-white">{formatNumber(completionRate)}%</span>
                            </div>
                            <div className="h-1.5 bg-[#2D2E3A] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-violet-500/20 to-violet-500 rounded-full transition-all"
                                style={{ width: `${completionRate}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-xs text-gray-400">
                              <span>Actions</span>
                              <span>{completion.completed} / {completion.total}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;