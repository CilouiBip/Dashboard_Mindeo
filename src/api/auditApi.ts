import axios from 'axios';
import { AuditItem, Status, Priority } from '../types/airtable';
import { baseUrl, headers, sanitizeNumber } from './utils/apiUtils';

export async function fetchAuditItems(): Promise<AuditItem[]> {
  try {
    const response = await axios.get(`${baseUrl}/AUDIT`, {
      headers,
      params: {
        view: 'Grid view'
      }
    });

    if (!response.data.records) {
      throw new Error('No audit items found');
    }

    return response.data.records.map((record: any) => ({
      Item_ID: record.id,
      Item_Name: record.fields.Item_Name || '',
      Status: record.fields.Status || Status.NotStarted,
      Criticality: record.fields.Criticality || Priority.Low,
      Action_Required: record.fields.Action_Required || '',
      Playbook_Link: record.fields.Playbook_Link,
      Categorie_Problems_Name: record.fields.Categorie_Problems_Name || '',
      Sub_Problems_Name: record.fields.Sub_Problems_Name || '',
      Sub_Problems_Text: record.fields.Sub_Problems_Text || '',
      Problems_Name: record.fields.Problems_Name || '',
      Fonction_Name: record.fields.Fonction_Name || '',
      Score: sanitizeNumber(record.fields.Score),
      Comments: record.fields.Comments,
      KPIs_Name: record.fields.KPIs_Name
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Audit table not found');
      }
      if (error.response?.status === 401) {
        throw new Error('Invalid API key');
      }
    }
    throw new Error('Failed to fetch audit items');
  }
}

export async function updateAuditItem(
  id: string, 
  updates: { 
    Status?: Status; 
    Criticality?: Priority;
    Comments?: string;
    Score?: number;
  }
): Promise<void> {
  try {
    await axios.patch(
      `${baseUrl}/AUDIT/${id}`,
      {
        fields: updates
      },
      { headers }
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Audit item not found');
      }
      if (error.response?.status === 401) {
        throw new Error('Invalid API key');
      }
    }
    throw new Error('Failed to update audit item');
  }
}

export async function fetchFullList(): Promise<AuditItem[]> {
  try {
    const response = await axios.get(`${baseUrl}/AUDIT`, {
      headers,
      params: {
        view: 'Full List'
      }
    });

    if (!response.data.records) {
      throw new Error('No audit items found in full list');
    }

    return response.data.records.map((record: any) => ({
      Item_ID: record.id,
      Item_Name: record.fields.Item_Name || '',
      Status: record.fields.Status || Status.NotStarted,
      Criticality: record.fields.Criticality || Priority.Low,
      Action_Required: record.fields.Action_Required || '',
      Playbook_Link: record.fields.Playbook_Link,
      Categorie_Problems_Name: record.fields.Categorie_Problems_Name || '',
      Sub_Problems_Name: record.fields.Sub_Problems_Name || '',
      Sub_Problems_Text: record.fields.Sub_Problems_Text || '',
      Problems_Name: record.fields.Problems_Name || '',
      Fonction_Name: record.fields.Fonction_Name || '',
      Score: sanitizeNumber(record.fields.Score),
      Comments: record.fields.Comments,
      KPIs_Name: record.fields.KPIs_Name
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Audit table not found');
      }
      if (error.response?.status === 401) {
        throw new Error('Invalid API key');
      }
    }
    throw new Error('Failed to fetch full audit list');
  }
}
