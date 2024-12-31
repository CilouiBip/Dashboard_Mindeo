import React from 'react';
import { useAirtableData } from '../../hooks/useAirtableData';
import { useScoreStore } from '../../store/scoreStore';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { BarChart2, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { KPI, BusinessFunction } from '../../types/airtable';

const Dashboard = () => {
  const { isLoading, error } = useAirtableData();
  const { kpis, functionScores, globalScore } = useScoreStore();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error as Error} />;

  // Group KPIs by function
  const kpisByFunction = kpis.reduce((acc, kpi) => {
    const function_ = kpi.Type as BusinessFunction;
    if (!acc[function_]) {
      acc[function_] = [];
    }
    acc[function_].push(kpi);
    return acc;
  }, {} as Record<BusinessFunction, KPI[]>);

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Global Score */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Activity className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-text">Performance Globale</h1>
            </div>
            <div className={`text-4xl font-bold ${getScoreColor(globalScore)}`}>
              {globalScore.toFixed(1)}%
            </div>
          </div>
          <div className="bg-card-bg rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(functionScores).map(([function_, score]) => (
                <div key={function_} className="bg-background rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-text font-medium">{function_}</h3>
                    <span className={`font-bold ${getScoreColor(score)}`}>
                      {score.toFixed(1)}%
                    </span>
                  </div>
                  <div className="relative h-2 bg-border rounded-full overflow-hidden">
                    <div
                      className={`absolute h-full transition-all duration-500 ${
                        score >= 70 ? 'bg-green-500' : score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KPIs by Function */}
        <div className="space-y-8">
          {Object.entries(kpisByFunction).map(([function_, functionKpis]) => (
            <div key={function_} className="bg-card-bg rounded-lg p-6">
              <h2 className="text-xl font-semibold text-text mb-6 flex items-center space-x-2">
                <BarChart2 className="h-5 w-5 text-primary" />
                <span>{function_}</span>
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {functionKpis.map((kpi) => (
                  <div key={kpi.ID_KPI} className="bg-background rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        {kpi.Statut_Global === 'OK' ? (
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-500" />
                        )}
                        <h3 className="font-medium text-text">{kpi.NOM_KPI}</h3>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        kpi.Statut_Global === 'OK' 
                          ? 'bg-green-900/30 text-green-400' 
                          : 'bg-red-900/30 text-red-400'
                      }`}>
                        {kpi.Statut_Global}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mb-3">{kpi.Description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-text-secondary">Actuel: {kpi.Score}</span>
                      <span className="text-text-secondary">Objectif: {kpi.Max}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;