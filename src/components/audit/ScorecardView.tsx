import React, { useEffect, useState } from 'react';
import { AuditItem } from '../../types/airtable';

interface ScorecardViewProps {
  auditItems: AuditItem[];
}

interface FunctionScore {
  name: string;
  score: number;
  totalItems: number;
  completedItems: number;
  actionsCompleted: number;
  totalActions: number;
}

const ScorecardView: React.FC<ScorecardViewProps> = ({ auditItems }) => {
  const [overallScore, setOverallScore] = useState(0);
  const [functionScores, setFunctionScores] = useState<FunctionScore[]>([]);
  const [totalActionsCompleted, setTotalActionsCompleted] = useState(0);
  const [totalActions, setTotalActions] = useState(0);

  useEffect(() => {
    calculateScores();
  }, [auditItems]);

  const calculateScores = () => {
    const functionMap = new Map<string, FunctionScore>();
    let totalRatedScore = 0;
    let totalRatedItems = 0;
    let globalActionsCompleted = 0;
    let globalTotalActions = 0;

    auditItems.forEach(item => {
      if (!item.Fonction_Name) return;

      const functionName = item.Fonction_Name;
      let currentFunction = functionMap.get(functionName) || {
        name: functionName,
        score: 0,
        totalItems: 0,
        completedItems: 0,
        actionsCompleted: 0,
        totalActions: 0
      };

      // Only include in score calculation if it has been rated
      if (item.Score !== undefined && item.Score !== null) {
        currentFunction.score += item.Score;
        currentFunction.totalItems++;
      }

      // Track completion status
      if (item.Status === 'Completed') {
        currentFunction.completedItems++;
        currentFunction.actionsCompleted++;
        globalActionsCompleted++;
      }
      currentFunction.totalActions++;
      globalTotalActions++;

      functionMap.set(functionName, currentFunction);
    });

    const calculatedFunctionScores = Array.from(functionMap.values())
      .map(func => ({
        ...func,
        score: func.totalItems > 0 ? (func.score / func.totalItems) : 0
      }))
      .sort((a, b) => b.score - a.score); // Sort by score descending

    setFunctionScores(calculatedFunctionScores);
    setTotalActionsCompleted(globalActionsCompleted);
    setTotalActions(globalTotalActions);

    // Calculate overall score only from rated items
    calculatedFunctionScores.forEach(func => {
      if (func.totalItems > 0) {
        totalRatedScore += func.score;
        totalRatedItems++;
      }
    });

    setOverallScore(totalRatedItems > 0 ? (totalRatedScore / totalRatedItems) : 0);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 7) return 'text-green-500';
    if (score >= 5) return 'text-yellow-500';
    return 'text-red-500';
  };

  const renderCompletionCircle = (completed: number, total: number) => {
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return (
      <div className="relative inline-flex items-center justify-center">
        <svg className="w-32 h-32">
          <circle
            className="text-gray-700"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="56"
            cx="64"
            cy="64"
          />
          <circle
            className="text-violet-500"
            strokeWidth="8"
            strokeDasharray={`${percentage * 3.51} 351`}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="56"
            cx="64"
            cy="64"
          />
        </svg>
        <span className="absolute text-2xl font-bold text-white">{percentage}%</span>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Score Global Card */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-400 mb-4">Score Global</h2>
          <div className="text-6xl font-bold mb-6">
            <span className={getScoreColor(overallScore)}>{overallScore.toFixed(1)}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium text-gray-400 mb-2">Top Performers</h3>
              {functionScores.slice(0, 3).map(func => (
                <div key={func.name} className="flex justify-between items-center mb-2">
                  <span className="text-white">{func.name}</span>
                  <span className={getScoreColor(func.score)}>{func.score.toFixed(1)}</span>
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-400 mb-2">Need Attention</h3>
              {functionScores.slice(-3).reverse().map(func => (
                <div key={func.name} className="flex justify-between items-center mb-2">
                  <span className="text-white">{func.name}</span>
                  <span className={getScoreColor(func.score)}>{func.score.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Completion Card */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-400 mb-4">Global Completion</h2>
          <div className="flex justify-center mb-4">
            {renderCompletionCircle(totalActionsCompleted, totalActions)}
          </div>
          <div className="text-center text-gray-400">
            {totalActionsCompleted} of {totalActions} actions completed
          </div>
        </div>
      </div>

      {/* Performance by Function */}
      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Performance by Function</h2>
      <div className="grid grid-cols-3 gap-6">
        {functionScores.map(func => (
          <div key={func.name} className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">{func.name}</h3>
              <span className="text-gray-400">→</span>
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-400">Score</div>
              <div className={`text-3xl font-bold ${getScoreColor(func.score)}`}>
                {func.score.toFixed(1)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-400">Completion Rate</div>
              <div className="text-lg text-violet-500">
                {func.totalActions > 0 ? Math.round((func.actionsCompleted / func.totalActions) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-400">Actions Completed</div>
              <div className="text-white">
                {func.actionsCompleted} / {func.totalActions}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScorecardView;
