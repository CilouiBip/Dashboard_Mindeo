import { useQuery, UseQueryOptions, QueryKey } from '@tanstack/react-query';
import { GlobalScore } from '../types/airtable';
import { getKPIRepository } from '../repositories/KPIRepository';

/**
 * Hook pour récupérer le score global depuis Supabase
 * Utilise la couche d'abstraction KPIRepository pour permettre une migration progressive
 */
// Du00e9finir un type plus pru00e9cis pour les options
type GlobalScoreQueryOptions = Omit<UseQueryOptions<GlobalScore, Error, GlobalScore, QueryKey>, 'queryKey' | 'queryFn'>;

export const useSupabaseGlobalScore = (options: GlobalScoreQueryOptions = {}) => {
  const kpiRepository = getKPIRepository();
  
  return useQuery<GlobalScore, Error>({
    queryKey: ['globalScore'],
    queryFn: async () => {
      console.log('[useSupabaseGlobalScore] Fetching global score...');
      const result = await kpiRepository.fetchGlobalScore();
      console.log('[useSupabaseGlobalScore] Result:', result);
      return result;
    },
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    ...options // Les options ne peuvent plus u00e9craser queryKey ou queryFn
  });
};
