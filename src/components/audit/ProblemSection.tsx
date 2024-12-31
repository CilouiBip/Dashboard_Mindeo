import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { AuditItem } from '../../types/audit';

interface ProblemSectionProps {
  problemName: string;
  items: AuditItem[];
}

const ProblemSection: React.FC<ProblemSectionProps> = ({ problemName, items }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Group items by Sub_Problems_Text
  const subProblemGroups = items.reduce((acc, item) => {
    if (!acc[item.Sub_Problems_Text]) {
      acc[item.Sub_Problems_Text] = [];
    }
    acc[item.Sub_Problems_Text].push(item);
    return acc;
  }, {} as Record<string, AuditItem[]>);

  return (
    <div className="bg-[#1C1D24] border border-[#2D2E3A] rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#2D2E3A]/50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-medium text-white">{problemName}</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">
              ({items.length} items)
            </span>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-violet-400">
              {items[0].Fonction_Name}
            </span>
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
          {Object.entries(subProblemGroups).map(([subProblem, subProblemItems]) => (
            <div key={subProblem} className="bg-[#1A1B21] rounded-lg p-4">
              <h3 className="text-white font-medium mb-3">{subProblem}</h3>
              <div className="space-y-3">
                {subProblemItems.map(item => (
                  <div 
                    key={item.Item_ID}
                    className="bg-[#2D2E3A] rounded-lg p-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-white text-sm">{item.Item_Name}</h4>
                        <p className="text-gray-400 text-sm mt-1">
                          {item.Action_Required}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-sm text-gray-400">
                            {item.Categorie_Problems_Name}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.Status === 'Completed' 
                            ? 'bg-green-500/10 text-green-400'
                            : item.Status === 'In Progress'
                            ? 'bg-yellow-500/10 text-yellow-400'
                            : 'bg-gray-500/10 text-gray-400'
                        }`}>
                          {item.Status}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.Criticality === 'High'
                            ? 'bg-red-500/10 text-red-400'
                            : item.Criticality === 'Medium'
                            ? 'bg-yellow-500/10 text-yellow-400'
                            : 'bg-green-500/10 text-green-400'
                        }`}>
                          {item.Criticality}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProblemSection;