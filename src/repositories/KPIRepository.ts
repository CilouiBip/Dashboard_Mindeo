import { KPI, GlobalScore, FunctionScore } from '../types/airtable';
import { SupabaseKPIRepository } from './SupabaseKPIRepository';

// Interface définissant les opérations communes sur les KPIs
export interface KPIRepository {
  fetchGlobalScore(): Promise<GlobalScore>;
  fetchFunctionScores(): Promise<FunctionScore[]>;
  fetchKPIs(): Promise<KPI[]>;
  getKPIById(kpiId: string): Promise<KPI | null>;
  updateKPIValue(data: { ID_KPI: string; Valeur_Actuelle: number }): Promise<KPI | null>;
}

// Flag pour contrôler la source de données (pourra être déplacé dans un fichier de config)
export const DATA_SOURCE = {
  GLOBAL_SCORE: 'supabase', // 'airtable' ou 'supabase'
  FUNCTION_SCORES: 'supabase',
  KPIS: 'supabase'
};


// Factory pour obtenir la bonne implémentation selon la configuration
export function getKPIRepository(): KPIRepository {
  return SupabaseKPIRepository.getInstance();
}
