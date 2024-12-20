import axios from 'axios';
import { KPI } from '../types/airtable';
import { baseUrl, headers, sanitizeNumber } from './utils/apiUtils';

export async function fetchKPIs(): Promise<KPI[]> {
  try {
    const response = await axios.get(`${baseUrl}/KPIs`, { 
      headers,
      params: {
        view: 'Grid view'
      }
    });

    if (!response.data.records) {
      throw new Error('No KPI data found');
    }

    return response.data.records.map((record: any) => ({
      ID_KPI: record.id,
      Nom_KPI: record.fields.Nom_KPI || '',
      Type: record.fields.Type || '',
      Valeur_Actuelle: sanitizeNumber(record.fields.Valeur_Actuelle),
      Valeur_Precedente: sanitizeNumber(record.fields.Valeur_Precedente),
      Score_KPI_Final: sanitizeNumber(record.fields.Score_KPI_Final),
      Statut: record.fields.Statut || '',
      Fonctions: record.fields.Fonctions || ''
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('KPIs table not found');
      }
      if (error.response?.status === 401) {
        throw new Error('Invalid API key');
      }
    }
    throw new Error('Failed to fetch KPIs');
  }
}

export async function fetchKPIsBenchmark(): Promise<KPI[]> {
  try {
    const response = await axios.get(`${baseUrl}/KPIs_Benchmark`, { 
      headers,
      params: {
        view: 'Grid view'
      }
    });

    if (!response.data.records) {
      throw new Error('No KPI benchmark data found');
    }

    return response.data.records.map((record: any) => ({
      ID_KPI: record.id,
      Nom_KPI: record.fields.Nom_KPI || '',
      Type: record.fields.Type || '',
      Valeur_Actuelle: sanitizeNumber(record.fields.Valeur_Actuelle),
      Valeur_Precedente: sanitizeNumber(record.fields.Valeur_Precedente),
      Score_KPI_Final: sanitizeNumber(record.fields.Score_KPI_Final),
      Statut: record.fields.Statut || '',
      Fonctions: record.fields.Fonctions || ''
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('KPIs benchmark table not found');
      }
      if (error.response?.status === 401) {
        throw new Error('Invalid API key');
      }
    }
    throw new Error('Failed to fetch KPI benchmarks');
  }
}

export async function getKPIById(kpiId: string): Promise<KPI | null> {
  try {
    const response = await axios.get(`${baseUrl}/KPIs/${kpiId}`, { headers });
    return response.data;
  } catch {
    return null;
  }
}

export async function updateKPIValue(kpiId: string, newValue: number): Promise<void> {
  try {
    await axios.patch(
      `${baseUrl}/KPIs/${kpiId}`,
      {
        fields: {
          Valeur_Actuelle: newValue
        }
      },
      { headers }
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('KPI not found');
      }
      if (error.response?.status === 401) {
        throw new Error('Invalid API key');
      }
    }
    throw new Error('Failed to update KPI value');
  }
}

export async function updateKPIValueLegacy(id: string, value: number): Promise<void> {
  try {
    await axios.patch(
      `${baseUrl}/KPIs/${id}`,
      {
        fields: {
          Valeur_Precedente: value
        }
      },
      { headers }
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('KPI not found');
      }
      if (error.response?.status === 401) {
        throw new Error('Invalid API key');
      }
    }
    throw new Error('Failed to update legacy KPI value');
  }
}
