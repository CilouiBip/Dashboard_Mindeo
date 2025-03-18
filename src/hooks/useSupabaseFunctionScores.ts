import { useQuery, UseQueryOptions, QueryKey } from '@tanstack/react-query';
import { FunctionScore } from '../types/airtable';
import { getKPIRepository } from '../repositories/KPIRepository';

/**
 * Hook pour ru00e9cupu00e9rer les scores par fonction depuis Supabase
 * Utilise la couche d'abstraction KPIRepository pour permettre une migration progressive
 */
// Du00e9finir un type plus pru00e9cis pour les options
type FunctionScoreQueryOptions = Omit<UseQueryOptions<FunctionScore[], Error, FunctionScore[], QueryKey>, 'queryKey' | 'queryFn'>;

export const useSupabaseFunctionScores = (options: FunctionScoreQueryOptions = {}) => {
  const kpiRepository = getKPIRepository();
  
  return useQuery<FunctionScore[], Error>({
    queryKey: ['functionScores'],
    queryFn: async () => {
      console.log('[useSupabaseFunctionScores] Fetching function scores...');
      const result = await kpiRepository.fetchFunctionScores();
      console.log('[useSupabaseFunctionScores] Result:', result);
      return result;
    },
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    ...options // Les options ne peuvent plus u00e9craser queryKey ou queryFn
  });
};
