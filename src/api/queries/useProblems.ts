import { useQuery } from '@tanstack/react-query';
import { fetchMarketingProblems } from '../marketingApi';
import { Problem } from '../../types/airtable';

export function useProblems() {
  return useQuery<Problem[]>({
    queryKey: ['problems'],
    queryFn: fetchMarketingProblems
  });
}