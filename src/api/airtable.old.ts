// This is a backup of the original airtable.ts file before reorganization
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

interface PriorityItem {
  id: string;
  Action_Required: string;
  Item_Name: string;
  Catégorie_Name_Link: string;
  Sub_Problems_Text: string;
  Problems_Name: string;
  Status: string;
  Item_ID: string | number;
  Criticality: string;
  KPIs_Name: string[];
  KPIs_Status_: string[];
  Fonction_Name: string;
  Playbook_Link?: string;
}

interface ActionItem {
  id: string;
  action: string;
  actionWeek: string;
  status: string;
  itemName: string;
  functionName: string;
  progress: number;
  estimatedHours: number;
  actualHours: number;
}

const mapRecord = (record: Record<string, any>): PriorityItem => {
  const fields = record.fields;
  console.log('Raw record fields:', fields); // Debug log

  return {
    id: record.id,
    Action_Required: fields.Action_Required || '',
    Item_Name: fields.Item_Name || '',
    Catégorie_Name_Link: Array.isArray(fields.Categorie_Problems_Name) ? fields.Categorie_Problems_Name[0] : fields.Categorie_Problems_Name || '',
    Sub_Problems_Text: fields.Sub_Problems_Text || '',
    Problems_Name: Array.isArray(fields.Problems_Name) ? fields.Problems_Name[0] : fields.Problems_Name || '',
    Status: fields.Status || 'Not Started',
    Item_ID: fields.Item_ID || '',
    Criticality: fields.Criticality || 'Low',
    KPIs_Name: Array.isArray(fields.KPIs_Name) ? fields.KPIs_Name : [],
    KPIs_Status_: Array.isArray(fields.KPIs_Status_) ? fields.KPIs_Status_ : [],
    Fonction_Name: Array.isArray(fields.Fonction_Name) ? fields.Fonction_Name[0] : fields.Fonction_Name || '',
    Playbook_Link: fields.Playbook_Link || ''
  };
};

export const api = {
  // ... rest of the original file content
};
