import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as projectPlanService from '../lib/supabase/services/projectPlanService';

const ProjectPlanOKRPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: plans, isLoading } = useQuery({
    queryKey: ['project-plans'],
    queryFn: async () => {
      const { data, error } = await projectPlanService.getAll();
      if (error) throw error;
      return data;
    }
  });

  const removeAllMutation = useMutation({
    mutationFn: async () => {
      const { error } = await projectPlanService.removeAllOKRPlans();
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-plans'] });
    }
  });

  const handleRemoveAll = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer tous les plans OKR ? Cette action est irréversible.')) {
      removeAllMutation.mutate();
    }
  };

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Project Plan OKR</h1>
        <button
          onClick={handleRemoveAll}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Vider tous les plans OKR
        </button>
      </div>
      
      <div className="space-y-4">
        {plans?.filter(plan => plan.okr_ref).map((plan) => (
          <div key={plan.id} className="bg-[#1C1D24] border border-[#2D2E3A] p-4 rounded-lg">
            <h3 className="text-lg text-white">{plan.name}</h3>
            <p className="text-gray-400">{plan.description}</p>
            <div className="mt-4 flex items-center space-x-4">
              <span className={`px-2 py-1 rounded text-sm ${
                plan.priority === 'high' 
                  ? 'bg-red-500/10 text-red-400' 
                  : plan.priority === 'medium'
                  ? 'bg-yellow-500/10 text-yellow-400'
                  : 'bg-blue-500/10 text-blue-400'
              }`}>
                {plan.priority}
              </span>
              <span className={`px-2 py-1 rounded text-sm ${
                plan.status === 'todo'
                  ? 'bg-gray-500/10 text-gray-400'
                  : plan.status === 'in_progress'
                  ? 'bg-blue-500/10 text-blue-400'
                  : 'bg-green-500/10 text-green-400'
              }`}>
                {plan.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        ))}
        
        {(!plans || plans.filter(plan => plan.okr_ref).length === 0) && (
          <div className="text-center py-8 text-gray-400">
            Aucun plan OKR disponible
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPlanOKRPage;
