import { useQuery } from '@tanstack/react-query';
import { fetchKPIs } from '../kpiApi';
import { KPI } from '../../types/airtable';

export function useKPIs() {
  return useQuery<KPI[]>({
    queryKey: ['kpis'],
    queryFn: fetchKPIs
  });
}