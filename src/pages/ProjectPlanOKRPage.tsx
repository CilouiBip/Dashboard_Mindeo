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

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await projectPlanService.update(id, updates);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-plans'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await projectPlanService.remove(id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-plans'] });
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">Project Plan OKR</h1>
      <div className="space-y-4">
        {plans?.map((plan) => (
          <div key={plan.id} className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg text-white">{plan.title}</h3>
            <p className="text-gray-400">{plan.description}</p>
            <div className="mt-2 space-x-2">
              <button
                onClick={() => {
                  const newTitle = prompt('Enter new title:', plan.title);
                  if (newTitle) {
                    updateMutation.mutate({
                      id: plan.id,
                      updates: { title: newTitle }
                    });
                  }
                }}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this plan?')) {
                    deleteMutation.mutate(plan.id);
                  }
                }}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectPlanOKRPage;
