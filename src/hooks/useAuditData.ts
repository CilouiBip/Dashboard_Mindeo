import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAuditItems, updateAuditItem } from '../api/auditApi';
import { AuditItem } from '../types/airtable';
import { useDebugMode } from './useDebugMode';

export interface AuditQueryOptions {
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number;
  refetchOnWindowFocus?: boolean;
}

export const useAuditData = (options: AuditQueryOptions = {}) => {
  const { isDebugMode } = useDebugMode();
  const queryClient = useQueryClient();
  const {
    enabled = true,
    staleTime = 30 * 1000,
    refetchInterval = 30 * 1000,
    refetchOnWindowFocus = true,
  } = options;

  const query = useQuery<AuditItem[], Error>({
    queryKey: ['audit-items'],
    queryFn: fetchAuditItems,
    select: (data) => {
      if (isDebugMode) {
        console.group('Audit Data Debug');
        console.log('Raw Audit Items:', data);
        console.groupEnd();
      }
      return data;
    },
    enabled,
    staleTime,
    refetchInterval,
    refetchOnWindowFocus,
  });

  const updateMutation = useMutation({
    mutationFn: updateAuditItem,
    onSuccess: () => {
      // Invalidate and refetch the audit items query
      queryClient.invalidateQueries({ queryKey: ['audit-items'] });
    },
  });

  return {
    ...query,
    updateAuditItem: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  };
};
