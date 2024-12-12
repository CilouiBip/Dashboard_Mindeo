import React, { useState, useMemo, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { AuditItem, Status, Priority } from '../../types/airtable';
import { api } from '../../api/airtable';
import { StarRating } from '../ui/star-rating';

interface NewAuditViewProps {
  auditItems: AuditItem[];
}

interface HierarchyItem {
  problems: {
    [problemName: string]: {
      subProblems: {
        [subProblemName: string]: {
          text: string;
          categoryProblems: {
            [categoryName: string]: {
              items: {
                [itemName: string]: {
                  actions: AuditItem[];
                  totalActions: number;
                  completedActions: number;
                };
              };
              totalItems: number;
              completedItems: number;
            };
          };
        };
      };
    };
  };
}

interface ActionProps {
  action: AuditItem;
  onUpdate: () => void;
}

const Action: React.FC<ActionProps> = ({ action, onUpdate }) => {
  const [localScore, setLocalScore] = useState(action.Score || 1);
  const [localStatus, setLocalStatus] = useState<Status>(action.Status);
  const [localCriticality, setLocalCriticality] = useState<Priority>(action.Criticality);
  const [localComments, setLocalComments] = useState(action.Comments || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const statusOptions: Status[] = ['Not Started', 'In Progress', 'Completed'];
  const criticalityOptions: Priority[] = ['Low', 'Medium', 'High'];

  useEffect(() => {
    setLocalScore(action.Score || 1);
    setLocalStatus(action.Status);
    setLocalCriticality(action.Criticality);
    setLocalComments(action.Comments || '');
  }, [action]);

  const handleUpdate = async (updates: { Status?: Status; Score?: number; Criticality?: Priority; Comments?: string }) => {
    try {
      setIsUpdating(true);
      
      await api.updateAuditItem(action.Item_ID, updates);
      
      if (updates.Score !== undefined) setLocalScore(updates.Score);
      if (updates.Status !== undefined) setLocalStatus(updates.Status);
      if (updates.Criticality !== undefined) setLocalCriticality(updates.Criticality);
      if (updates.Comments !== undefined) setLocalComments(updates.Comments);
      
      await onUpdate();
    } catch (error) {
      console.error('Failed to update audit item:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const debouncedUpdateComments = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return (comments: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handleUpdate({ Comments: comments });
      }, 500); // Wait 500ms after user stops typing
    };
  }, []);

  return (
    <div className="bg-[#141517] border border-[#2D2E3A] rounded-lg p-4 hover:border-violet-500/50 transition-all">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-grow">
            <p className="text-sm text-gray-300">{action.Action_Required}</p>
            {action.Playbook_Link && (
              <a
                href={action.Playbook_Link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 hover:text-violet-300 inline-flex items-center gap-1 text-sm mt-1"
              >
                <span>View Playbook</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
          <div className="flex items-center gap-4">
            <StarRating
              value={localScore}
              onChange={(value) => handleUpdate({ Score: value })}
              disabled={isUpdating}
            />
            <select
              value={localStatus}
              onChange={(e) => handleUpdate({ Status: e.target.value as Status })}
              className="px-2 py-1 bg-[#1A1B21] border border-[#2D2E3A] rounded text-sm text-gray-200 focus:border-violet-500 focus:outline-none"
              disabled={isUpdating}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <select
              value={localCriticality}
              onChange={(e) => handleUpdate({ Criticality: e.target.value as Priority })}
              className="px-2 py-1 bg-[#1A1B21] border border-[#2D2E3A] rounded text-sm text-gray-200 focus:border-violet-500 focus:outline-none"
              disabled={isUpdating}
            >
              {criticalityOptions.map((criticality) => (
                <option key={criticality} value={criticality}>
                  {criticality}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-2">
          <textarea
            value={localComments}
            onChange={(e) => {
              setLocalComments(e.target.value);
              debouncedUpdateComments(e.target.value);
            }}
            placeholder="Add comments..."
            className="w-full px-3 py-2 bg-[#1A1B21] border border-[#2D2E3A] rounded text-sm text-gray-200 focus:border-violet-500 focus:outline-none resize-none"
            rows={2}
            disabled={isUpdating}
          />
        </div>
      </div>
    </div>
  );
};

const CompletionBadge: React.FC<{ completed: number; total: number }> = ({ completed, total }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <Badge variant="outline" className="border-[#2D2E3A] text-gray-400">
      {percentage}%
    </Badge>
  );
};

const NewAuditView: React.FC<NewAuditViewProps> = ({ auditItems }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [items, setItems] = useState(auditItems);

  useEffect(() => {
    setItems(auditItems);
  }, [auditItems]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const handleActionUpdate = async () => {
    try {
      const updatedItems = await api.fetchAuditItems();
      setItems(updatedItems);
    } catch (error) {
      console.error('Failed to refresh audit items:', error);
    }
  };

  const isExpanded = (sectionId: string) => expandedSections.has(sectionId);

  const hierarchy = useMemo(() => {
    return items.reduce((acc, item) => {
      if (!item.Fonction_Name || !item.Problems_Name || !item.Sub_Problems_Text || !item.Categorie_Problems_Name) {
        console.log('Skipping incomplete item:', item);
        return acc;
      }

      const functionName = item.Fonction_Name;
      if (!acc[functionName]) {
        acc[functionName] = { problems: {} };
      }

      const problemName = item.Problems_Name;
      if (!acc[functionName].problems[problemName]) {
        acc[functionName].problems[problemName] = { subProblems: {} };
      }

      const subProblemText = item.Sub_Problems_Text;
      if (!acc[functionName].problems[problemName].subProblems[subProblemText]) {
        acc[functionName].problems[problemName].subProblems[subProblemText] = {
          text: subProblemText,
          categoryProblems: {}
        };
      }

      const categoryName = item.Categorie_Problems_Name;
      if (!acc[functionName].problems[problemName].subProblems[subProblemText].categoryProblems[categoryName]) {
        acc[functionName].problems[problemName].subProblems[subProblemText].categoryProblems[categoryName] = {
          items: {},
          totalItems: 0,
          completedItems: 0
        };
      }

      const itemName = item.Item_Name;
      if (!acc[functionName].problems[problemName].subProblems[subProblemText].categoryProblems[categoryName].items[itemName]) {
        acc[functionName].problems[problemName].subProblems[subProblemText].categoryProblems[categoryName].items[itemName] = {
          actions: [],
          totalActions: 0,
          completedActions: 0,
        };
      }

      const itemGroup = acc[functionName].problems[problemName].subProblems[subProblemText].categoryProblems[categoryName].items[itemName];
      itemGroup.actions.push(item);
      itemGroup.totalActions++;
      if (item.Status === 'Completed') {
        itemGroup.completedActions++;
      }

      return acc;
    }, {} as Record<string, HierarchyItem>);
  }, [items]);

  const renderDropdownHeader = (title: string, id: string, count?: { completed: number; total: number }) => (
    <div 
      className="flex items-center justify-between w-full cursor-pointer py-3 px-4 hover:bg-[#2D2E3A]/50 transition-colors rounded-md"
      onClick={() => toggleSection(id)}
    >
      <div className="flex items-center gap-2">
        {isExpanded(id) ? (
          <ChevronDown className="h-5 w-5 text-violet-400" />
        ) : (
          <ChevronRight className="h-5 w-5 text-violet-400" />
        )}
        <span className="text-white font-medium">{title}</span>
      </div>
      {count && (
        <Badge variant="outline" className="border-[#2D2E3A] text-gray-400">
          {count.completed}/{count.total}
        </Badge>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#141517] text-white">
      <Tabs defaultValue={Object.keys(hierarchy)[0]} className="w-full">
        <TabsList className="mb-4 flex-wrap bg-[#1C1D24] border-b border-[#2D2E3A]">
          {Object.keys(hierarchy).map(functionName => (
            <TabsTrigger 
              key={functionName} 
              value={functionName}
              className="data-[state=active]:bg-violet-500 data-[state=active]:text-white"
            >
              {functionName}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(hierarchy).map(([functionName, functionData]) => (
          <TabsContent key={functionName} value={functionName} className="space-y-4">
            {Object.entries(functionData.problems).map(([problemName, problemData]) => (
              <div key={problemName} className="bg-[#1C1D24] border border-[#2D2E3A] rounded-lg hover:border-violet-500/50 transition-all">
                {renderDropdownHeader(problemName, `problem-${problemName}`)}
                
                {isExpanded(`problem-${problemName}`) && (
                  <div className="p-4">
                    {Object.entries(problemData.subProblems).map(([subProblemName, subProblemData]) => {
                      const subProblemTotalActions = Object.values(subProblemData.categoryProblems).reduce((sum, category) => {
                        return sum + Object.values(category.items).reduce((itemSum, item) => itemSum + item.totalActions, 0);
                      }, 0);
                      
                      const subProblemCompletedActions = Object.values(subProblemData.categoryProblems).reduce((sum, category) => {
                        return sum + Object.values(category.items).reduce((itemSum, item) => itemSum + item.completedActions, 0);
                      }, 0);

                      return (
                        <div key={subProblemName} className="mt-4 first:mt-0">
                          <div className="bg-[#1A1B21] border border-[#2D2E3A] rounded-lg p-4 hover:border-violet-500/50 transition-all">
                            {renderDropdownHeader(
                              <div className="flex items-center gap-2">
                                <span className="text-white">{subProblemData.text}</span>
                                <CompletionBadge completed={subProblemCompletedActions} total={subProblemTotalActions} />
                              </div>,
                              `subproblem-${problemName}-${subProblemName}`
                            )}
                            
                            {isExpanded(`subproblem-${problemName}-${subProblemName}`) && (
                              <div className="mt-4 space-y-4">
                                {Object.entries(subProblemData.categoryProblems).map(([categoryName, categoryData]) => {
                                  const totalActions = Object.values(categoryData.items).reduce((sum, item) => sum + item.totalActions, 0);
                                  const completedActions = Object.values(categoryData.items).reduce((sum, item) => sum + item.completedActions, 0);
                                  
                                  return (
                                    <div key={categoryName} className="bg-[#18191F] border border-[#2D2E3A] rounded-lg p-4 hover:border-violet-500/50 transition-all">
                                      {renderDropdownHeader(
                                        <div className="flex items-center gap-2">
                                          <span className="text-white">{categoryName}</span>
                                          <CompletionBadge completed={completedActions} total={totalActions} />
                                        </div>,
                                        `category-${problemName}-${subProblemName}-${categoryName}`
                                      )}
                                      
                                      {isExpanded(`category-${problemName}-${subProblemName}-${categoryName}`) && (
                                        <div className="mt-4 space-y-4">
                                          {Object.entries(categoryData.items).map(([itemName, itemData]) => (
                                            <div key={itemName} className="bg-[#161718] border border-[#2D2E3A] rounded-lg p-4">
                                              <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-medium text-white">{itemName}</h4>
                                                <CompletionBadge completed={itemData.completedActions} total={itemData.totalActions} />
                                              </div>
                                              <div className="mt-4 space-y-2">
                                                {itemData.actions.map((action) => (
                                                  <Action key={action.Item_ID} action={action} onUpdate={handleActionUpdate} />
                                                ))}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default NewAuditView;
