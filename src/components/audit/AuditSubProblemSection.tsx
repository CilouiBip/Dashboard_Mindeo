import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { HierarchyNode } from '../../types/audit';
import AuditCategorySection from './AuditCategorySection';

interface AuditSubProblemSectionProps {
  subProblemName: string;
  subProblemData: HierarchyNode;
}

const AuditSubProblemSection: React.FC<AuditSubProblemSectionProps> = ({
  subProblemName,
  subProblemData
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-[#1E1F26] rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2 flex items-center justify-between hover:bg-[#2D2E3A]/50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <h4 className="text-gray-200 text-sm">{subProblemName}</h4>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-violet-400">
              {subProblemData.completionRate.toFixed(0)}% Complete
            </span>
            {subProblemData.averageScore > 0 && (
              <span className="text-sm text-blue-400">
                Avg Score: {subProblemData.averageScore.toFixed(1)}
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
        <div className="px-3 pb-2 space-y-2">
          {Object.entries(subProblemData.children).map(([categoryName, categoryData]) => (
            <AuditCategorySection
              key={categoryName}
              categoryName={categoryName}
              categoryData={categoryData}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AuditSubProblemSection;