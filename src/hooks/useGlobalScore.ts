import { useQuery } from '@tanstack/react-query';
import { api } from '../api/airtable';

export const useGlobalScore = () => {
  return useQuery({
    queryKey: ['globalScore'],
    queryFn: api.fetchGlobalScore,
    staleTime: 30 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onError: (error) => {
      console.error('Error fetching global score:', error);
    }
  });
};