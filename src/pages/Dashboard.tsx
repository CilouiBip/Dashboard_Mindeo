cd /Users/mehdi/Downloads/Project\ Dashboard\ mindeo
git add .
git commit -m "Fix case-sensitive imports using barrel exports"
git push origin mainimport React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../api/airtable';
import { BarChart2, ArrowRight, Activity, TrendingUp, TrendingDown } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import CompletionPieChart from '../components/Dashboard/CompletionPieChart';
import { getScoreColor } from '../utils/calculations';
import { formatNumber } from '../utils/format';

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

  // Calculate completion rates by function
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

  // Calculate global completion
  const totalItems = auditItems?.length || 0;
  const completedItems = auditItems?.filter(item => item.Status === 'Completed').length || 0;

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center space-x-3">
        <Activity className="h-8 w-8 text-violet-500" />
        <h1 className="text-2xl font-bold text-white">Performance Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Global Score */}
        <div className="lg:col-span-2 bg-[#1C1D24] border border-[#2D2E3A] rounded-lg p-8">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold text-white">Score Global</h2>
              <div className={`text-6xl font-bold ${getScoreColor(globalScore?.Score_Global_Sur_10 || 0)}`}>
                {formatNumber(globalScore?.Score_Global_Sur_10 || 0)}
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

        {/* Rest of the component remains the same */}
        <div className="bg-[#1C1D24] border border-[#2D2E3A] rounded-lg p-8">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-white">Global Completion</h2>
            <div className="flex justify-center">
              <CompletionPieChart completed={completedItems} total={totalItems} />
            </div>
            <div className="text-sm text-gray-400">
              {completedItems} of {totalItems} actions completed
            </div>
          </div>
        </div>
      </div>

      {/* Function Scores */}
      {functionScores && functionScores.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white">Performance by Function</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {functionScores.map((score) => {
              const completion = completionByFunction?.[score.Name] || { total: 0, completed: 0 };
              const completionRate = completion.total > 0 
                ? (completion.completed / completion.total) * 100 
                : 0;

              return (
                <Link
                  key={score.Name}
                  to={`/kpis?function=${encodeURIComponent(score.Name)}`}
                  className="bg-[#1C1D24] border border-[#2D2E3A] rounded-lg p-6 hover:border-violet-500/50 transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">{score.Name}</h3>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-violet-500 transition-colors" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-end justify-between">
                      <span className="text-sm text-gray-400">Score</span>
                      <span className={`text-2xl font-bold ${getScoreColor(score.Score_Final_Fonction)}`}>
                        {formatNumber(score.Score_Final_Fonction)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Completion Rate</span>
                        <span className="text-violet-400">{Math.round(completionRate)}%</span>
                      </div>
                      <div className="h-1.5 bg-[#2D2E3A] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-violet-500 transition-all duration-500"
                          style={{ width: `${completionRate}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Actions Completed</span>
                        <span>{completion.completed} / {completion.total}</span>
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
  );
};

export default Dashboard;