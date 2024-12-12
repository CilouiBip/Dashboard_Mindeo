import React, { useState } from 'react';
import { KPI } from '../../types/airtable';
import KPICard from './KPICard';

interface KPIFunctionGridProps {
  functions: string[];
  kpis: Record<string, KPI[]>;
  onUpdate: (id: string, value: number) => Promise<void>;
  isUpdating: boolean;
}

const KPIFunctionGrid: React.FC<KPIFunctionGridProps> = ({
  functions,
  kpis,
  onUpdate,
  isUpdating,
}) => {
  const [expandedFunction, setExpandedFunction] = useState<string | null>(null);

  const handleFunctionClick = (functionName: string) => {
    setExpandedFunction(expandedFunction === functionName ? null : functionName);
  };

  const getFunctionColor = (functionName: string) => {
    switch (functionName.toLowerCase()) {
      case 'content':
        return 'bg-violet-500/10 text-violet-400 hover:bg-violet-500/20';
      case 'marketing':
        return 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20';
      case 'sales':
        return 'bg-green-500/10 text-green-400 hover:bg-green-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 hover:bg-gray-500/20';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {functions.map((functionName) => {
        const isExpanded = expandedFunction === functionName;
        const functionKPIs = kpis[functionName] || [];
        const hasKPIs = functionKPIs.length > 0;

        return (
          <div
            key={functionName}
            className={`transition-all duration-300 ease-in-out ${
              isExpanded ? 'col-span-full row-span-2' : ''
            }`}
          >
            {/* Function Header */}
            <button
              onClick={() => handleFunctionClick(functionName)}
              className={`w-full p-4 rounded-lg ${getFunctionColor(
                functionName
              )} transition-colors flex items-center justify-between ${
                hasKPIs ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
              }`}
              disabled={!hasKPIs}
            >
              <span className="text-lg font-medium">{functionName}</span>
              <span className="text-sm opacity-75">
                {functionKPIs.length} KPIs
              </span>
            </button>

            {/* KPIs Grid */}
            {isExpanded && hasKPIs && (
              <div className="mt-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {functionKPIs.map((kpi) => (
                  <KPICard
                    key={kpi.ID_KPI}
                    kpi={kpi}
                    onUpdate={onUpdate}
                    isUpdating={isUpdating}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default KPIFunctionGrid;
