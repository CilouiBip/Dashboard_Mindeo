import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as ownersService from '../../lib/supabase/services/ownersService';
import { Users, BarChart2, Trash2 } from 'lucide-react';

type Owner = {
  id: string;
  name: string;
  role: string;
};

type OwnerStats = {
  [key: string]: number;
};

interface OwnersPanelProps {
  roadmapItems: any[];
}

const OwnersPanel: React.FC<OwnersPanelProps> = ({ roadmapItems }) => {
  const [activeTab, setActiveTab] = useState<'owners' | 'stats'>('owners');
  const [newOwner, setNewOwner] = useState({ name: '', role: '' });
  const [showForm, setShowForm] = useState(false);
  
  const queryClient = useQueryClient();

  const { data: owners = [] } = useQuery({
    queryKey: ['owners'],
    queryFn: async () => {
      const { data, error } = await ownersService.getAll();
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (owner: Omit<Owner, 'id'>) => {
      const { data, error } = await ownersService.create(owner);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owners'] });
      setNewOwner({ name: '', role: '' });
      setShowForm(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await ownersService.remove(id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owners'] });
    }
  });

  const calculateOwnerStats = (): OwnerStats => {
    return roadmapItems.reduce((acc: OwnerStats, item: any) => {
      const owner = item.owner;
      acc[owner] = (acc[owner] || 0) + 1;
      return acc;
    }, {});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(newOwner);
  };

  const ownerStats = calculateOwnerStats();

  return (
    <div className="bg-[#1C1D24] border border-[#2D2E3A] rounded-lg p-4">
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setActiveTab('owners')}
          className={`flex items-center px-3 py-1 rounded ${
            activeTab === 'owners' ? 'bg-violet-500 text-white' : 'text-gray-400'
          }`}
        >
          <Users className="h-4 w-4 mr-1" />
          Owners
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex items-center px-3 py-1 rounded ${
            activeTab === 'stats' ? 'bg-violet-500 text-white' : 'text-gray-400'
          }`}
        >
          <BarChart2 className="h-4 w-4 mr-1" />
          Stats
        </button>
      </div>

      {activeTab === 'owners' && (
        <div>
          <div className="space-y-2">
            {owners.map((owner: Owner) => (
              <div key={owner.id} className="flex items-center justify-between text-sm p-2 bg-[#141517] rounded">
                <div>
                  <div className="text-white">{owner.name}</div>
                  <div className="text-gray-400 text-xs">{owner.role}</div>
                </div>
                <button
                  onClick={() => deleteMutation.mutate(owner.id)}
                  className="text-gray-400 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 w-full px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-md text-sm"
            >
              Add Owner
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={newOwner.name}
                onChange={(e) => setNewOwner({ ...newOwner, name: e.target.value })}
                className="w-full px-3 py-2 bg-[#141517] border border-[#2D2E3A] rounded-md text-white text-sm"
              />
              <input
                type="text"
                placeholder="Role"
                value={newOwner.role}
                onChange={(e) => setNewOwner({ ...newOwner, role: e.target.value })}
                className="w-full px-3 py-2 bg-[#141517] border border-[#2D2E3A] rounded-md text-white text-sm"
              />
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-md text-sm"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-400 grid grid-cols-2 gap-2 p-2">
            <div>Owner</div>
            <div className="text-right"># Tasks</div>
          </div>
          {Object.entries(ownerStats).map(([owner, count]) => (
            <div key={owner} className="text-sm grid grid-cols-2 gap-2 p-2 bg-[#141517] rounded">
              <div className="text-white">{owner}</div>
              <div className="text-right text-violet-400">{count}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnersPanel;
