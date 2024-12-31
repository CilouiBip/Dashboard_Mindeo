import { useQuery } from '@tanstack/react-query';
import { fetchKPIs } from '../api/airtable';
import { useDebugMode } from './useDebugMode';
import { calculateFunctionScores } from '../utils/calculations';

export const useKPIData = () => {
  const { isDebugMode } = useDebugMode();

  return useQuery({
    queryKey: ['kpis'],
    queryFn: fetchKPIs,
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
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    refetchOnWindowFocus: true,
  });
};