import axios from 'axios';
import { ActionItem, ActionStatus } from '../types/project';

const baseUrl = `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}`;
const headers = {
  'Authorization': `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json',
};

// Fonction utilitaire pour extraire la première valeur d'un tableau ou retourner la valeur directement
const getFirstOrValue = (value: any): string => {
  if (Array.isArray(value)) {
    return value[0] || '';
  }
  return value || '';
};

export const fetchActions = async (): Promise<ActionItem[]> => {
  console.log('Fetching actions with URL:', `${baseUrl}/Actions_Priority`);
  
  try {
    const response = await axios.get(`${baseUrl}/Actions_Priority`, {
      headers,
      params: {
        pageSize: 100,
        filterByFormula: "{To_Audit} = 'To Audit '"
      }
    });

    let allRecords = [...response.data.records];
    let offset = response.data.offset;
    
    while (offset) {
      console.log('Fetching next page with offset:', offset);
      const nextPage = await axios.get(`${baseUrl}/Actions_Priority`, {
        headers,
        params: {
          offset,
          pageSize: 100,
          filterByFormula: "{To_Audit} = 'To Audit '"
        }
      });
      
      allRecords = [...allRecords, ...nextPage.data.records];
      offset = nextPage.data.offset;
    }
    
    console.log('Total records fetched:', allRecords.length);
    const mappedData = mapAirtableResponse(allRecords);
    console.log('First mapped item:', mappedData[0]);
    return mappedData;
  } catch (error) {
    console.error('Error fetching actions:', error);
    throw error;
  }
};

const mapAirtableResponse = (records: any[]): ActionItem[] => {
  return records.map(record => {
    const fields = record.fields;
    
    return {
      id: record.id,
      action: fields.Action_Required || '',
      actionWeek: fields.Action_Week || '',
      status: fields.Status_Actions_Beta || 'Not Started',
      itemName: fields.Item_Name || '',
      functionName: fields.Fonction_Name || '',
      progress: Number(fields.Progress) || 0,
      estimatedHours: Number(fields.Estimated_Hours) || 0,
      actualHours: Number(fields.Actual_Hours) || 0,
      criticality: fields.Criticality || '',
      categoryName: fields.Categorie_Problems_Name || '',
      problemsName: fields.Problems_Name || '',
      subProblemsText: fields.Sub_Problems_Text || '',
      kpisName: Array.isArray(fields.KPIs_Name) ? fields.KPIs_Name : [],
      kpisStatus: Array.isArray(fields.KPIs_Status_) ? fields.KPIs_Status_ : [],
      playbookLink: fields.Playbook_Link || ''
    };
  });
};

export const updateActionStatus = async (
  id: string, 
  status: string,
  estimatedHours?: number,
  actualHours?: number
): Promise<void> => {
  try {
    const fields: any = {
      Status_Actions_Beta: status
    };

    if (estimatedHours !== undefined) {
      fields.Estimated_Hours = estimatedHours;
    }
    if (actualHours !== undefined) {
      fields.Actual_Hours = actualHours;
    }

    await axios.patch(
      `${baseUrl}/Actions_Priority/${id}`,
      { fields },
      { headers }
    );
  } catch (error) {
    console.error('Error updating action:', error);
    throw error;
  }
};
