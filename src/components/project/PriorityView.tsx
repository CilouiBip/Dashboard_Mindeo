import React, { useEffect, useState } from 'react';
import { api } from '../../api/airtable';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

interface ActionItem {
  id: string;
  action: string;
  actionWeek: string;
  status: string;
}

// Mapping entre l'affichage UI et les valeurs Airtable
const STATUS_OPTIONS = {
  'Non Démarré': 'Not Started',
  'En Cours': 'In Progress',
  'Terminé': 'Completed'
} as const;

const STATUS_COLORS = {
  'Non Démarré': 'bg-gray-500',
  'En Cours': 'bg-blue-600',
  'Terminé': 'bg-green-600'
} as const;

// Mapping inverse pour l'affichage
const STATUS_LABELS = {
  'Not Started': 'Non Démarré',
  'In Progress': 'En Cours',
  'Completed': 'Terminé'
};

const PriorityView: React.FC = () => {
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isImmediateOpen, setIsImmediateOpen] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const actionsList = await api.fetchPriorityItems();
    console.log('Loaded actions:', actionsList);
    setActions(actionsList);
    setLoading(false);
  };

  const handleStatusUpdate = async (actionId: string, newStatus: string) => {
    try {
      setUpdatingStatus(actionId);
      // On envoie directement la valeur Airtable
      console.log('Updating status to:', newStatus);
      await api.updateActionStatus(actionId, STATUS_OPTIONS[newStatus as keyof typeof STATUS_OPTIONS]);
      await loadData();
      setIsStatusMenuOpen(null);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const immediateActions = actions.filter(action => action.actionWeek === 'S1-2');

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview - Global Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-[#141517] rounded-lg">
          <h3 className="text-lg font-semibold text-white">Total Actions</h3>
          <p className="text-3xl font-bold text-white">{actions.length}</p>
          <p className="text-sm text-gray-400">Nombre total d'actions</p>
        </div>
        <div className="p-4 bg-[#141517] rounded-lg">
          <h3 className="text-lg font-semibold text-white">En Cours</h3>
          <p className="text-3xl font-bold text-white">
            {actions.filter(a => STATUS_LABELS[a.status] === 'En Cours').length}
          </p>
          <p className="text-sm text-gray-400">Actions en cours</p>
        </div>
        <div className="p-4 bg-[#141517] rounded-lg">
          <h3 className="text-lg font-semibold text-white">Terminées</h3>
          <p className="text-3xl font-bold text-white">
            {actions.filter(a => STATUS_LABELS[a.status] === 'Terminé').length}
          </p>
          <p className="text-sm text-gray-400">Actions terminées</p>
        </div>
      </div>

      {/* Immediate Actions Section */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <button
          className="w-full p-4 flex justify-between items-center hover:bg-gray-700 transition-colors"
          onClick={() => setIsImmediateOpen(!isImmediateOpen)}
        >
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-white">Actions Immédiates (S1-S2)</h2>
            <span className="ml-4 px-3 py-1 text-sm bg-gray-700 rounded-full text-white">
              {immediateActions.length} tâches
            </span>
          </div>
          {isImmediateOpen ? (
            <ChevronUpIcon className="h-6 w-6 text-gray-400" />
          ) : (
            <ChevronDownIcon className="h-6 w-6 text-gray-400" />
          )}
        </button>
        
        {isImmediateOpen && (
          <div className="p-4 space-y-2">
            {immediateActions.length > 0 ? (
              immediateActions.map((actionItem) => (
                <div 
                  key={actionItem.id} 
                  className="p-4 bg-gray-700 rounded-lg flex justify-between items-center hover:bg-gray-600 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-white">{actionItem.action}</p>
                    <p className="text-sm text-gray-400">Semaine {actionItem.actionWeek}</p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setIsStatusMenuOpen(isStatusMenuOpen === actionItem.id ? null : actionItem.id)}
                      className={`px-4 py-2 text-sm rounded-md flex items-center space-x-2 ${STATUS_COLORS[STATUS_LABELS[actionItem.status] || 'Non Démarré']} text-white`}
                      disabled={updatingStatus === actionItem.id}
                    >
                      <span>{STATUS_LABELS[actionItem.status] || 'Non Démarré'}</span>
                      <ChevronDownIcon className="h-4 w-4" />
                    </button>

                    {isStatusMenuOpen === actionItem.id && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div className="py-1" role="menu">
                          {Object.entries(STATUS_LABELS).map(([value, label]) => (
                            <button
                              key={value}
                              onClick={() => handleStatusUpdate(actionItem.id, label)}
                              className={`block w-full text-left px-4 py-2 text-sm ${
                                STATUS_LABELS[actionItem.status] === label ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                              } hover:bg-gray-100`}
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
              ))
            ) : (
              <div className="text-center p-4 text-gray-400">
                Aucune action immédiate pour le moment
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PriorityView;
