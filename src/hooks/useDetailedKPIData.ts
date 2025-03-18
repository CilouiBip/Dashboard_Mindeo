import { useQuery } from '@tanstack/react-query';
import { useDebugMode } from './useDebugMode';
import { KPI } from '../types/airtable';
import { getDetailedKPIs } from '../services/supabaseKpi';

export interface DetailedKPIQueryOptions {
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number;
  refetchOnWindowFocus?: boolean;
}

/**
 * Hook spécial pour le diagnostic des problèmes d'affichage des KPIs individuels
 * Utilise la requête SQL explicite au lieu de la vue standard
 */
export const useDetailedKPIData = (options: DetailedKPIQueryOptions = {}) => {
  const { isDebugMode } = useDebugMode();
  const {
    enabled = true,
    staleTime = 30 * 1000,
    refetchInterval = 30 * 1000,
    refetchOnWindowFocus = true,
  } = options;

  return useQuery<KPI[], Error>({
    queryKey: ['detailed-kpis'],
    queryFn: () => getDetailedKPIs(),
    select: (data) => {
      if (isDebugMode) {
        console.group('Detailed KPI Data Debug');
        console.log('Raw KPIs from detailed query:', data);
        
        // Vérifier la présence et le format des fonctions
        const functionMap: Record<string, number> = {};
        let kpisWithoutFunction = 0;
        
        data.forEach(kpi => {
          if (kpi.Fonctions && typeof kpi.Fonctions === 'string') {
            const funcs = kpi.Fonctions.split(',');
            funcs.forEach(f => {
              const fn = f.trim();
              if (fn) {
                functionMap[fn] = (functionMap[fn] || 0) + 1;
              }
            });
          } else {
            kpisWithoutFunction++;
          }
        });
        
        console.log('KPIs par fonction (détaillé):', functionMap);
        console.log('KPIs sans fonction (détaillé):', kpisWithoutFunction);
        console.groupEnd();
      }
      
      return data;
    },
    enabled,
    staleTime,
    refetchInterval,
    refetchOnWindowFocus,
  });
};
