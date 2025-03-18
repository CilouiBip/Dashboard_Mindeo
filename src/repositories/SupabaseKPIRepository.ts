import { KPI, GlobalScore, FunctionScore } from '../types/airtable';
import { KPIRepository } from './KPIRepository';
import { supabaseKpiService } from '../services/supabaseKpi';
import { calculateFunctionScores } from '../utils/calculations';

/**
 * Implu00e9mentation Supabase du ru00e9fu00e9rentiel KPI
 * Utilise le pattern Singleton pour garantir une seule instance
 */
export class SupabaseKPIRepository implements KPIRepository {
  private static instance: SupabaseKPIRepository;
  
  private constructor() {
    console.log('[SupabaseKPIRepository] Instance created');
  }
  
  public static getInstance(): SupabaseKPIRepository {
    if (!SupabaseKPIRepository.instance) {
      console.log('[SupabaseKPIRepository] Creating new instance');
      SupabaseKPIRepository.instance = new SupabaseKPIRepository();
    } else {
      console.log('[SupabaseKPIRepository] Returning existing instance');
    }
    return SupabaseKPIRepository.instance;
  }
  
  /**
   * Ru00e9cupu00e8re le score global en calculant la moyenne des scores de tous les KPIs
   */
  async fetchGlobalScore(): Promise<GlobalScore> {
    try {
      console.log('[SupabaseKPIRepository] Calculating global score from KPIs...');
      
      // 1. Ru00e9cupu00e9rer tous les KPIs via le service existant
      const kpis = await supabaseKpiService.getKPIs();
      console.log(`[SupabaseKPIRepository] Retrieved ${kpis.length} KPIs for global score calculation`);
      
      if (!kpis || kpis.length === 0) {
        console.warn('[SupabaseKPIRepository] No KPIs found to calculate global score');
        return { Score_Global_Sur_10: 0 };
      }
      
      // 2. Calculer le score global (moyenne des scores des KPIs)
      let totalScore = 0;
      let validScoreCount = 0;
      
      kpis.forEach(kpi => {
        if (typeof kpi.Score_KPI_Final === 'number' && !isNaN(kpi.Score_KPI_Final)) {
          totalScore += kpi.Score_KPI_Final;
          validScoreCount++;
        }
      });
      
      const globalScore = validScoreCount > 0 ? totalScore / validScoreCount : 0;
      const roundedScore = Math.round(globalScore * 100) / 100; // Arrondir u00e0 2 du00e9cimales
      
      console.log(`[SupabaseKPIRepository] Calculated global score: ${roundedScore} (from ${validScoreCount} valid KPIs)`);
      
      return {
        Score_Global_Sur_10: roundedScore
      };
    } catch (error: any) {
      console.error('[SupabaseKPIRepository] Error calculating global score:', error);
      throw new Error(`Failed to calculate global score: ${error.message}`);
    }
  }
  
  /**
   * Ru00e9cupu00e8re les scores par fonction en calculant la moyenne des scores des KPIs par fonction
   * Utilise la mu00eame approche que l'onglet KPI pour garantir la cohu00e9rence
   */
  async fetchFunctionScores(): Promise<FunctionScore[]> {
    try {
      console.log('[SupabaseKPIRepository] Calculating function scores from KPIs...');
      
      // 1. Ru00e9cupu00e9rer tous les KPIs via le service existant
      const kpis = await supabaseKpiService.getKPIs();
      console.log(`[SupabaseKPIRepository] Retrieved ${kpis.length} KPIs for function score calculation`);
      
      if (!kpis || kpis.length === 0) {
        console.warn('[SupabaseKPIRepository] No KPIs found to calculate function scores');
        return [];
      }
      
      // 2. Appliquer la fonction de calcul des scores par fonction existante
      // Exactement comme dans useKPIData
      const processedKpis = calculateFunctionScores(kpis);
      
      // 3. Extraire les scores par fonction en utilisant la mu00eame logique que KPIsMVD.tsx
      // Grouper les KPIs par fonction
      const groupedKPIs: Record<string, KPI[]> = {};
      processedKpis.forEach(kpi => {
        if (!kpi.Fonctions) return;
        
        const functions = kpi.Fonctions.split(',').map(f => f.trim()).filter(Boolean);
        functions.forEach(fonction => {
          if (!groupedKPIs[fonction]) {
            groupedKPIs[fonction] = [];
          }
          groupedKPIs[fonction].push(kpi);
        });
      });
      
      // Group KPIs by function pour calculer la moyenne des scores par fonction
      const functionGroups: { [key: string]: KPI[] } = {};
      processedKpis.forEach(kpi => {
        if (!kpi.Fonctions) return;
        
        const functions = kpi.Fonctions.split(',').map(f => f.trim()).filter(Boolean);
        functions.forEach(func => {
          if (!functionGroups[func]) {
            functionGroups[func] = [];
          }
          functionGroups[func].push(kpi);
        });
      });
      
      // Pour chaque fonction, calculer la moyenne des scores des KPIs
      const functionScoresMap: Record<string, { totalScore: number, count: number, alerts: number }> = {};
      
      Object.keys(functionGroups).forEach(func => {
        const funcKpis = functionGroups[func];
        let totalScore = 0;
        let validScoreCount = 0;
        let alertCount = 0;
        
        funcKpis.forEach(kpi => {
          if (typeof kpi.Score_KPI_Final === 'number' && !isNaN(kpi.Score_KPI_Final)) {
            totalScore += kpi.Score_KPI_Final;
            validScoreCount++;
            
            // Compter les KPIs en alerte (score < 4)
            if (kpi.Score_KPI_Final < 4) {
              alertCount++;
            }
          }
        });
        
        functionScoresMap[func] = {
          totalScore: totalScore,
          count: validScoreCount,
          alerts: alertCount
        };
      });
      
      // 4. Construire le format de ru00e9ponse attendu
      const functionScores: FunctionScore[] = Object.keys(functionScoresMap).map(funcName => {
        const funcData = functionScoresMap[funcName];
        // Calculer la moyenne des scores
        const avgScore = funcData.count > 0 ? funcData.totalScore / funcData.count : 0;
        
        return {
          Name: funcName,
          Score_Final_Fonction: Number(avgScore.toFixed(1)), // Arrondir u00e0 1 du00e9cimale
          Nbr_KPIs: funcData.count,
          Nbr_KPIs_Alert: funcData.alerts
        };
      });
      
      // Trier par nom de fonction
      functionScores.sort((a, b) => a.Name.localeCompare(b.Name));
      
      console.log(`[SupabaseKPIRepository] Calculated ${functionScores.length} function scores`);
      return functionScores;
    } catch (error: any) {
      console.error('[SupabaseKPIRepository] Error fetching function scores:', error);
      throw new Error(`Failed to fetch function scores: ${error.message}`);
    }
  }
  
  /**
   * Ru00e9cupu00e8re tous les KPIs via le service Supabase existant
   */
  async fetchKPIs(): Promise<KPI[]> {
    console.log('[SupabaseKPIRepository] Fetching KPIs...');
    return await supabaseKpiService.getKPIs();
  }
  
  /**
   * Ru00e9cupu00e8re un KPI par son ID
   */
  async getKPIById(kpiId: string): Promise<KPI | null> {
    console.log(`[SupabaseKPIRepository] Finding KPI with ID: ${kpiId}`);
    const kpis = await this.fetchKPIs();
    const kpi = kpis.find(k => k.ID_KPI === kpiId);
    
    if (!kpi) {
      console.warn(`[SupabaseKPIRepository] KPI with ID ${kpiId} not found`);
      return null;
    }
    
    return kpi;
  }
  
  /**
   * Met u00e0 jour la valeur d'un KPI
   */
  async updateKPIValue(data: { ID_KPI: string; Valeur_Actuelle: number }): Promise<KPI | null> {
    console.log(`[SupabaseKPIRepository] Updating KPI ${data.ID_KPI} with value ${data.Valeur_Actuelle}`);
    
    const kpiId = parseInt(data.ID_KPI, 10);
    
    if (isNaN(kpiId)) {
      console.error('[SupabaseKPIRepository] Invalid KPI ID format');
      return null;
    }
    
    try {
      await supabaseKpiService.updateKPI(kpiId, {
        Valeur_Actuelle: data.Valeur_Actuelle
      });
      console.log(`[SupabaseKPIRepository] KPI ${data.ID_KPI} successfully updated`);
      
      // Ru00e9cupu00e9rer le KPI mis u00e0 jour
      return this.getKPIById(data.ID_KPI);
    } catch (error: any) {
      console.error('[SupabaseKPIRepository] Error updating KPI:', error);
      throw new Error(`Failed to update KPI: ${error.message}`);
    }
  }
}
