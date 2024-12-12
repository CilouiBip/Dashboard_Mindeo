import axios from 'axios';
import { GlobalScore, KPI, AuditItem } from '../types/airtable';

const baseUrl = `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}`;
const headers = {
  Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}`,
};

export const api = {
  async fetchGlobalScore(): Promise<GlobalScore> {
    try {
      const response = await axios.get(`${baseUrl}/GLOBAL_SCORE`, {
        headers,
        params: {
          maxRecords: 1,
          sort: [{ field: 'Created', direction: 'desc' }]
        }
      });

      if (!response.data.records || response.data.records.length === 0) {
        throw new Error('No global score data found');
      }

      const record = response.data.records[0].fields;
      return {
        score: Number(record.Score_Global_Sur_10) || 0,
        trend: Number(record.Evolution_Score) || 0,
        functions: record.Functions?.map((func: any) => ({
          name: String(func.Name),
          score: Number(func.Score_Global)
        })) || []
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch global score: ${error.message}`);
      }
      throw new Error('Failed to fetch global score');
    }
  },

  async fetchKPIs(): Promise<KPI[]> {
    try {
      const response = await axios.get(`${baseUrl}/KPI_Link`, { headers });
      return response.data.records.map((record: any) => ({
        id: String(record.id),
        name: String(record.fields.NOM_KPI),
        description: String(record.fields.Description || ''),
        type: String(record.fields.Type),
        value: Number(record.fields.Valeur_Actuelle || 0),
        score: Number(record.fields.Score_Final || 0),
        status: String(record.fields.Statut),
        unit: String(record.fields.Unite || ''),
        function: String(record.fields.Fonction)
      }));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch KPIs: ${error.message}`);
      }
      throw new Error('Failed to fetch KPIs');
    }
  },

  async fetchAuditItems(): Promise<AuditItem[]> {
    try {
      const response = await axios.get(`${baseUrl}/Audit_Items`, { headers });
      return response.data.records.map((record: any) => ({
        id: String(record.id),
        name: String(record.fields.Item_Name),
        status: String(record.fields.Status),
        criticality: String(record.fields.Criticality),
        actionRequired: String(record.fields.Action_Required || ''),
        playbookLink: String(record.fields.Playbook_Link || '')
      }));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch audit items: ${error.message}`);
      }
      throw new Error('Failed to fetch audit items');
    }
  }
};