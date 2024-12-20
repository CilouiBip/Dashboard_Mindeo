export enum KPIType {
  Input = 'Input',
  Output = 'Output'
}

export enum Priority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low'
}

export enum Status {
  NotStarted = 'Not Started',
  InProgress = 'In Progress',
  Completed = 'Completed'
}

export interface GlobalScore {
  Score_Global_Sur_10: number;
}

export interface FunctionScore {
  Name: string;
  Score_Final_Fonction: number;
  Nbr_KPIs: number;
  Nbr_KPIs_Alert: number;
}

export interface KPI {
  ID_KPI: string;
  Nom_KPI: string;
  Type: KPIType;
  Valeur_Actuelle: number;
  Valeur_Precedente: number;
  Score_KPI_Final: number;
  Statut: string;
  Fonctions: string;
}

export interface AuditItem {
  Item_ID: string;
  Item_Name: string;
  Status: Status;
  Criticality: Priority;
  Action_Required: string;
  Playbook_Link?: string;
  Categorie_Problems_Name: string;
  Sub_Problems_Name: string;
  Sub_Problems_Text: string;
  Problems_Name: string;
  Fonction_Name: string;
  Score: number;
  Comments?: string;
  KPIs_Name?: string;
}

export interface PriorityItem {
  id: string;
  Action_Required: string;
  Item_Name: string;
  Catégorie_Name_Link: string;
  Sub_Problems_Text: string;
  Problems_Name: string;
  Status: Status;
  Item_ID: string | number;
  Criticality: Priority;
  KPIs_Name: string[];
  KPIs_Status_: string[];
  Fonction_Name: string;
  Playbook_Link?: string;
}

export interface ActionItem {
  id: string;
  action: string;
  actionWeek: string;
  status: Status;
  itemName: string;
  functionName: string;
  progress: number;
  estimatedHours: number;
  actualHours: number;
}