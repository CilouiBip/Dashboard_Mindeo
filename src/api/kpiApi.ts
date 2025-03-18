import { KPI, KPIType } from '../types/airtable';
import { supabaseKpiService } from '../services/supabaseKpi';

// Mock data for development and testing only
// Will be used only if mock mode is explicitly enabled
const mockKPIs = [
  {
    ID_KPI: 'kpi1',
    Nom_KPI: 'Revenue Growth',
    Type: 'Principal',
    Valeur_Actuelle: '1000000',
    Valeur_Cible: '1500000',
    Fonctions: ['Sales', 'Marketing'],
    Description: 'Annual revenue growth target',
    Unite: '€',
    Impact_Type: 'linear',
    Impact_Revenue: '500000',
    Impact_EBITDA: '100000'
  },
  {
    ID_KPI: 'kpi2',
    Nom_KPI: 'Customer Satisfaction',
    Type: 'Secondaire',
    Valeur_Actuelle: '85',
    Valeur_Cible: '95',
    Fonctions: ['Customer Service'],
    Description: 'NPS Score',
    Unite: '%',
    Impact_Type: 'exponential',
    Impact_Revenue: '250000',
    Impact_EBITDA: '50000'
  }
];

/**
 * Flag to control mock mode (default: disabled)
 * Set to true ONLY for testing with mock data
 */
const USE_MOCK_DATA = false; // Désactivé pour utiliser les vraies données Supabase

/**
 * Helper function to convert mock data to KPI format
 */
function convertMockToKPI(mockKpi: typeof mockKPIs[0]): KPI {
  return {
    ID_KPI: mockKpi.ID_KPI,
    Nom_KPI: mockKpi.Nom_KPI,
    Type: mockKpi.Type as KPIType,
    Valeur_Actuelle: Number(mockKpi.Valeur_Actuelle) || 0,
    Valeur_Precedente: 0,
    Score_KPI_Final: 0,
    Statut: '',
    Fonctions: Array.isArray(mockKpi.Fonctions) ? mockKpi.Fonctions[0] : String(mockKpi.Fonctions || '')
  };
}

/**
 * Fetches KPIs from Supabase or mock data
 */
export async function fetchKPIs(): Promise<KPI[]> {
  try {
    // Use mock data if explicitly enabled and in development
    if (process.env.NODE_ENV === 'development' && USE_MOCK_DATA) {
      console.log('[DIAGNOSTIC] Using mock KPI data');
      const mockData = mockKPIs.map(convertMockToKPI);
      console.log('[DIAGNOSTIC] Mock KPI count:', mockData.length);
      console.log('[DIAGNOSTIC] First mock KPI:', mockData[0]);
      return mockData;
    }

    // Fetch from Supabase
    console.log('[DIAGNOSTIC] Fetching KPIs from Supabase...');
    const kpis = await supabaseKpiService.getKPIs();
    console.log('[DIAGNOSTIC] Raw KPIs from Supabase:', kpis);
    console.log('[DIAGNOSTIC] KPI count:', kpis.length);
    if (kpis.length > 0) {
      console.log('[DIAGNOSTIC] First KPI structure:', kpis[0]);
    } else {
      console.log('[DIAGNOSTIC] No KPIs found in Supabase');
    }
    return kpis;
  } catch (error) {
    console.error('[DIAGNOSTIC] Error fetching KPIs:', error);
    return [];
  }
}

/**
 * Fetches KPIs benchmark from Supabase or mock data
 */
export async function fetchKPIsBenchmark(): Promise<KPI[]> {
  try {
    // Use mock data if explicitly enabled and in development
    if (process.env.NODE_ENV === 'development' && USE_MOCK_DATA) {
      console.log('Using mock benchmark data');
      return mockKPIs.map(convertMockToKPI);
    }

    // Fetch benchmarks from Supabase
    // Note: This assumes benchmark KPIs are stored in the same table with a 'benchmark' flag
    // Adjust the implementation based on your actual data structure
    const benchmarkKpis = await supabaseKpiService.getKPIs();
    console.log('Benchmark KPIs fetched from Supabase:', benchmarkKpis);
    return benchmarkKpis;
  } catch (error) {
    console.error('Error fetching KPI benchmarks:', error);
    return [];
  }
}

/**
 * Fetches a KPI by ID from Supabase or mock data
 */
export async function getKPIById(kpiId: string): Promise<KPI | null> {
  try {
    // Use mock data if explicitly enabled and in development
    if (process.env.NODE_ENV === 'development' && USE_MOCK_DATA) {
      const mockKPI = mockKPIs.find(kpi => kpi.ID_KPI === kpiId);
      if (!mockKPI) {
        console.error('Mock KPI not found');
        return null;
      }
      return convertMockToKPI(mockKPI);
    }

    // Fetch from Supabase
    const kpis = await supabaseKpiService.getKPIs();
    const kpi = kpis.find(k => k.ID_KPI === kpiId);
    
    if (!kpi) {
      console.error('KPI not found');
      return null;
    }
    
    return kpi;
  } catch (error) {
    console.error('Error fetching KPI:', error);
    return null;
  }
}

/**
 * Updates a KPI value
 */
export async function updateKPIValue(data: { ID_KPI: string; Valeur_Actuelle: number }): Promise<KPI | null> {
  console.log('🔍 DÉBUT updateKPIValue - Données reçues:', data);
  try {
    // Use mock data if explicitly enabled and in development
    if (process.env.NODE_ENV === 'development' && USE_MOCK_DATA) {
      console.log('⚠️ Utilisation des données MOCK - cette partie ne devrait pas être exécutée');
      const mockIndex = mockKPIs.findIndex(kpi => kpi.ID_KPI === data.ID_KPI);
      if (mockIndex === -1) {
        console.error('Mock KPI not found');
        return null;
      }

      // Update the mock data
      mockKPIs[mockIndex] = {
        ...mockKPIs[mockIndex],
        Valeur_Actuelle: data.Valeur_Actuelle.toString()
      };
      
      return convertMockToKPI(mockKPIs[mockIndex]);
    }

    // Update via Supabase
    const kpiId = parseInt(data.ID_KPI, 10);
    console.log('🔢 KPI ID parsé:', kpiId);
    
    if (isNaN(kpiId)) {
      console.error('❌ Invalid KPI ID format');
      return null;
    }
    
    console.log('🔄 Appel de updateKPI avec:', kpiId, { Valeur_Actuelle: data.Valeur_Actuelle });
    try {
      await supabaseKpiService.updateKPI(kpiId, {
        Valeur_Actuelle: data.Valeur_Actuelle
      });
      console.log('✅ Appel updateKPI réussi');
    } catch (updateError) {
      console.error('❌ Erreur lors de l\'appel updateKPI:', updateError);
      throw updateError; // Propager l'erreur pour le catch externe
    }
    
    // Get the updated KPI
    console.log('🔍 Récupération du KPI mis à jour...');
    let kpis;
    try {
      kpis = await supabaseKpiService.getKPIs();
      console.log(`✅ ${kpis.length} KPIs récupérés`);
    } catch (getError) {
      console.error('❌ Erreur lors de la récupération des KPIs:', getError);
      throw getError;
    }
    
    console.log('🔍 Recherche du KPI mis à jour avec ID:', data.ID_KPI);
    const updatedKpi = kpis.find(k => k.ID_KPI === data.ID_KPI);
    
    if (!updatedKpi) {
      console.error('❌ KPI mis à jour non trouvé dans les résultats');
      console.log('📋 Liste des IDs disponibles:', kpis.map(k => k.ID_KPI));
      return null;
    }
    
    console.log('✅ KPI mis à jour trouvé:', updatedKpi);
    return updatedKpi;
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du KPI:', error);
    return null;
  }
}

/**
 * Legacy method to update a KPI value
 * Keeps backward compatibility with older code
 */
export async function updateKPIValueLegacy(id: string, value: number): Promise<KPI | null> {
  try {
    // Use mock data if explicitly enabled and in development
    if (process.env.NODE_ENV === 'development' && USE_MOCK_DATA) {
      const mockIndex = mockKPIs.findIndex(kpi => kpi.ID_KPI === id);
      if (mockIndex === -1) {
        console.error('Mock KPI not found');
        return null;
      }

      // Update the mock data
      mockKPIs[mockIndex] = {
        ...mockKPIs[mockIndex],
        Valeur_Actuelle: value.toString()
      };
      
      return convertMockToKPI(mockKPIs[mockIndex]);
    }

    // Update via Supabase
    const kpiId = parseInt(id, 10);
    
    if (isNaN(kpiId)) {
      console.error('Invalid KPI ID format');
      return null;
    }
    
    await supabaseKpiService.updateKPI(kpiId, {
      Valeur_Actuelle: value
    });
    
    // Get the updated KPI
    const kpis = await supabaseKpiService.getKPIs();
    const updatedKpi = kpis.find(k => k.ID_KPI === id);
    
    if (!updatedKpi) {
      console.error('Updated KPI not found');
      return null;
    }
    
    return updatedKpi;
  } catch (error) {
    console.error('Error updating legacy KPI:', error);
    return null;
  }
}
