import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchKPIs, updateKPIValue } from '../api/kpiApi';
import { KPI, validateKPIs } from '../schemas/airtable';
import { useDebugMode } from './useDebugMode';
import { calculateKPIImpact, calculateTotalImpact } from '../utils/impactCalculations';

interface ImpactSimulatorFilters {
  searchQuery?: string;
  function?: string;
  includeOutputKPIs?: boolean;
}

export function useImpactSimulator(
  filters: ImpactSimulatorFilters,
  kpiValues: Record<string, number> = {}
) {
  const queryClient = useQueryClient();
  const { isDebugMode } = useDebugMode();

  const {
    data: kpis = [],
    isLoading,
    error: fetchError
  } = useQuery({
    queryKey: ['kpisBenchmark'],
    queryFn: async () => {
      const rawData = await fetchKPIs();
      const result = validateKPIs(rawData);
      
      if (!result.success) {
        console.error('KPI validation failed:', result.errors);
        throw new Error('Invalid KPI data received from API');
      }
      
      return result.data;
    },
  });

  // Filter KPIs based on provided filters
  const filteredKPIs = kpis.filter(kpi => {
    // Filter by type if specified
    if (filters.includeOutputKPIs === false && kpi.Type === 'Output') {
      return false;
    }

    // Filter by function if specified
    if (filters.function) {
      const functions = kpi.Fonctions?.split(',').map(f => f.trim()) || [];
      if (!functions.includes(filters.function)) {
        return false;
      }
    }

    // Filter by search query if specified
    if (filters.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      return (
        kpi.Nom_KPI.toLowerCase().includes(searchLower) ||
        kpi.Description?.toLowerCase().includes(searchLower) ||
        kpi.Fonctions?.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  // Calculate impacts for filtered KPIs
  const kpisWithImpacts = filteredKPIs.map(kpi => ({
    ...kpi,
    currentImpact: calculateKPIImpact(kpi, kpiValues[kpi.ID_KPI] ?? kpi.Valeur_Actuelle)
  }));

  // Calculate total impact
  const totalImpact = calculateTotalImpact(
    kpisWithImpacts.map(kpi => kpi.currentImpact)
  );

  // Group KPIs by function
  const groupedKPIs = kpisWithImpacts.reduce((acc, kpi) => {
    const functions = kpi.Fonctions?.split(',').map(f => f.trim()) || ['Other'];
    functions.forEach(func => {
      if (!acc[func]) acc[func] = [];
      acc[func].push(kpi);
    });
    return acc;
  }, {} as Record<string, (KPI & { currentImpact: { revenue: number; ebitda: number } })[]>);

  // Get available functions for filtering
  const availableFunctions = Array.from(
    new Set(
      kpis.flatMap(kpi => 
        kpi.Fonctions?.split(',').map(f => f.trim()) || []
      )
    )
  ).filter(Boolean);

  // Update KPI mutation
  const { mutate: updateKPI, isLoading: isUpdating } = useMutation({
    mutationFn: updateKPIValue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpisBenchmark'] });
    },
  });

  // Debug logging
  if (isDebugMode) {
    console.log('🔍 Impact Simulator:', {
      totalKPIs: kpis.length,
      filteredKPIs: filteredKPIs.length,
      filters,
      availableFunctions,
    });
  }

  return {
    kpis: kpisWithImpacts,
    groupedKPIs,
    totalImpact,
    availableFunctions,
    isLoading,
    error: fetchError,
    updateKPI,
    isUpdating,
  };
}
