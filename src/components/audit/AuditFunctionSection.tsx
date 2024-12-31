import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { HierarchyNode } from '../../types/audit';
import AuditProblemSection from './AuditProblemSection';

interface AuditFunctionSectionProps {
  functionName: string;
  functionData: HierarchyNode;
  isExpanded: boolean;
  onToggle: () => void;
}

const AuditFunctionSection: React.FC<AuditFunctionSectionProps> = ({
  functionName,
  functionData,
  isExpanded,
  onToggle
}) => {
  console.log('Function data:', functionName, functionData);

  return (
    <div className="bg-[#1C1D24] border border-[#2D2E3A] rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#2D2E3A]/50 transition-colors"
      >
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-medium text-white">{functionName}</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">
              ({functionData.items.length} items)
            </span>
            <span className="text-sm text-violet-400">
              {functionData.completionRate.toFixed(0)}% Complete
            </span>
            {functionData.averageScore > 0 && (
              <span className="text-sm text-blue-400">
                Avg Score: {functionData.averageScore.toFixed(1)}
              </span>
            )}
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="px-6 pb-4 space-y-4">
          {Object.entries(functionData.children).map(([problemName, problemData]) => (
            <AuditProblemSection
              key={problemName}
              problemName={problemName}
              problemData={problemData}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AuditFunctionSection;