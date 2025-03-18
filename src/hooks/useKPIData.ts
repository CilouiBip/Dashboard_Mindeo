import { useQuery } from '@tanstack/react-query';
import { useDebugMode } from './useDebugMode';
import { calculateFunctionScores } from '../utils/calculations';
import { KPI } from '../types/airtable';
import { getKPIRepository } from '../repositories/KPIRepository';

export interface KPIQueryOptions {
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number;
  refetchOnWindowFocus?: boolean;
}

export const useKPIData = (options: KPIQueryOptions = {}) => {
  const { isDebugMode } = useDebugMode();
  const {
    enabled = true,
    staleTime = 30 * 1000,
    refetchInterval = 30 * 1000,
    refetchOnWindowFocus = true,
  } = options;

  const kpiRepository = getKPIRepository();

  return useQuery<KPI[], Error>({
    queryKey: ['kpis'],
    queryFn: () => kpiRepository.fetchKPIs(),
    select: (data) => {
      const scores = calculateFunctionScores(data);
      
      if (isDebugMode) {
        console.group('KPI Data Debug');
        console.log('Raw KPIs:', data);
        console.log('Calculated Scores:', scores);
        console.groupEnd();
      }
      
      return scores;
    },
    enabled,
    staleTime,
    refetchInterval,
    refetchOnWindowFocus,
  });
};