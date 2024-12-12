import axios from 'axios';
import { KPI, GlobalScore, FunctionScore, AuditItem } from '../types/airtable';

const baseUrl = `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}`;
const headers = {
  Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}`,
};

// Helper function to ensure numbers are serializable
const sanitizeNumber = (value: any): number => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

// Helper function to ensure strings are serializable
const sanitizeString = (value: any): string => {
  return String(value || '');
};

export const api = {
  async fetchGlobalScore(): Promise<GlobalScore> {
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
          throw new Error('Global Score table not found. Please check your Airtable configuration.');
        }
        if (error.response?.status === 401) {
          throw new Error('Invalid Airtable API key. Please check your configuration.');
        }
      }
      throw new Error('Failed to fetch global score');
    }
  },

  async fetchFunctionScores(): Promise<FunctionScore[]> {
    try {
      const response = await axios.get(`${baseUrl}/Score_Fonction`, { 
        headers,
        params: {
          sort: [{ field: 'Name', direction: 'asc' }],
          filterByFormula: 'NOT({Name} = "N/A")'
        }
      });
      
      if (!response.data.records) {
        return [];
      }

      return response.data.records.map((record: any) => ({
        Name: sanitizeString(record.fields.Name),
        Score_Final_Fonction: sanitizeNumber(record.fields.Score_Final_Fonction),
        Nbr_KPIs: sanitizeNumber(record.fields.Nbr_KPIs),
        Nbr_KPIs_Alert: sanitizeNumber(record.fields.Nbr_KPIs_Alert)
      }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('Function Scores table not found. Please check your Airtable configuration.');
        }
        if (error.response?.status === 401) {
          throw new Error('Invalid Airtable API key. Please check your configuration.');
        }
      }
      throw new Error('Failed to fetch function scores');
    }
  },

  async fetchAuditItems() {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000;

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        console.log('🔍 Attempting to fetch audit items - Attempt', attempt + 1);
        
        const response = await axios.get(`${baseUrl}/Audit_Items`, { 
          headers,
          params: {
            sort: [
              { field: 'Fonction_Name', direction: 'asc' },
              { field: 'Problems_Name', direction: 'asc' },
              { field: 'Categorie_Problems_Name', direction: 'asc' }
            ],
            pageSize: 100
          }
        });

        // Log the first page of results
        console.log('📊 First page results:', {
          totalRecords: response.data.records.length,
          functions: [...new Set(response.data.records.map(r => r.fields.Fonction_Name))],
          hasMorePages: !!response.data.offset
        });
        
        let allRecords = [...response.data.records];
        let offset = response.data.offset;
        let pageCount = 1;
        
        while (offset) {
          console.log(`📑 Fetching page ${pageCount + 1}...`);
          await delay(200);
          
          const nextPage = await axios.get(`${baseUrl}/Audit_Items`, {
            headers,
            params: {
              offset,
              sort: [
                { field: 'Fonction_Name', direction: 'asc' },
                { field: 'Problems_Name', direction: 'asc' },
                { field: 'Categorie_Problems_Name', direction: 'asc' }
              ],
              pageSize: 100
            }
          });
          
          allRecords = [...allRecords, ...nextPage.data.records];
          offset = nextPage.data.offset;
          pageCount++;
          
          console.log(`✅ Page ${pageCount} loaded:`, {
            newRecords: nextPage.data.records.length,
            totalRecordsSoFar: allRecords.length,
            hasMorePages: !!offset
          });
        }

        // Final summary of all data
        const uniqueFunctions = [...new Set(allRecords.map(r => r.fields.Fonction_Name))];
        console.log('📈 Final Data Summary:', {
          totalRecords: allRecords.length,
          functions: uniqueFunctions,
          recordsPerFunction: uniqueFunctions.reduce((acc, fn) => {
            acc[fn] = allRecords.filter(r => r.fields.Fonction_Name === fn).length;
            return acc;
          }, {})
        });

        return allRecords.map(record => {
          console.log('Processing record:', record.fields);
          return {
            Item_ID: sanitizeString(record.id),
            Fonction_Name: sanitizeString(record.fields.Fonction_Name),
            Problems_Name: sanitizeString(record.fields.Problems_Name),
            Sub_Problems_Name: sanitizeString(record.fields.Sub_Problems_Name),
            Sub_Problems_Text: sanitizeString(record.fields.Sub_Problems_Text),
            Categorie_Problems_Name: sanitizeString(record.fields.Categorie_Problems_Name),
            Item_Name: sanitizeString(record.fields.Item_Name),
            Action_Required: sanitizeString(record.fields.Action_Required),
            Status: sanitizeString(record.fields.Status || 'Not Started'),
            Score: sanitizeNumber(record.fields.Score),
            Comments: sanitizeString(record.fields.Comments),
            Playbook_Link: sanitizeString(record.fields.Playbook_Link),
            Criticality: sanitizeString(record.fields.Criticality || 'Low')
          };
        });
      } catch (error) {
        console.error('Error fetching audit items:', error);
        throw error;
      }
    }
  },

  async fetchKPIs(): Promise<KPI[]> {
    try {
      const response = await axios.get(`${baseUrl}/KPIs`, { 
        headers,
        params: {
          filterByFormula: 'NOT({Fonctions} = "N/A")',
          sort: [
            { field: 'Type', direction: 'asc' },
            { field: 'Nom_KPI', direction: 'asc' }
          ]
        }
      });

      if (!response.data.records) {
        return [];
      }

      return response.data.records.map((record: any) => ({
        ID_KPI: sanitizeString(record.id),
        Nom_KPI: sanitizeString(record.fields.Nom_KPI),
        Type: sanitizeString(record.fields.Type),
        Valeur_Actuelle: sanitizeNumber(record.fields.Valeur_Actuelle),
        Score_KPI_Final: sanitizeNumber(record.fields.Score_KPI_Final),
        Statut: sanitizeString(record.fields.Statut || 'OK'),
        Fonctions: sanitizeString(record.fields.Fonctions_Readable || 'N/A')
      }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('KPIs table not found. Please check your Airtable configuration.');
        }
        if (error.response?.status === 401) {
          throw new Error('Invalid Airtable API key. Please check your configuration.');
        }
      }
      throw new Error('Failed to fetch KPIs');
    }
  },

  async updateKPIValue(id: string, value: number): Promise<void> {
    try {
      await axios.patch(
        `${baseUrl}/KPIs/${id}`,
        { fields: { Valeur_Actuelle: value } },
        { headers }
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('KPI not found');
        }
        if (error.response?.status === 401) {
          throw new Error('Invalid Airtable API key');
        }
      }
      throw new Error('Failed to update KPI value');
    }
  },

  async updateAuditItem(id: string, updates: { 
    status?: string; 
    score?: number; 
    criticality?: string;
    comments?: string;
  }): Promise<void> {
    try {
      console.log('Updating audit item:', id, updates);
      await axios.patch(
        `${baseUrl}/AUDIT_ITEMS/${id}`,
        {
          fields: {
            Status: updates.status,
            Score: updates.score,
            Criticality: updates.criticality,
            Comments: updates.comments,
          },
        },
        { headers }
      );
      console.log('Update successful');
    } catch (error) {
      console.error('Update failed:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('Audit item not found');
        }
        if (error.response?.status === 401) {
          throw new Error('Invalid Airtable API key');
        }
        console.error('Response:', error.response?.data);
      }
      throw new Error('Failed to update audit item');
    }
  }
};