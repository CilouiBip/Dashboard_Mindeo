import { useQuery } from '@tanstack/react-query';
import { fetchMarketingProblems } from '../airtable';
import { Problem } from '../../types/airtable';

export const useProblems = () => {
  return useQuery<Problem[], Error>({
    queryKey: ['problems'],
    queryFn: fetchMarketingProblems
  });
};