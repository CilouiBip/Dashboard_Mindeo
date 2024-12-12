import { Priority, Status } from './airtable';

export interface AuditItem {
  Item_ID: string;
  Fonction_Name: string;
  Problems_Name: string;
  Sub_Problems_Text: string;
  Categorie_Problems_Name: string;
  Item_Name: string;
  Action_Required: string;
  Status: Status;
  Criticality: Priority;
  Score?: number;
  Comments?: string;
  Playbook_Link?: string;
}

export interface HierarchyNode {
  items: AuditItem[];
  children: Record<string, HierarchyNode>;
  completionRate: number;
  averageScore: number;
}