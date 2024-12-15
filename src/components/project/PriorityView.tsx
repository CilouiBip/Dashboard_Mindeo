import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../../api/airtable';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

interface ActionItem {
  id: string;
  action: string;
  actionWeek: string;
  status: string;
  itemName: string;
  functionName: string;
}

// Mapping entre l'affichage UI et les valeurs Airtable
const STATUS_OPTIONS = {
  'Non Démarré': 'Not Started',
  'En Cours': 'In Progress',
  'Terminé': 'Completed'
} as const;

const STATUS_COLORS = {
  'Non Démarré': 'bg-gray-500/80',
  'En Cours': 'bg-purple-600/90',
  'Terminé': 'bg-purple-700/90'
} as const;

// Mapping inverse pour l'affichage
const STATUS_LABELS = {
  'Not Started': 'Non Démarré',
  'In Progress': 'En Cours',
  'Completed': 'Terminé'
};

// Classes CSS communes
const CARD_CLASSES = 'bg-gray-800/50 hover:bg-gray-700/60 transition-all duration-200';
const HEADER_CLASSES = 'bg-gray-900/70';

interface GroupedActions {
  [functionName: string]: {
    [itemName: string]: ActionItem[];
  };
}

const PriorityView: React.FC = () => {
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isImmediateOpen, setIsImmediateOpen] = useState(true);
  const [isNextOpen, setIsNextOpen] = useState(true);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [expandedFunctions, setExpandedFunctions] = useState<Set<string>>(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadActions = async () => {
      try {
        setLoading(true);
        const data = await api.fetchPriorityItems();
        setActions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    loadActions();
  }, []);

  const immediateActions = useMemo(() => {
    const filteredActions = actions.filter(action => action.actionWeek === 'S1-2');
    const grouped: GroupedActions = {};
    
    filteredActions.forEach(action => {
      if (!grouped[action.functionName]) {
        grouped[action.functionName] = {};
      }
      if (!grouped[action.functionName][action.itemName]) {
        grouped[action.functionName][action.itemName] = [];
      }
      grouped[action.functionName][action.itemName].push(action);
    });
    
    return grouped;
  }, [actions]);

  const nextActions = useMemo(() => {
    const filteredActions = actions.filter(action => action.actionWeek === 'S3-4');
    const grouped: GroupedActions = {};
    
    filteredActions.forEach(action => {
      if (!grouped[action.functionName]) {
        grouped[action.functionName] = {};
      }
      if (!grouped[action.functionName][action.itemName]) {
        grouped[action.functionName][action.itemName] = [];
      }
      grouped[action.functionName][action.itemName].push(action);
    });
    
    return grouped;
  }, [actions]);

  const toggleFunction = (functionName: string) => {
    setExpandedFunctions(prev => {
      const next = new Set(prev);
      if (next.has(functionName)) {
        next.delete(functionName);
      } else {
        next.add(functionName);
      }
      return next;
    });
  };

  const toggleItem = (itemName: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(itemName)) {
        next.delete(itemName);
      } else {
        next.add(itemName);
      }
      return next;
    });
  };

  const handleStatusUpdate = async (actionId: string, newStatus: string) => {
    try {
      setUpdatingStatus(actionId);
      // On envoie directement la valeur Airtable
      console.log('Updating status to:', newStatus);
      await api.updateActionStatus(actionId, STATUS_OPTIONS[newStatus as keyof typeof STATUS_OPTIONS]);
      await loadActions();
      setIsStatusMenuOpen(null);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview - Global Stats */}
      <div className="grid grid-cols-3 gap-4">
        {/* Les cartes de statistiques */}
        <div className={CARD_CLASSES + " rounded-lg"}>
          <h3 className="text-lg font-semibold text-gray-200">Total Actions</h3>
          <p className="text-3xl font-bold text-white">{actions.length}</p>
          <p className="text-sm text-gray-400">Nombre total d'actions</p>
        </div>
        <div className={CARD_CLASSES + " rounded-lg"}>
          <h3 className="text-lg font-semibold text-gray-200">En Cours</h3>
          <p className="text-3xl font-bold text-white">
            {actions.filter(a => STATUS_LABELS[a.status] === 'En Cours').length}
          </p>
          <p className="text-sm text-gray-400">Actions en cours</p>
        </div>
        <div className={CARD_CLASSES + " rounded-lg"}>
          <h3 className="text-lg font-semibold text-gray-200">Terminées</h3>
          <p className="text-3xl font-bold text-white">
            {actions.filter(a => STATUS_LABELS[a.status] === 'Terminé').length}
          </p>
          <p className="text-sm text-gray-400">Actions terminées</p>
        </div>
      </div>

      {/* Immediate Actions Section */}
      <div className={HEADER_CLASSES + " rounded-lg overflow-hidden mb-4"}>
        <button
          className="w-full p-4 flex justify-between items-center hover:bg-purple-600/20 transition-all duration-200"
          onClick={() => setIsImmediateOpen(!isImmediateOpen)}
        >
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-gray-200">Actions Immédiates (S1-S2)</h2>
            <span className="ml-4 px-3 py-1 text-sm bg-purple-600/30 rounded-full text-gray-200">
              {Object.values(immediateActions).reduce((total, items) => 
                total + Object.values(items).reduce((sum, actions) => sum + actions.length, 0), 0)
              } tâches
            </span>
          </div>
          {isImmediateOpen ? (
            <ChevronUpIcon className="h-6 w-6 text-gray-400" />
          ) : (
            <ChevronDownIcon className="h-6 w-6 text-gray-400" />
          )}
        </button>
        
        {isImmediateOpen && (
          <div className="p-4 space-y-4">
            {Object.entries(immediateActions).length > 0 ? (
              Object.entries(immediateActions).map(([functionName, items]) => (
                <div key={functionName} className="space-y-2">
                  <button
                    onClick={() => toggleFunction(functionName)}
                    className="w-full p-3 bg-gray-800/70 rounded-lg flex justify-between items-center hover:bg-gray-700/80 transition-all duration-200"
                  >
                    <div className="flex items-center">
                      <h3 className="text-lg font-semibold text-gray-200">{functionName}</h3>
                      <span className="ml-3 px-2 py-1 text-sm bg-purple-600/20 rounded-full text-gray-300">
                        {Object.values(items).reduce((sum, actions) => sum + actions.length, 0)} actions
                      </span>
                    </div>
                    {expandedFunctions.has(functionName) ? (
                      <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>

                  {expandedFunctions.has(functionName) && (
                    <div className="pl-4 space-y-2">
                      {Object.entries(items).map(([itemName, actions]) => (
                        <div key={itemName} className="space-y-2">
                          <button
                            onClick={() => toggleItem(itemName)}
                            className="w-full p-3 bg-gray-800/50 rounded-lg flex justify-between items-center hover:bg-gray-700/60 transition-all duration-200"
                          >
                            <div className="flex items-center">
                              <h4 className="text-md font-medium text-gray-200">{itemName}</h4>
                              <span className="ml-3 px-2 py-1 text-sm bg-purple-600/10 rounded-full text-gray-300">
                                {actions.length} actions
                              </span>
                            </div>
                            {expandedItems.has(itemName) ? (
                              <ChevronUpIcon className="h-4 w-4 text-gray-400" />
                            ) : (
                              <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                            )}
                          </button>

                          {expandedItems.has(itemName) && (
                            <div className="pl-4 space-y-2">
                              {actions.map((actionItem) => (
                                <div 
                                  key={actionItem.id} 
                                  className={CARD_CLASSES + " rounded-lg flex justify-between items-center hover:bg-gray-700/60 transition-all duration-200 p-3"}
                                >
                                  <div className="flex-1">
                                    <p className="text-gray-200">{actionItem.action}</p>
                                    <p className="text-sm text-gray-400">Semaine {actionItem.actionWeek}</p>
                                  </div>
                                  <div className="relative">
                                    <button
                                      onClick={() => setIsStatusMenuOpen(isStatusMenuOpen === actionItem.id ? null : actionItem.id)}
                                      className={`px-4 py-2 text-sm rounded-md flex items-center space-x-2 ${STATUS_COLORS[STATUS_LABELS[actionItem.status] || 'Non Démarré']} text-white hover:opacity-90 transition-opacity`}
                                      disabled={updatingStatus === actionItem.id}
                                    >
                                      <span>{STATUS_LABELS[actionItem.status] || 'Non Démarré'}</span>
                                      <ChevronDownIcon className="h-4 w-4" />
                                    </button>

                                    {isStatusMenuOpen === actionItem.id && (
                                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                                        <div className="py-1" role="menu">
                                          {Object.entries(STATUS_LABELS).map(([value, label]) => (
                                            <button
                                              key={value}
                                              onClick={() => handleStatusUpdate(actionItem.id, label)}
                                              className={`block w-full text-left px-4 py-2 text-sm ${
                                                STATUS_LABELS[actionItem.status] === label ? 'bg-purple-600/20 text-white' : 'text-gray-300'
                                              } hover:bg-purple-600/30 hover:text-white transition-colors`}
                                              role="menuitem"
                                            >
                                              {label}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">Aucune action immédiate</p>
            )}
          </div>
        )}
      </div>

      {/* Next Actions Section */}
      <div className={HEADER_CLASSES + " rounded-lg overflow-hidden"}>
        <button
          className="w-full p-4 flex justify-between items-center hover:bg-purple-600/20 transition-all duration-200"
          onClick={() => setIsNextOpen(!isNextOpen)}
        >
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-gray-200">Next Actions (S3-S4)</h2>
            <span className="ml-4 px-3 py-1 text-sm bg-purple-600/30 rounded-full text-gray-200">
              {Object.values(nextActions).reduce((total, items) => 
                total + Object.values(items).reduce((sum, actions) => sum + actions.length, 0), 0)
              } tâches
            </span>
          </div>
          {isNextOpen ? (
            <ChevronUpIcon className="h-6 w-6 text-gray-400" />
          ) : (
            <ChevronDownIcon className="h-6 w-6 text-gray-400" />
          )}
        </button>
        
        {isNextOpen && (
          <div className="p-4 space-y-4">
            {Object.entries(nextActions).length > 0 ? (
              Object.entries(nextActions).map(([functionName, items]) => (
                <div key={functionName} className="space-y-2">
                  <button
                    onClick={() => toggleFunction(functionName)}
                    className="w-full p-3 bg-gray-800/70 rounded-lg flex justify-between items-center hover:bg-gray-700/80 transition-all duration-200"
                  >
                    <div className="flex items-center">
                      <h3 className="text-lg font-semibold text-gray-200">{functionName}</h3>
                      <span className="ml-3 px-2 py-1 text-sm bg-purple-600/20 rounded-full text-gray-300">
                        {Object.values(items).reduce((sum, actions) => sum + actions.length, 0)} actions
                      </span>
                    </div>
                    {expandedFunctions.has(functionName) ? (
                      <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>

                  {expandedFunctions.has(functionName) && (
                    <div className="pl-4 space-y-2">
                      {Object.entries(items).map(([itemName, actions]) => (
                        <div key={itemName} className="space-y-2">
                          <button
                            onClick={() => toggleItem(itemName)}
                            className="w-full p-3 bg-gray-800/50 rounded-lg flex justify-between items-center hover:bg-gray-700/60 transition-all duration-200"
                          >
                            <div className="flex items-center">
                              <h4 className="text-md font-medium text-gray-200">{itemName}</h4>
                              <span className="ml-3 px-2 py-1 text-sm bg-purple-600/10 rounded-full text-gray-300">
                                {actions.length} actions
                              </span>
                            </div>
                            {expandedItems.has(itemName) ? (
                              <ChevronUpIcon className="h-4 w-4 text-gray-400" />
                            ) : (
                              <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                            )}
                          </button>

                          {expandedItems.has(itemName) && (
                            <div className="pl-4 space-y-2">
                              {actions.map((actionItem) => (
                                <div 
                                  key={actionItem.id} 
                                  className={CARD_CLASSES + " rounded-lg flex justify-between items-center hover:bg-gray-700/60 transition-all duration-200 p-3"}
                                >
                                  <div className="flex-1">
                                    <p className="text-gray-200">{actionItem.action}</p>
                                    <p className="text-sm text-gray-400">Semaine {actionItem.actionWeek}</p>
                                  </div>
                                  <div className="relative">
                                    <button
                                      onClick={() => setIsStatusMenuOpen(isStatusMenuOpen === actionItem.id ? null : actionItem.id)}
                                      className={`px-4 py-2 text-sm rounded-md flex items-center space-x-2 ${STATUS_COLORS[STATUS_LABELS[actionItem.status] || 'Non Démarré']} text-white hover:opacity-90 transition-opacity`}
                                      disabled={updatingStatus === actionItem.id}
                                    >
                                      <span>{STATUS_LABELS[actionItem.status] || 'Non Démarré'}</span>
                                      <ChevronDownIcon className="h-4 w-4" />
                                    </button>

                                    {isStatusMenuOpen === actionItem.id && (
                                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                                        <div className="py-1" role="menu">
                                          {Object.entries(STATUS_LABELS).map(([value, label]) => (
                                            <button
                                              key={value}
                                              onClick={() => handleStatusUpdate(actionItem.id, label)}
                                              className={`block w-full text-left px-4 py-2 text-sm ${
                                                STATUS_LABELS[actionItem.status] === label ? 'bg-purple-600/20 text-white' : 'text-gray-300'
                                              } hover:bg-purple-600/30 hover:text-white transition-colors`}
                                              role="menuitem"
                                            >
                                              {label}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">Aucune action planifiée</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PriorityView;
