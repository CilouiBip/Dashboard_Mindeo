import axios from 'axios';
import { KPI, validateKPI, validateKPIs } from '../schemas/airtable';
import { baseUrl, headers, sanitizeNumber } from './utils/apiUtils';

// Mock data for development and testing
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
 * Fetches KPIs from the API or mock data
 */
export async function fetchKPIs(): Promise<KPI[]> {
  try {
    // In development, use mock data
    if (process.env.NODE_ENV === 'development') {
      const result = validateKPIs(mockKPIs);
      if (!result.success) {
        console.error('Mock KPI validation failed:', result.errors);
        return [];
      }
      return result.data;
    }

    // In production, fetch from Airtable
    const response = await axios.get(`${baseUrl}/KPIs`, { 
      headers,
      params: {
        view: 'Grid view'
      }
    });

    if (!response.data.records) {
      console.error('No KPI data found');
      return [];
    }

    const rawData = response.data.records.map((record: any) => ({
      ID_KPI: record.id,
      Nom_KPI: record.fields.Nom_KPI || '',
      Type: record.fields.Type || '',
      Valeur_Actuelle: sanitizeNumber(record.fields.Valeur_Actuelle),
      Valeur_Precedente: sanitizeNumber(record.fields.Valeur_Precedente),
      Score_KPI_Final: sanitizeNumber(record.fields.Score_KPI_Final),
      Statut: record.fields.Statut || '',
      Fonctions: record.fields.Fonctions || ''
    }));

    const result = validateKPIs(rawData);
    
    if (!result.success) {
      console.error('KPI validation failed:', result.errors);
      return [];
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching KPIs:', error);
    return [];
  }
}

/**
 * Fetches KPIs benchmark from the API or mock data
 */
export async function fetchKPIsBenchmark(): Promise<KPI[]> {
  try {
    // In development, use mock data
    if (process.env.NODE_ENV === 'development') {
      const result = validateKPIs(mockKPIs);
      if (!result.success) {
        console.error('Mock KPI benchmark validation failed:', result.errors);
        return [];
      }
      return result.data;
    }

    // In production, fetch from Airtable
    const response = await axios.get(`${baseUrl}/KPIs_Benchmark`, { 
      headers,
      params: {
        view: 'Grid view'
      }
    });

    if (!response.data.records) {
      console.error('No KPI benchmark data found');
      return [];
    }

    const rawData = response.data.records.map((record: any) => ({
      ID_KPI: record.id,
      Nom_KPI: record.fields.Nom_KPI || '',
      Type: record.fields.Type || '',
      Valeur_Actuelle: sanitizeNumber(record.fields.Valeur_Actuelle),
      Valeur_Precedente: sanitizeNumber(record.fields.Valeur_Precedente),
      Score_KPI_Final: sanitizeNumber(record.fields.Score_KPI_Final),
      Statut: record.fields.Statut || '',
      Fonctions: record.fields.Fonctions || ''
    }));

    const result = validateKPIs(rawData);
    
    if (!result.success) {
      console.error('KPI benchmark validation failed:', result.errors);
      return [];
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching KPI benchmarks:', error);
    return [];
  }
}

/**
 * Fetches a KPI by ID from the API or mock data
 */
export async function getKPIById(kpiId: string): Promise<KPI | null> {
  try {
    // In development, use mock data
    if (process.env.NODE_ENV === 'development') {
      const mockKPI = mockKPIs.find(kpi => kpi.ID_KPI === kpiId);
      if (!mockKPI) {
        console.error('Mock KPI not found');
        return null;
      }

      const result = validateKPI(mockKPI);
      if (!result.success) {
        console.error('Mock KPI validation failed:', result.errors);
        return null;
      }
      return result.data;
    }

    // In production, fetch from Airtable
    const response = await axios.get(`${baseUrl}/KPIs/${kpiId}`, { headers });
    if (!response.data) {
      console.error('KPI not found');
      return null;
    }

    const rawData = {
      ID_KPI: response.data.id,
      Nom_KPI: response.data.fields.Nom_KPI || '',
      Type: response.data.fields.Type || '',
      Valeur_Actuelle: sanitizeNumber(response.data.fields.Valeur_Actuelle),
      Valeur_Precedente: sanitizeNumber(response.data.fields.Valeur_Precedente),
      Score_KPI_Final: sanitizeNumber(response.data.fields.Score_KPI_Final),
      Statut: response.data.fields.Statut || '',
      Fonctions: response.data.fields.Fonctions || ''
    };

    const result = validateKPI(rawData);
    
    if (!result.success) {
      console.error('KPI validation failed:', result.errors);
      return null;
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching KPI:', error);
    return null;
  }
}

/**
 * Updates a KPI value
 */
export async function updateKPIValue(data: { ID_KPI: string; Valeur_Actuelle: number }): Promise<KPI | null> {
  try {
    // In development, return mock updated data
    if (process.env.NODE_ENV === 'development') {
      const mockUpdated = {
        ...mockKPIs.find(kpi => kpi.ID_KPI === data.ID_KPI)!,
        Valeur_Actuelle: data.Valeur_Actuelle.toString()
      };
      
      const result = validateKPI(mockUpdated);
      if (!result.success) {
        console.error('Mock KPI update validation failed:', result.errors);
        return null;
      }
      return result.data;
    }

    // In production, update via API
    const response = await axios.patch(
      `${baseUrl}/KPIs/${data.ID_KPI}`,
      {
        fields: {
          Valeur_Actuelle: data.Valeur_Actuelle
        }
      },
      { headers }
    );

    if (!response.data) {
      console.error('KPI not found');
      return null;
    }

    const rawData = {
      ID_KPI: response.data.id,
      Nom_KPI: response.data.fields.Nom_KPI || '',
      Type: response.data.fields.Type || '',
      Valeur_Actuelle: sanitizeNumber(response.data.fields.Valeur_Actuelle),
      Valeur_Precedente: sanitizeNumber(response.data.fields.Valeur_Precedente),
      Score_KPI_Final: sanitizeNumber(response.data.fields.Score_KPI_Final),
      Statut: response.data.fields.Statut || '',
      Fonctions: response.data.fields.Fonctions || ''
    };

    const result = validateKPI(rawData);
    
    if (!result.success) {
      console.error('Updated KPI validation failed:', result.errors);
      return null;
    }
    
    return result.data;
  } catch (error) {
    console.error('Error updating KPI:', error);
    return null;
  }
}

/**
 * Updates a KPI value (Legacy)
 */
export async function updateKPIValueLegacy(id: string, value: number): Promise<KPI | null> {
  try {
    // In development, return mock updated data
    if (process.env.NODE_ENV === 'development') {
      const mockUpdated = {
        ...mockKPIs.find(kpi => kpi.ID_KPI === id)!,
        Valeur_Precedente: value.toString()
      };
      
      const result = validateKPI(mockUpdated);
      if (!result.success) {
        console.error('Mock KPI update validation failed:', result.errors);
        return null;
      }
      return result.data;
    }

    // In production, update via API
    const response = await axios.patch(
      `${baseUrl}/KPIs/${id}`,
      {
        fields: {
          Valeur_Precedente: value
        }
      },
      { headers }
    );

    if (!response.data) {
      console.error('KPI not found');
      return null;
    }

    const rawData = {
      ID_KPI: response.data.id,
      Nom_KPI: response.data.fields.Nom_KPI || '',
      Type: response.data.fields.Type || '',
      Valeur_Actuelle: sanitizeNumber(response.data.fields.Valeur_Actuelle),
      Valeur_Precedente: sanitizeNumber(response.data.fields.Valeur_Precedente),
      Score_KPI_Final: sanitizeNumber(response.data.fields.Score_KPI_Final),
      Statut: response.data.fields.Statut || '',
      Fonctions: response.data.fields.Fonctions || ''
    };

    const result = validateKPI(rawData);
    
    if (!result.success) {
      console.error('Updated KPI validation failed:', result.errors);
      return null;
    }
    
    return result.data;
  } catch (error) {
    console.error('Error updating legacy KPI:', error);
    return null;
  }
}
