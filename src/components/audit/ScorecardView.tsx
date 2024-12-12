import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { AuditItem } from '../../types/airtable';
import { Card } from '../ui/card';
import { CompletionCircle } from '../ui/completion-circle';
import { CompletionBar } from '../ui/completion-bar';
import { ScoreDisplay } from '../ui/score-display';
import { FunctionIcon } from './FunctionIcon';
import { PerformanceItem } from './PerformanceItem';

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

      if (item.Score !== undefined && item.Score !== null) {
        currentFunction.score += item.Score;
        currentFunction.totalItems++;
      }

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
      .sort((a, b) => b.score - a.score);

    setFunctionScores(calculatedFunctionScores);
    setTotalActionsCompleted(globalActionsCompleted);
    setTotalActions(globalTotalActions);

    calculatedFunctionScores.forEach(func => {
      if (func.totalItems > 0) {
        totalRatedScore += func.score;
        totalRatedItems++;
      }
    });

    setOverallScore(totalRatedItems > 0 ? (totalRatedScore / totalRatedItems) : 0);
  };

  const topPerformers = functionScores.slice(0, 3);
  const needAttention = functionScores.slice(-3).reverse();
  const completionPercentage = totalActions > 0 ? (totalActionsCompleted / totalActions) * 100 : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Score Global Card */}
        <Card className="bg-[#1C1D24] border border-[#2D2E3A] rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-200 mb-4">Score Global</h2>
          <ScoreDisplay value={overallScore} size="lg" />
          
          <div className="grid grid-cols-2 gap-x-8 mt-6">
            <div className="space-y-4">
              <h3 className="text-sm text-gray-400">Top Performers</h3>
              {topPerformers.map(item => (
                <PerformanceItem key={item.name} name={item.name} score={item.score} />
              ))}
            </div>
            <div className="space-y-4">
              <h3 className="text-sm text-gray-400">Need Attention</h3>
              {needAttention.map(item => (
                <PerformanceItem key={item.name} name={item.name} score={item.score} />
              ))}
            </div>
          </div>
        </Card>

        {/* Global Completion Card */}
        <Card className="bg-[#1C1D24] border border-[#2D2E3A] rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-200 mb-6">Global Completion</h2>
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <CompletionCircle 
              percentage={completionPercentage} 
              size={200}
              strokeWidth={12}
              className="mb-6"
            />
            <p className="text-sm text-gray-400">
              {totalActionsCompleted} of {totalActions} actions completed
            </p>
          </div>
        </Card>
      </div>

      {/* Function Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {functionScores.map(func => {
          const completionPercentage = func.totalActions > 0 
            ? (func.actionsCompleted / func.totalActions) * 100 
            : 0;

          return (
            <Card
              key={func.name}
              className="bg-[#1C1D24] border border-[#2D2E3A] rounded-lg p-6 hover:border-violet-500/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FunctionIcon name={func.name} />
                  <h3 className="font-medium text-gray-200">{func.name}</h3>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                <ScoreDisplay value={func.score} size="md" />
                <CompletionBar 
                  percentage={completionPercentage} 
                  className="h-1.5"
                />
                <p className="text-sm text-gray-400">
                  {func.actionsCompleted} / {func.totalActions} actions
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ScorecardView;
