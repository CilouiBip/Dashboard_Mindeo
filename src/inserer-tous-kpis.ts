import { createClient } from '@supabase/supabase-js';

// Utilise les mu00eames variables d'environnement que l'application
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialise le client Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Insu00e8re des valeurs pour tous les KPIs pour afficher un tableau de bord complet
 */
async function insererTousLesKPIs() {
  console.log('Du00e9but de l\'insertion de tous les KPIs...');
  
  try {
    // 1. Ru00e9cupu00e9rer l'ID du premier infopreneur
    const { data: infopreneur, error: infopreneurError } = await supabase
      .from('infopreneur')
      .select('id')
      .limit(1);
      
    if (infopreneurError || !infopreneur || infopreneur.length === 0) {
      console.error('Erreur lors de la ru00e9cupu00e9ration de l\'infopreneur:', infopreneurError);
      return;
    }
    
    const infopreneurId = infopreneur[0].id;
    console.log(`Infopreneur ID: ${infopreneurId}`);
    
    // 2. Ru00e9cupu00e9rer tous les KPIs du00e9finis
    const { data: kpiDefs, error: kpiDefsError } = await supabase
      .from('kpi_def')
      .select('id, code, fonction, min_value, max_value');
      
    if (kpiDefsError || !kpiDefs) {
      console.error('Erreur lors de la ru00e9cupu00e9ration des du00e9finitions de KPIs:', kpiDefsError);
      return;
    }
    
    console.log(`Nombre de KPIs trouvu00e9s: ${kpiDefs.length}`);
    
    // 3. Vu00e9rifier quels KPIs ont du00e9ju00e0 des valeurs
    const { data: existingValues, error: existingValuesError } = await supabase
      .from('kpi_value')
      .select('kpi_id')
      .eq('infopreneur_id', infopreneurId);
      
    const existingKpiIds = new Set(
      existingValues?.map(v => v.kpi_id) || []
    );
    
    console.log(`KPIs avec des valeurs existantes: ${existingKpiIds.size}`);
    
    // 4. Gu00e9nu00e9rer des valeurs ru00e9alistes pour chaque KPI en fonction de sa catu00e9gorie
    const newValues = [];
    
    for (const kpi of kpiDefs) {
      // Sauter les KPIs qui ont du00e9ju00e0 des valeurs
      if (existingKpiIds.has(kpi.id)) {
        console.log(`KPI ${kpi.code} a du00e9ju00e0 une valeur, on saute.`);
        continue;
      }
      
      // Gu00e9nu00e9rer une valeur ru00e9aliste basu00e9e sur la fonction et le code
      let valeur;
      
      // Utiliser min_value et max_value pour du00e9terminer une plage ru00e9aliste
      const min = kpi.min_value || 0;
      const max = kpi.max_value || 100;
      const range = max - min;
      
      // Un peu de logique pour gu00e9nu00e9rer des valeurs qui font sens
      if (kpi.code.includes('taux') || kpi.code.includes('rate')) {
        // Pour les pourcentages, valeurs entre 20% et 95%
        valeur = min + (Math.random() * 0.75 * range) + (0.2 * range);
      } else if (kpi.code.includes('ca_') || kpi.code.includes('revenue')) {
        // Pour les chiffres d'affaires, valeurs plutu00f4t u00e9levu00e9es
        valeur = min + (Math.random() * 0.7 * range) + (0.3 * range);
      } else if (kpi.code.includes('cac') || kpi.code.includes('cpl')) {
        // Pour les cou00fbts, valeurs plutu00f4t basses pour avoir de bons scores
        valeur = min + (Math.random() * 0.4 * range);
      } else if (kpi.code.includes('nps') || kpi.code.includes('satisf')) {
        // Pour la satisfaction, valeurs plutu00f4t bonnes
        valeur = min + (Math.random() * 0.3 * range) + (0.7 * range);
      } else {
        // Valeur alu00e9atoire dans la plage
        valeur = min + (Math.random() * range);
      }
      
      // Arrondir u00e0 un du00e9cimal pour u00e9viter les nombres trop pru00e9cis
      valeur = Math.round(valeur * 10) / 10;
      
      newValues.push({
        infopreneur_id: infopreneurId,
        kpi_id: kpi.id,
        valeur: valeur
      });
      
      console.log(`Pru00e9paration valeur pour ${kpi.code}: ${valeur} (fonction: ${kpi.fonction})`);
    }
    
    // 5. Insu00e9rer les nouvelles valeurs
    if (newValues.length > 0) {
      const { data: insertResult, error: insertError } = await supabase
        .from('kpi_value')
        .insert(newValues);
        
      if (insertError) {
        console.error('Erreur lors de l\'insertion des valeurs:', insertError);
      } else {
        console.log(`${newValues.length} valeurs KPI insu00e9ru00e9es avec succu00e8s!`);
      }
    } else {
      console.log('Aucune nouvelle valeur u00e0 insu00e9rer, tous les KPIs ont du00e9ju00e0 des valeurs.');
    }
    
    // 6. Vu00e9rifier les scores par fonction
    console.log('\nVu00e9rification des scores par fonction:');
    const { data: fonctionScores, error: fonctionScoresError } = await supabase
      .from('vw_kpi_fonction_scores')
      .select('*')
      .eq('infopreneur_id', infopreneurId);
      
    if (fonctionScoresError) {
      console.error('Erreur lors de la ru00e9cupu00e9ration des scores par fonction:', fonctionScoresError);
    } else if (fonctionScores) {
      for (const score of fonctionScores) {
        console.log(`Fonction ${score.Name}: Score = ${score.Score_Final_Fonction.toFixed(2)}, KPIs = ${score.Nbr_KPIs}, Alertes = ${score.Nbr_KPIs_Alert}`);
      }
    }
    
    // 7. Vu00e9rifier le score global
    const { data: globalScore, error: globalScoreError } = await supabase
      .from('vw_kpi_global_score')
      .select('*')
      .eq('infopreneur_id', infopreneurId)
      .limit(1);
      
    if (globalScoreError) {
      console.error('Erreur lors de la ru00e9cupu00e9ration du score global:', globalScoreError);
    } else if (globalScore && globalScore.length > 0) {
      console.log(`\nScore global: ${globalScore[0].Score_Global_Sur_10.toFixed(2)}/10`);
    }
    
    console.log('\nL\'insertion est terminu00e9e! Vous pouvez maintenant consulter le dashboard pour voir tous les KPIs.');
    
  } catch (error) {
    console.error('Erreur gu00e9nu00e9rale:', error);
  }
}

insererTousLesKPIs();
