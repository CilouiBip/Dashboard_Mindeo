import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuditData } from '../useAuditData';
import * as auditApi from '../../api/auditApi';
import { AuditItem, Status, Priority } from '../../types/airtable';

// Mock the API module and other dependencies
vi.mock('../../api/auditApi');
vi.mock('../useDebugMode', () => ({
  useDebugMode: () => ({ isDebugMode: false })
}));

// Create a wrapper for the test
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useAuditData', () => {
  const mockAuditItems: AuditItem[] = [
    {
      ID_Action: '1',
      Action: 'Test Action 1',
      Status: Status.NotStarted,
      Priority: Priority.High,
      Owner: 'Test Owner',
      Due_Date: '2024-12-31',
      Description: 'Test Description',
      Category: 'Test Category',
      Criticality: Priority.High,
      Impact: 'High',
      Effort: 'Medium',
      Completed_Date: null,
      Notes: 'Test Notes'
    },
    {
      ID_Action: '2',
      Action: 'Test Action 2',
      Status: Status.InProgress,
      Priority: Priority.Medium,
      Owner: 'Test Owner 2',
      Due_Date: '2024-12-31',
      Description: 'Test Description 2',
      Category: 'Test Category 2',
      Criticality: Priority.Medium,
      Impact: 'Medium',
      Effort: 'Low',
      Completed_Date: null,
      Notes: 'Test Notes 2'
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(auditApi.fetchAuditItems).mockResolvedValue(mockAuditItems);
    vi.mocked(auditApi.updateAuditItem).mockImplementation(async (item) => item);
  });

  it('should fetch audit items successfully', async () => {
    const { result } = renderHook(() => useAuditData(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(
      () => {
        expect(result.current.isSuccess).toBe(true);
      },
      { timeout: 3000 }
    );

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.length).toBe(2);
    expect(vi.mocked(auditApi.fetchAuditItems)).toHaveBeenCalledTimes(1);
  });

  it('should handle API errors', async () => {
    const error = new Error('Failed to fetch audit items');
    vi.mocked(auditApi.fetchAuditItems).mockRejectedValue(error);

    const { result } = renderHook(() => useAuditData(), {
      wrapper: createWrapper(),
    });

    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 3000 }
    );

    expect(result.current.error?.message).toBe('Failed to fetch audit items');
  });

  it('should update audit item successfully', async () => {
    const { result } = renderHook(() => useAuditData(), {
      wrapper: createWrapper(),
    });

    await waitFor(
      () => {
        expect(result.current.isSuccess).toBe(true);
      },
      { timeout: 3000 }
    );

    const updateData: AuditItem = {
      ...mockAuditItems[0],
      Status: Status.Completed,
    };

    await act(async () => {
      result.current.updateAuditItem(updateData);
    });

    expect(vi.mocked(auditApi.updateAuditItem)).toHaveBeenCalledWith(updateData);
  });

  it('should respect query options', async () => {
    const options = {
      enabled: false,
      staleTime: 60000,
      refetchInterval: 60000,
      refetchOnWindowFocus: false,
    };

    const { result } = renderHook(() => useAuditData(options), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetched).toBe(false);
    expect(vi.mocked(auditApi.fetchAuditItems)).not.toHaveBeenCalled();
  });
});
