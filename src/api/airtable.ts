import axios from 'axios';
import { KPI, GlobalScore, FunctionScore, AuditItem, Problem } from '../types/airtable';

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

  async fetchMarketingProblems(): Promise<Problem[]> {
    try {
      const response = await axios.get(`${baseUrl}/Marketing`, { headers });
      return response.data.records.map((record: any) => ({
        id: record.id,
        ...record.fields,
      }));
    } catch (error) {
      console.error('Error fetching marketing problems:', error);
      throw error;
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
            filterByFormula: "{KPIs_Audit} = 'To Audit '",
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
              filterByFormula: "{KPIs_Audit} = 'To Audit '",
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

  async fetchFullList() {
    try {
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

      let allRecords = [...response.data.records];
      let offset = response.data.offset;
      
      while (offset) {
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
      }

      return allRecords.map(record => ({
        id: record.id,
        Fonction_Name: sanitizeString(record.fields.Fonction_Name),
        Problems_Name: sanitizeString(record.fields.Problems_Name),
        Sub_Problems_Text: sanitizeString(record.fields.Sub_Problems_Text),
        Categorie_Problems_Name: sanitizeString(record.fields.Categorie_Problems_Name),
        Item_Name: sanitizeString(record.fields.Item_Name),
        Action_Required: sanitizeString(record.fields.Action_Required),
        Status: sanitizeString(record.fields.Status || 'Not Started'),
        Criticality: sanitizeString(record.fields.Criticality || 'Low')
      }));
    } catch (error) {
      console.error('Error fetching full list:', error);
      throw error;
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
        Type: sanitizeString(record.fields.Type) as 'Input' | 'Output',
        Valeur_Actuelle: sanitizeNumber(record.fields.Valeur_Actuelle),
        Valeur_Precedente: sanitizeNumber(record.fields.Valeur_Precedente || 0),
        Score_KPI_Final: sanitizeNumber(record.fields.Score_KPI_Final),
        Statut: sanitizeString(record.fields.Statut || 'OK'),
        Fonctions: sanitizeString(record.fields.Fonctions_Readable || 'N/A'),
        Impact_Weight: sanitizeNumber(record.fields.Impact_Weight || 1),
        Category_Weight: sanitizeNumber(record.fields.Category_Weight || 1),
        Impact_Type: sanitizeString(record.fields.Impact_Type || 'Linear') as 'Linear' | 'Exponential',
        Impact_Direction: sanitizeString(record.fields.Impact_Direction || 'Direct') as 'Direct' | 'Inverse',
        Baseline_Revenue: sanitizeNumber(record.fields.Baseline_Revenue || 1000000),
        Baseline_EBITDA: sanitizeNumber(record.fields.Baseline_EBITDA || 200000),
        Scaling_Factor: sanitizeNumber(record.fields.Scaling_Factor || 1),
        EBITDA_Factor: sanitizeNumber(record.fields.EBITDA_Factor || 0.2)
      }));
    } catch (error) {
      console.error('Error fetching KPIs:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response:', error.response?.data);
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

  async fetchKPIsBenchmark(): Promise<KPI[]> {
    try {
      console.log('🔍 Fetching KPIs Benchmark...');
      const response = await axios.get(`${baseUrl}/KPIs_Benchmark`, { 
        headers,
        params: {
          sort: [
            { field: 'Fonctions_Sort', direction: 'asc' },
            { field: 'Nom_KPI_Sort', direction: 'asc' }
          ]
        }
      });

      if (!response.data.records) {
        console.log('❌ No records found in KPIs_Benchmark');
        return [];
      }

      console.log('📊 Found records:', response.data.records.length);
      
      return response.data.records.map((record: any) => {
        const kpi = {
          ID_KPI: sanitizeString(record.fields.KPI_ID),
          Nom_KPI: sanitizeString(record.fields.Nom_KPI),
          Fonctions: sanitizeString(record.fields.Fonctions_Sort),
          Type: sanitizeString(record.fields.KPI_Type || 'Input') as 'Input' | 'Output',
          Valeur_Actuelle: sanitizeNumber(record.fields.Current_Values),
          Valeur_Precedente: sanitizeNumber(record.fields.Previous_Value),
          Impact_Weight: sanitizeNumber(record.fields.Impact_Weight),
          Category_Weight: sanitizeNumber(record.fields.Category_Weight),
          Impact_Type: sanitizeString(record.fields.Impact_Type || 'Linear') as 'Linear' | 'Exponential',
          Impact_Direction: sanitizeString(record.fields.Impact_Direction || 'Direct') as 'Direct' | 'Inverse',
          Baseline_Revenue: sanitizeNumber(record.fields.Baseline_Revenue),
          Baseline_EBITDA: sanitizeNumber(record.fields.Baseline_EBITDA),
          Scaling_Factor: sanitizeNumber(record.fields.Scaling_Factor),
          EBITDA_Factor: sanitizeNumber(record.fields.EBITDA_Factor),
          Min_Benchmark: sanitizeNumber(record.fields.Min_Benchmark),
          Max_Benchmark: sanitizeNumber(record.fields.Max_Benchmark),
          Dependencies: sanitizeString(record.fields.Dependencies)
        };
        console.log('📎 Processing KPI:', kpi.Nom_KPI, kpi);
        return kpi;
      });
    } catch (error) {
      console.error('❌ Error fetching KPIs Benchmark:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response:', error.response?.data);
        if (error.response?.status === 404) {
          throw new Error('KPIs_Benchmark table not found. Please check your Airtable configuration.');
        }
        if (error.response?.status === 401) {
          throw new Error('Invalid Airtable API key. Please check your configuration.');
        }
      }
      throw new Error('Failed to fetch KPIs Benchmark');
    }
  },

  async fetchKPIData() {
    try {
      const response = await axios.get(`${baseUrl}/KPIs`, {
        headers,
        params: {
          fields: [
            'Nom_KPI',
            'Valeur_Actuelle',
            'Valeur_Precedente',
            'Type',
            'Fonctions'
          ]
        }
      });

      return response.data.records.map(record => ({
        id: record.id,
        ...record.fields,
        previousValue: record.fields.Valeur_Precedente || '-'
      }));
    } catch (error) {
      console.error('Error fetching KPI data:', error);
      throw error;
    }
  },

  async getKPIById(kpiId: string) {
    try {
      const response = await axios.get(`${baseUrl}/KPIs/${kpiId}`, {
        headers
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching KPI:', error);
      throw error;
    }
  },

  async updateKPIValue(kpiId: string, newValue: number) {
    try {
      console.log('Updating KPI:', { kpiId, newValue });
      
      // 1. Get current KPI data
      const response = await axios.get(`${baseUrl}/KPIs/${kpiId}`, { headers });
      console.log('Current KPI data structure:', response.data);
      
      if (!response.data || !response.data.fields) {
        throw new Error('Invalid KPI data received');
      }

      const currentValue = response.data.fields.Valeur_Actuelle;

      // Create update payload with only the fields we want to update
      const updatePayload = {
        fields: {
          "Valeur_Actuelle": Number(newValue),
          "Valeur_Precedente": Number(currentValue)
        }
      };

      console.log('Update payload:', updatePayload);

      // 2. Update values
      const updateResponse = await axios.patch(
        `${baseUrl}/KPIs/${kpiId}`,
        updatePayload,
        { headers }
      );

      console.log('Update response:', updateResponse.data);

      // 3. Refresh KPI data
      return await this.fetchKPIData();
    } catch (error) {
      console.error('Error updating KPI:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response:', error.response?.data);
        const message = error.response?.data?.error?.message || 'Failed to update KPI';
        console.error('Error message:', message);
        throw new Error(message);
      }
      throw error;
    }
  },

  async updateKPIValueLegacy(id: string, value: number): Promise<void> {
    try {
      // First, get the current value
      const response = await axios.get(`${baseUrl}/KPIs/${id}`, { headers });
      const currentValue = response.data.fields.Valeur_Actuelle;

      // Update both current and previous values
      await axios.patch(
        `${baseUrl}/KPIs/${id}`,
        { 
          fields: { 
            Valeur_Actuelle: value,
            Valeur_Precedente: currentValue
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
          throw new Error('Invalid Airtable API key');
        }
      }
      throw new Error('Failed to update KPI value');
    }
  },

  async updateAuditItem(id: string, updates: { 
    Status?: Status; 
    Criticality?: Priority;
    Comments?: string;
    Score?: number;
  }): Promise<void> {
    try {
      const updatePayload = {
        fields: {
          ...(updates.Status && { Status: updates.Status }),
          ...(updates.Criticality && { Criticality: updates.Criticality }),
          ...(updates.Comments && { Comments: updates.Comments }),
          ...(updates.Score !== undefined && { Score: updates.Score })
        }
      };

      console.log('Sending update to Airtable:', {
        url: `${baseUrl}/Audit_Items/${id}`,
        payload: updatePayload,
        headers
      });

      const response = await axios.patch(
        `${baseUrl}/Audit_Items/${id}`,
        updatePayload,
        { headers }
      );

      console.log('Airtable response:', response.data);
    } catch (error) {
      console.error('Error updating audit item:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
      throw error;
    }
  }
};