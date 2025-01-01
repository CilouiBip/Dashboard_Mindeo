import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as visionService from '../lib/supabase/services/visionService';
import { useToast } from '../components/common/Toast';
import VisionAISection from '../components/vision/VisionAISection';

export default function VisionPage() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const { data: visions, isLoading } = useQuery({
    queryKey: ['visions'],
    queryFn: async () => {
      const { data, error } = await visionService.getAll();
      if (error) throw error;
      return data || [];
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette vision et tous ses OKRs associés ?')) {
        return;
      }
      
      const result = await visionService.remove(id);
      if (result.error) {
        console.error('Deletion error:', result.error);
        throw new Error(result.error.message || 'Erreur lors de la suppression');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visions'] });
      addToast('Vision et OKRs associés supprimés avec succès', 'success');
    },
    onError: (error: any) => {
      addToast(error.message || 'Erreur lors de la suppression', 'error');
    }
  });

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <VisionAISection />
      
      {visions && visions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Previous Visions</h2>
          <div className="space-y-4">
            {visions.map((vision) => (
              <div key={vision.id} className="p-4 bg-gray-800 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-grow">
                    <p className="text-white">{vision.vision_text}</p>
                    <p className="text-gray-400 text-sm">Current Revenue: {vision.current_revenue}</p>
                    <p className="text-gray-400 text-sm">Target Revenue: {vision.target_revenue}</p>
                    <p className="text-gray-400 text-sm">Main Product: {vision.main_product}</p>
                    {vision.context && (
                      <p className="text-gray-400 text-sm">Context: {vision.context}</p>
                    )}
                    {vision.main_challenges && (
                      <p className="text-gray-400 text-sm">Challenges: {vision.main_challenges}</p>
                    )}
                    <p className="text-gray-500 text-xs">
                      Created: {new Date(vision.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      deleteMutation.mutate(vision.id);
                    }}
                    disabled={deleteMutation.isPending}
                    className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
