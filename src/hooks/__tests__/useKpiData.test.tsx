import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useKPIData } from '../useKpiData';
import * as kpiApi from '../../api/kpiApi';
import * as calculations from '../../utils/calculations';
import { KPI, KPIType } from '../../types/airtable';

// Mock the API module and other dependencies
vi.mock('../../api/kpiApi');
vi.mock('../useDebugMode', () => ({
  useDebugMode: () => ({ isDebugMode: false })
}));
vi.mock('../../utils/calculations', () => ({
  calculateFunctionScores: vi.fn((data) => data)
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

describe('useKPIData', () => {
  const mockKPIs: KPI[] = [
    {
      ID_KPI: '1',
      Nom_KPI: 'Test KPI 1',
      Type: KPIType.Input,
      Valeur_Actuelle: 100,
      Valeur_Precedente: 90,
      Score_KPI_Final: 8,
      Statut: 'Good',
      Fonctions: 'Test',
      Impact_Type: 'Linear',
      Impact_Weight: 1,
      Category_Weight: 1,
      Scaling_Factor: 1,
      Impact_Direction: 'Direct',
      Baseline_Revenue: 1000000,
      EBITDA_Factor: 0.2
    },
    {
      ID_KPI: '2',
      Nom_KPI: 'Test KPI 2',
      Type: KPIType.Output,
      Valeur_Actuelle: 200,
      Valeur_Precedente: 180,
      Score_KPI_Final: 9,
      Statut: 'Good',
      Fonctions: 'Test',
      Impact_Type: 'Linear',
      Impact_Weight: 1,
      Category_Weight: 1,
      Scaling_Factor: 1,
      Impact_Direction: 'Direct',
      Baseline_Revenue: 1000000,
      EBITDA_Factor: 0.2
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(kpiApi.fetchKPIs).mockResolvedValue(mockKPIs);
    vi.mocked(calculations.calculateFunctionScores).mockImplementation((data) => data);
  });

  it('should fetch KPIs successfully', async () => {
    const { result } = renderHook(() => useKPIData(), {
      wrapper: createWrapper(),
    });

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    // Wait for the query to resolve
    await waitFor(
      () => {
        expect(result.current.isSuccess).toBe(true);
      },
      { timeout: 3000 }
    );

    // Check the data
    expect(result.current.data).toBeDefined();
    expect(result.current.data?.length).toBe(2);
    expect(vi.mocked(kpiApi.fetchKPIs)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(calculations.calculateFunctionScores)).toHaveBeenCalledWith(mockKPIs);
  });

  it('should handle API errors', async () => {
    const error = new Error('Failed to fetch KPIs');
    vi.mocked(kpiApi.fetchKPIs).mockRejectedValue(error);

    const { result } = renderHook(() => useKPIData(), {
      wrapper: createWrapper(),
    });

    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 3000 }
    );

    expect(result.current.error?.message).toBe('Failed to fetch KPIs');
  });

  it('should respect query options', async () => {
    const options = {
      enabled: false,
      staleTime: 60000,
      refetchInterval: 60000,
      refetchOnWindowFocus: false,
    };

    const { result } = renderHook(() => useKPIData(options), {
      wrapper: createWrapper(),
    });

    // Query should not start because enabled is false
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetched).toBe(false);
    expect(vi.mocked(kpiApi.fetchKPIs)).not.toHaveBeenCalled();
  });
});
