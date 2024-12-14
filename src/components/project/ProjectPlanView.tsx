import React, { useState } from 'react';
import { AuditItem } from '../../types/airtable';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../../api/airtable';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ProjectPlanViewProps {
  items: AuditItem[];
}

interface GroupedItems {
  [functionName: string]: {
    [problemName: string]: {
      [subProblemName: string]: AuditItem[];
    };
  };
}

const STATUS_OPTIONS = ['Not Started', 'In Progress', 'Completed'];
const CRITICALITY_OPTIONS = ['High', 'Medium', 'Low'];

const ActionItem: React.FC<{ item: AuditItem }> = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const queryClient = useQueryClient();

  const updateItemMutation = useMutation({
    mutationFn: async ({ itemId, field, value }: { itemId: string; field: string; value: string }) => {
      await api.updateAuditItem(itemId, { [field]: value });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectPlanItems'] });
    },
  });

  return (
    <div className="bg-[#141517] rounded-lg p-3 hover:border-violet-500/50 transition-all border border-[#2D2E3A]">
      <div 
        className="flex justify-between items-start cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <p className="text-sm text-gray-300">{item.Action_Required}</p>
          {!isExpanded && item.Playbook_Link && (
            <a
              href={item.Playbook_Link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300 text-sm mt-2 inline-block"
              onClick={(e) => e.stopPropagation()}
            >
              View Playbook →
            </a>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-blue-400">
            Score: {item.Score || 'N/A'}
          </div>
          <select
            value={item.Criticality || ''}
            onChange={(e) => {
              e.stopPropagation();
              updateItemMutation.mutate({
                itemId: item.Item_ID,
                field: 'Criticality',
                value: e.target.value,
              });
            }}
            onClick={(e) => e.stopPropagation()}
            className={`text-sm rounded px-2 py-1 border focus:outline-none focus:border-violet-500 ${
              item.Criticality === 'High' 
                ? 'bg-red-500/10 text-red-400 border-red-500/30'
                : item.Criticality === 'Medium'
                ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                : item.Criticality === 'Low'
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                : 'bg-[#2D2E3A] text-gray-300 border-[#3D3E4A]'
            }`}
          >
            <option value="">Select Criticality</option>
            {CRITICALITY_OPTIONS.map(criticality => (
              <option key={criticality} value={criticality}>{criticality}</option>
            ))}
          </select>
          <select
            value={item.Status || 'Not Started'}
            onChange={(e) => {
              e.stopPropagation();
              updateItemMutation.mutate({
                itemId: item.Item_ID,
                field: 'Status',
                value: e.target.value,
              });
            }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#2D2E3A] text-sm text-gray-300 rounded px-2 py-1 border border-[#3D3E4A] focus:outline-none focus:border-violet-500"
          >
            {STATUS_OPTIONS.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-4 space-y-3 border-t border-[#2D2E3A] pt-3">
          {item.Playbook_Link && (
            <a
              href={item.Playbook_Link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300 text-sm inline-block"
            >
              View Playbook →
            </a>
          )}
        </div>
      )}
    </div>
  );
};

const ProjectPlanView: React.FC<ProjectPlanViewProps> = ({ items }) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  // Group items by function, problem, and subproblem
  const groupedItems = items.reduce((acc: GroupedItems, item) => {
    const functionName = item.Fonction_Name || 'Other';
    const problemName = item.Problems_Name || 'Other';
    const subProblemName = item.Sub_Problems_Text || 'Other';

    if (!acc[functionName]) {
      acc[functionName] = {};
    }
    if (!acc[functionName][problemName]) {
      acc[functionName][problemName] = {};
    }
    if (!acc[functionName][problemName][subProblemName]) {
      acc[functionName][problemName][subProblemName] = [];
    }

    acc[functionName][problemName][subProblemName].push(item);
    return acc;
  }, {});

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  return (
    <div className="space-y-4">
      {Object.entries(groupedItems).map(([functionName, functionItems]) => (
        <div key={functionName} className="bg-[#1C1D24] border border-[#2D2E3A] rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection(functionName)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#2D2E3A]/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-medium text-white">{functionName}</h2>
            </div>
            {expandedSections.includes(functionName) ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </button>

          {expandedSections.includes(functionName) && (
            <div className="px-6 pb-4 space-y-4">
              {Object.entries(functionItems).map(([problemName, problemItems]) => (
                <div key={problemName} className="bg-[#1A1B21] rounded-lg p-4">
                  <div 
                    className="flex items-center justify-between cursor-pointer mb-3"
                    onClick={() => toggleSection(`${functionName}-${problemName}`)}
                  >
                    <h3 className="text-white font-medium">{problemName}</h3>
                    {expandedSections.includes(`${functionName}-${problemName}`) ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  
                  {expandedSections.includes(`${functionName}-${problemName}`) && (
                    <div className="space-y-3">
                      {Object.entries(problemItems).map(([subProblemName, items]) => (
                        <div key={subProblemName} className="bg-[#2D2E3A] rounded-lg p-3">
                          <div 
                            className="flex items-center justify-between cursor-pointer mb-2"
                            onClick={() => toggleSection(`${functionName}-${problemName}-${subProblemName}`)}
                          >
                            <h4 className="text-white text-sm">{subProblemName}</h4>
                            {expandedSections.includes(`${functionName}-${problemName}-${subProblemName}`) ? (
                              <ChevronUp className="h-4 w-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          
                          {expandedSections.includes(`${functionName}-${problemName}-${subProblemName}`) && (
                            <div className="space-y-2">
                              {items.map(item => (
                                <ActionItem key={item.Item_ID} item={item} />
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProjectPlanView;
