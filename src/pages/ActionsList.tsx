import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/airtable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { Card } from '../components/ui/card';
import { ChevronDown, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface ActionItem {
  id: string;
  Fonction_Name: string;
  Problems_Name: string;
  Sub_Problems_Text: string;
  Categorie_Problems_Name: string;
  Item_Name: string;
  Action_Required: string;
  Status: string;
  Criticality: string;
}

interface ItemWithActions {
  itemName: string;
  actions: ActionItem[];
}

interface HierarchyNode {
  name: string;
  items?: ItemWithActions[];
  children: Record<string, HierarchyNode>;
  level?: 'function' | 'problem' | 'subproblem' | 'category';
  score?: number;
}

const ActionsList = () => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [selectedFunction, setSelectedFunction] = useState<string>('Content');
  
  const { data: fullListItems, isLoading, error } = useQuery({
    queryKey: ['fullListItems'],
    queryFn: api.fetchFullList
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error as Error} />;
  if (!fullListItems?.length) return <div>No items found</div>;

  console.log('Total actions received:', fullListItems.length);
  
  // Build hierarchy
  const hierarchy: Record<string, HierarchyNode> = {};
  
  // First, group items by their hierarchy path and Item_Name
  const itemGroups = new Map<string, Map<string, ActionItem[]>>();
  
  let totalActionsGrouped = 0;
  
  fullListItems.forEach((item) => {
    if (!item.Action_Required) return;
    totalActionsGrouped++;

    const path = `${item.Fonction_Name}/${item.Problems_Name}/${item.Sub_Problems_Text}/${item.Categorie_Problems_Name}`;
    if (!itemGroups.has(path)) {
      itemGroups.set(path, new Map());
    }
    
    const itemsInPath = itemGroups.get(path)!;
    if (!itemsInPath.has(item.Item_Name)) {
      itemsInPath.set(item.Item_Name, []);
    }
    
    // Add the action to the array of actions for this item
    const actions = itemsInPath.get(item.Item_Name)!;
    const actionExists = actions.some(a => a.Action_Required === item.Action_Required);
    if (!actionExists) {
      actions.push(item);
    }
  });

  console.log('Total actions after grouping:', totalActionsGrouped);
  
  // Log the structure of a few items to verify multiple actions
  let itemsLogged = 0;
  itemGroups.forEach((itemsMap, path) => {
    if (itemsLogged < 5) {
      itemsMap.forEach((actions, itemName) => {
        console.log(`Path: ${path}, Item: ${itemName}, Actions: ${actions.length}`);
        console.log('Actions:', actions.map(a => a.Action_Required));
        itemsLogged++;
      });
    }
  });

  // Build the hierarchy structure
  itemGroups.forEach((itemsMap, path) => {
    const [functionName, problemName, subProblemText, categoryName] = path.split('/');

    // Initialize function
    if (!hierarchy[functionName]) {
      hierarchy[functionName] = { 
        name: functionName, 
        children: {}, 
        items: [],
        level: 'function'
      };
    }

    // Initialize problem
    if (!hierarchy[functionName].children[problemName]) {
      hierarchy[functionName].children[problemName] = { 
        name: problemName, 
        children: {}, 
        items: [],
        level: 'problem'
      };
    }

    // Initialize sub-problem
    if (!hierarchy[functionName].children[problemName].children[subProblemText]) {
      hierarchy[functionName].children[problemName].children[subProblemText] = {
        name: subProblemText,
        children: {},
        items: [],
        level: 'subproblem'
      };
    }

    // Initialize category
    if (!hierarchy[functionName].children[problemName].children[subProblemText].children[categoryName]) {
      hierarchy[functionName].children[problemName].children[subProblemText].children[categoryName] = {
        name: categoryName,
        children: {},
        items: [],
        level: 'category'
      };
    }

    // Add items with their actions
    const categoryNode = hierarchy[functionName].children[problemName].children[subProblemText].children[categoryName];
    categoryNode.items = Array.from(itemsMap.entries()).map(([itemName, actions]) => ({
      itemName,
      actions
    }));
  });

  const toggleSection = (path: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const getNodeStyle = (level: HierarchyNode['level']) => {
    switch (level) {
      case 'function':
        return 'bg-[#1F2937]/35 hover:bg-[#1F2937] text-lg font-semibold p-4';
      case 'problem':
        return 'bg-[#1F2937]/25 hover:bg-[#1F2937] text-base font-medium p-4';
      case 'subproblem':
        return 'bg-[#1F2937]/15 hover:bg-[#1F2937] text-sm p-4';
      case 'category':
        return 'bg-[#1F2937]/10 hover:bg-[#1F2937] text-sm p-4';
      default:
        return 'bg-[#1F2937]/10 hover:bg-[#1F2937] text-sm p-4';
    }
  };

  const renderNode = (node: HierarchyNode, path: string, level: number = 0) => {
    const isExpanded = expandedSections[path];
    const hasChildren = Object.keys(node.children).length > 0 || (node.items && node.items.length > 0);

    return (
      <div key={path} className="transition-all duration-150">
        <div 
          className={clsx(
            'flex items-center justify-between cursor-pointer rounded-lg transition-colors',
            getNodeStyle(node.level),
            level > 0 && 'mt-2'
          )}
          onClick={() => toggleSection(path)}
        >
          <div className="flex items-center space-x-3">
            {hasChildren && (
              <div className="transition-transform duration-150">
                {isExpanded ? (
                  <ChevronDown className={clsx(
                    "text-purple-400",
                    node.level === 'function' ? 'h-6 w-6' : 'h-5 w-5'
                  )} />
                ) : (
                  <ChevronRight className={clsx(
                    "text-purple-400",
                    node.level === 'function' ? 'h-6 w-6' : 'h-5 w-5'
                  )} />
                )}
              </div>
            )}
            <span className={clsx(
              "text-gray-100",
              node.level === 'function' && 'tracking-wide',
              node.level === 'problem' && 'tracking-wide'
            )}>{node.name}</span>
          </div>
          {node.score !== undefined && (
            <span className={clsx(
              'px-3 py-1.5 rounded-full transition-colors duration-150',
              node.level === 'function' ? 'text-base' : 'text-sm',
              'font-medium',
              node.score >= 70 ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' :
              node.score >= 40 ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' :
              'bg-red-500/20 text-red-400 hover:bg-red-500/30'
            )}>
              {node.score}%
            </span>
          )}
        </div>

        {isExpanded && (
          <div className={clsx(
            'space-y-2 transition-all duration-150',
            level > 0 && level < 2 ? 'ml-8' : 'ml-6'
          )}>
            {node.items?.map((item, index) => (
              <Card key={index} className={clsx(
                "p-6 border-0 transition-all duration-150",
                node.level === 'function' ? 'bg-gray-800/50' : 'bg-gray-800/40',
                'hover:bg-gray-800/60'
              )}>
                <h3 className={clsx(
                  "font-medium text-gray-200 tracking-wide",
                  node.level === 'function' ? 'text-lg' : 'text-base'
                )}>{item.itemName}</h3>
                <div className="mt-4 space-y-4">
                  {item.actions.map((action, actionIndex) => (
                    <div key={actionIndex} className="text-sm text-gray-300 bg-gray-800/30 p-4 rounded-lg hover:bg-gray-800/40 transition-all duration-150">
                      {action.Action_Required}
                      <div className="flex items-center space-x-3 mt-3">
                        {action.Status && (
                          <span className={clsx(
                            'px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-150',
                            action.Status === 'Completed' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' :
                            action.Status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' :
                            'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                          )}>
                            {action.Status}
                          </span>
                        )}
                        {action.Criticality && (
                          <span className={clsx(
                            'px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-150',
                            action.Criticality === 'High' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' :
                            action.Criticality === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' :
                            'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          )}>
                            {action.Criticality}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
            {Object.entries(node.children).map(([childName, childNode]) => 
              renderNode(childNode, `${path}-${childName}`, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  const functions = ['Content', 'Marketing', 'Sales'];

  return (
    <div className="py-8 px-8">
      {/* Function Tabs */}
      <div className="flex space-x-6 mb-8 border-b border-gray-700/50">
        {functions.map((func) => (
          <button
            key={func}
            onClick={() => setSelectedFunction(func)}
            className={clsx(
              'px-6 py-3 text-lg font-semibold rounded-t-lg transition-all duration-150',
              selectedFunction === func
                ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg translate-y-px'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
            )}
          >
            {func}
          </button>
        ))}
      </div>

      {/* Hierarchy Content - Start directly with problems */}
      <div className="space-y-4">
        {hierarchy[selectedFunction] && 
          Object.entries(hierarchy[selectedFunction].children).map(([childName, childNode]) => 
            renderNode(childNode, childName, 0)
          )
        }
      </div>
    </div>
  );
};

export default ActionsList;
