import { KPI } from '../types/airtable';

/**
 * Calculate a score from 0-10 based on current vs target values
 * @param current Current value of the KPI
 * @param target Target value of the KPI
 * @param isInverse Whether higher values are worse (e.g., error rates)
 * @returns Score from 0-10 
 */
export const calculateScore = (current: number, target: number, isInverse: boolean = false): number => {
  if (target === 0) return 5; // Default middle score if no target
  
  let ratio: number;
  if (isInverse) {
    // For inverse metrics (lower is better)
    ratio = target / (current || 1); // Avoid division by zero
  } else {
    // For regular metrics (higher is better)
    ratio = current / target;
  }
  
  // Cap between 0 and 2 (0-200%)
  ratio = Math.max(0, Math.min(ratio, 2));
  
  // Convert to 0-10 scale
  return ratio * 5;
};

/**
 * Group KPIs by function and calculate function-level scores
 * @param kpis Array of KPIs from Supabase
 * @returns The same KPIs with calculated scores
 */
export const calculateFunctionScores = (kpis: KPI[]): KPI[] => {
  console.log('[DIAGNOSTIC] calculateFunctionScores called with input:', kpis);
  
  if (!kpis || kpis.length === 0) {
    console.log('[DIAGNOSTIC] No KPIs provided to calculateFunctionScores');
    return [];
  }
  
  // Make a copy to avoid mutating the original
  const processedKpis = [...kpis];
  console.log('[DIAGNOSTIC] KPI count for processing:', processedKpis.length);
  
  // Check KPI structure to verify expected properties
  if (processedKpis.length > 0) {
    const sampleKpi = processedKpis[0];
    console.log('[DIAGNOSTIC] Sample KPI structure:', {
      ID_KPI: sampleKpi.ID_KPI,
      Nom_KPI: sampleKpi.Nom_KPI,
      Fonctions: sampleKpi.Fonctions,
      Valeur_Actuelle: sampleKpi.Valeur_Actuelle,
      Valeur_Precedente: sampleKpi.Valeur_Precedente,
      Score_KPI_Final: sampleKpi.Score_KPI_Final
    });
  }
  
  // Group KPIs by function
  const functionGroups: { [key: string]: KPI[] } = {};
  processedKpis.forEach(kpi => {
    if (!kpi.Fonctions) {
      console.log(`[DIAGNOSTIC] KPI ${kpi.ID_KPI} (${kpi.Nom_KPI}) has no Fonctions property`);
      return;
    }
    
    // Handle function string - split by comma if needed
    const functions = kpi.Fonctions.split(',').map(f => f.trim()).filter(Boolean);
    console.log(`[DIAGNOSTIC] KPI ${kpi.ID_KPI} has functions:`, functions);
    
    functions.forEach(func => {
      if (!functionGroups[func]) {
        functionGroups[func] = [];
      }
      functionGroups[func].push(kpi);
    });
    
    // Le code suivant a été commenté pour préserver les scores calculés dans la base de données
    // NE PAS RÉACTIVER - Le système repose maintenant sur Score_KPI_Final calculé directement dans la BDD
    /*
    // Calculate individual KPI score based on current vs previous value
    // If no previous value, use a neutral score of 5
    if (kpi.Valeur_Precedente > 0) {
      const changeRatio = kpi.Valeur_Actuelle / kpi.Valeur_Precedente;
      // Basic scoring: 1.0 = no change (score 5), 1.1 = 10% improvement (score ~6-7), 0.9 = 10% decline (score ~3-4)
      kpi.Score_KPI_Final = Math.min(10, Math.max(0, 5 * changeRatio));
      console.log(`[DIAGNOSTIC] Calculated score for KPI ${kpi.ID_KPI}: ${kpi.Score_KPI_Final} (ratio: ${changeRatio})`);
    } else if (kpi.Score_KPI_Final === 0) {
      // Initialize score if not already set and no previous value for comparison
      kpi.Score_KPI_Final = 5; // Neutral score
      console.log(`[DIAGNOSTIC] Set default score 5 for KPI ${kpi.ID_KPI} (no previous value)`);
    }
    */
    
    // Log pour vérifier qu'on garde la valeur de score de la base de données sans transformation
    console.log(`[DIAGNOSTIC] Utilisation du score DB pour KPI ${kpi.ID_KPI} (${kpi.Nom_KPI}): ${kpi.Score_KPI_Final}`);
    
  });
  
  console.log('[DIAGNOSTIC] Function groups created:', Object.keys(functionGroups));
  
  // Map to store function scores
  const functionScores: Record<string, number> = {};
  
  // Calculate function scores by averaging KPI scores within each function
  Object.keys(functionGroups).forEach(func => {
    const funcKpis = functionGroups[func];
    let validScoreCount = 0;
    let totalScore = 0;
    
    funcKpis.forEach(kpi => {
      if (typeof kpi.Score_KPI_Final === 'number') {
        totalScore += kpi.Score_KPI_Final;
        validScoreCount++;
      }
    });
    
    // Store function average score
    functionScores[func] = validScoreCount > 0 ? totalScore / validScoreCount : 5;
    console.log(`[DIAGNOSTIC] Function ${func} score: ${functionScores[func]} (from ${validScoreCount} KPIs)`);
  });
  
  console.log('[DIAGNOSTIC] All function scores calculated:', functionScores);
  console.log('[DIAGNOSTIC] Returning processed KPIs count:', processedKpis.length);
  
  return processedKpis;
};

export const getScoreColor = (score: number): string => {
  if (score >= 7) return 'text-green-500';
  if (score >= 4) return 'text-yellow-500';
  return 'text-red-500';
};

export const formatScore = (score: number): string => {
  return score.toFixed(1);
};