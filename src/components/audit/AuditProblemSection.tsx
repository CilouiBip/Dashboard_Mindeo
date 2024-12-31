import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { HierarchyNode } from '../../types/audit';
import AuditSubProblemSection from './AuditSubProblemSection';

interface AuditProblemSectionProps {
  problemName: string;
  problemData: HierarchyNode;
}

const AuditProblemSection: React.FC<AuditProblemSectionProps> = ({
  problemName,
  problemData
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-[#1A1B21] rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#2D2E3A]/50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <h3 className="text-white">{problemName}</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-violet-400">
              {problemData.completionRate.toFixed(0)}% Complete
            </span>
            {problemData.averageScore > 0 && (
              <span className="text-sm text-blue-400">
                Avg Score: {problemData.averageScore.toFixed(1)}
              </span>
            )}
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-3 space-y-3">
          {Object.entries(problemData.children).map(([subProblemName, subProblemData]) => (
            <AuditSubProblemSection
              key={subProblemName}
              subProblemName={subProblemName}
              subProblemData={subProblemData}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AuditProblemSection;