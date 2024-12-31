import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useImpactSimulator } from '../useImpactSimulator';
import * as kpiApi from '../../api/kpiApi';
import { KPI, KPIType } from '../../types/airtable';

// Mock the API module
vi.mock('../../api/kpiApi');

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

describe('useImpactSimulator', () => {
  const mockKPIs: KPI[] = [
    {
      ID_KPI: '1',
      Nom_KPI: 'CAC',
      Type: KPIType.Input,
      Valeur_Actuelle: 100,
      Valeur_Precedente: 90,
      Score_KPI_Final: 8,
      Statut: 'Good',
      Fonctions: 'Marketing',
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
      Nom_KPI: 'Revenue',
      Type: KPIType.Output,
      Valeur_Actuelle: 200,
      Valeur_Precedente: 180,
      Score_KPI_Final: 9,
      Statut: 'Good',
      Fonctions: 'Finance',
      Impact_Type: 'Linear',
      Impact_Weight: 1,
      Category_Weight: 1,
      Scaling_Factor: 1,
      Impact_Direction: 'Direct',
      Baseline_Revenue: 1000000,
      EBITDA_Factor: 0.2
    },
    {
      ID_KPI: '3',
      Nom_KPI: 'Conversion Rate',
      Type: KPIType.Input,
      Valeur_Actuelle: 0.2,
      Valeur_Precedente: 0.18,
      Score_KPI_Final: 7,
      Statut: 'Good',
      Fonctions: 'Marketing, Sales',
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
  });

  it('should fetch and filter KPIs correctly', async () => {
    const { result } = renderHook(
      () => useImpactSimulator({ includeOutputKPIs: false }),
      { wrapper: createWrapper() }
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false);
      },
      { timeout: 3000 }
    );

    expect(result.current.kpis).toBeDefined();
    expect(result.current.kpis.length).toBe(2); // Only Input KPIs
    expect(result.current.kpis.every(kpi => kpi.Type === KPIType.Input)).toBe(true);
  });

  it('should filter by function correctly', async () => {
    const { result } = renderHook(
      () => useImpactSimulator({ function: 'Marketing' }),
      { wrapper: createWrapper() }
    );

    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false);
      },
      { timeout: 3000 }
    );

    expect(result.current.kpis.length).toBe(2); // CAC and Conversion Rate
    expect(result.current.kpis.every(kpi => 
      kpi.Fonctions.split(',').map(f => f.trim()).includes('Marketing')
    )).toBe(true);
  });

  it('should filter by search query correctly', async () => {
    const { result } = renderHook(
      () => useImpactSimulator({ searchQuery: 'conversion' }),
      { wrapper: createWrapper() }
    );

    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false);
      },
      { timeout: 3000 }
    );

    expect(result.current.kpis.length).toBe(1);
    expect(result.current.kpis[0].Nom_KPI).toBe('Conversion Rate');
  });

  it('should calculate impacts correctly', async () => {
    const kpiValues = {
      '1': 150, // 50% increase in CAC
    };

    const { result } = renderHook(
      () => useImpactSimulator({}, kpiValues),
      { wrapper: createWrapper() }
    );

    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false);
      },
      { timeout: 3000 }
    );

    const cacKPI = result.current.kpis.find(kpi => kpi.ID_KPI === '1');
    expect(cacKPI).toBeDefined();
    expect(cacKPI?.currentImpact.revenue).toBe(500000); // 50% * 1M baseline
    expect(cacKPI?.currentImpact.ebitda).toBe(100000); // 20% of revenue impact
  });

  it('should return available functions', async () => {
    const { result } = renderHook(
      () => useImpactSimulator(),
      { wrapper: createWrapper() }
    );

    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false);
      },
      { timeout: 3000 }
    );

    expect(result.current.availableFunctions).toEqual(['Finance', 'Marketing', 'Sales']);
  });
});
