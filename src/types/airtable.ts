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
  Type: string;
  Valeur_Actuelle: number;
  Valeur_Precedente: number;
  Score_KPI_Final: number;
  Statut: string;
  Fonctions: string;
}

export type Priority = 'High' | 'Medium' | 'Low';
export type Status = 'Not Started' | 'In Progress' | 'Completed';

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
}