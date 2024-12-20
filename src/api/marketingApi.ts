import axios from 'axios';
import { Problem } from '../types/airtable';
import { baseUrl, headers } from './utils/apiUtils';

export async function fetchMarketingProblems(): Promise<Problem[]> {
  try {
    const response = await axios.get(`${baseUrl}/MARKETING_PROBLEMS`, {
      headers,
      params: {
        view: 'Grid view'
      }
    });

    if (!response.data.records) {
      throw new Error('No marketing problems found');
    }

    return response.data.records.map((record: any) => ({
      id: record.id,
      name: record.fields.Name || '',
      description: record.fields.Description || '',
      status: record.fields.Status || '',
      priority: record.fields.Priority || ''
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Marketing problems table not found');
      }
      if (error.response?.status === 401) {
        throw new Error('Invalid API key');
      }
    }
    throw new Error('Failed to fetch marketing problems');
  }
}
