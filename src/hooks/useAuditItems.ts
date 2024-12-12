import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAuditItemStatus } from '../api/airtable';
import { AuditItem } from '../types/airtable';

export const useAuditItems = () => {
  const queryClient = useQueryClient();

  const updateStatus = useMutation({
    mutationFn: ({ itemId, status }: { itemId: string; status: AuditItem['Status'] }) =>
      updateAuditItemStatus(itemId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auditItems'] });
    },
  });

  return {
    updateStatus,
  };
};