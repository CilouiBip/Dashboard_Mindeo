import { PriorityItem, Status, Priority } from '../../types/airtable';

export const baseUrl = `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}`;
export const headers = {
  Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY}`,
};

export const sanitizeNumber = (value: any): number => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

export const sanitizeString = (value: any): string => {
  return String(value || '');
};

export const mapRecord = (record: Record<string, any>): PriorityItem => {
  const fields = record.fields;
  
  return {
    id: record.id,
    Action_Required: fields.Action_Required || '',
    Item_Name: fields.Item_Name || '',
    Catégorie_Name_Link: Array.isArray(fields.Categorie_Problems_Name) ? fields.Categorie_Problems_Name[0] : fields.Categorie_Problems_Name || '',
    Sub_Problems_Text: fields.Sub_Problems_Text || '',
    Problems_Name: Array.isArray(fields.Problems_Name) ? fields.Problems_Name[0] : fields.Problems_Name || '',
    Status: fields.Status || Status.NotStarted,
    Item_ID: fields.Item_ID || '',
    Criticality: fields.Criticality || Priority.Low,
    KPIs_Name: Array.isArray(fields.KPIs_Name) ? fields.KPIs_Name : [],
    KPIs_Status_: Array.isArray(fields.KPIs_Status_) ? fields.KPIs_Status_ : [],
    Fonction_Name: Array.isArray(fields.Fonction_Name) ? fields.Fonction_Name[0] : fields.Fonction_Name || '',
    Playbook_Link: fields.Playbook_Link || ''
  };
};
