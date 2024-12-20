import axios from 'axios';
import { GlobalScore, FunctionScore } from '../types/airtable';
import { baseUrl, headers, sanitizeNumber } from './utils/apiUtils';

export async function fetchGlobalScore(): Promise<GlobalScore> {
  try {
    const response = await axios.get(`${baseUrl}/GLOBAL_SCORE`, { 
      headers,
      params: {
        maxRecords: 1,
        sort: [{ field: 'Score_Global_Sur_10', direction: 'desc' }]
      }
    });
    
    if (!response.data.records?.[0]?.fields) {
      throw new Error('No global score data found');
    }

    const record = response.data.records[0].fields;
    
    return {
      Score_Global_Sur_10: sanitizeNumber(record.Score_Global_Sur_10)
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Global Score table not found');
      }
      if (error.response?.status === 401) {
        throw new Error('Invalid API key');
      }
    }
    throw new Error('Failed to fetch global score');
  }
}

export async function fetchFunctionScores(): Promise<FunctionScore[]> {
  try {
    const response = await axios.get(`${baseUrl}/FONCTION_SCORE`, { 
      headers,
      params: {
        view: 'Grid view'
      }
    });

    if (!response.data.records) {
      throw new Error('No function score data found');
    }

    return response.data.records.map((record: any) => ({
      Name: record.fields.Name || '',
      Score_Final_Fonction: sanitizeNumber(record.fields.Score_Final_Fonction),
      Nbr_KPIs: sanitizeNumber(record.fields.Nbr_KPIs),
      Nbr_KPIs_Alert: sanitizeNumber(record.fields.Nbr_KPIs_Alert)
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Function scores table not found');
      }
      if (error.response?.status === 401) {
        throw new Error('Invalid API key');
      }
    }
    throw new Error('Failed to fetch function scores');
  }
}

export async function fetchAverageScore(): Promise<number> {
  try {
    const scores = await fetchFunctionScores();
    if (scores.length === 0) return 0;
    
    const sum = scores.reduce((acc, score) => acc + score.Score_Final_Fonction, 0);
    return sum / scores.length;
  } catch (error) {
    throw new Error('Failed to calculate average score');
  }
}
