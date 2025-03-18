import { createClient } from '@supabase/supabase-js';

// Utilise les mêmes variables d'environnement que l'application
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('====== VÉRIFICATION DES TABLES SUPABASE ======');
console.log('URL Supabase:', supabaseUrl ? 'configurée' : 'manquante');
console.log('Clé Supabase:', supabaseKey ? 'configurée' : 'manquante');

// Initialise le client Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction pour vérifier les tables
async function checkTables() {
  // Liste des tables à vérifier
  const tablesToCheck = ['infopreneur', 'kpi_def', 'kpi_value', 'kpi_benchmark', 'mvd_kpi'];
  
  for (const table of tablesToCheck) {
    try {
      console.log(`\nVérification de la table '${table}'...`);
      const { data, error } = await supabase.from(table).select('count');
      
      if (error) {
        console.log(`  ERREUR - ${error.message}`);
      } else {
        console.log(`  OK - Table existante`);
        
        // Compter les lignes
        const { count, error: countError } = await supabase.from(table).select('*', { count: 'exact', head: true });
        
        if (countError) {
          console.log(`  ERREUR lors du comptage - ${countError.message}`);
        } else {
          console.log(`  Nombre de lignes: ${count || 0}`);
        }
        
        // Récupérer un échantillon pour voir la structure
        if (count && count > 0) {
          const { data: sample, error: sampleError } = await supabase.from(table).select('*').limit(1);
          
          if (sampleError) {
            console.log(`  ERREUR lors de l'échantillonnage - ${sampleError.message}`);
          } else if (sample && sample.length > 0) {
            console.log(`  Colonnes: ${Object.keys(sample[0]).join(', ')}`);
          }
        }
      }
    } catch (e) {
      console.log(`  ERREUR CRITIQUE pour '${table}' - ${e.message}`);
    }
  }
  
  // Vérifier les vues
  console.log('\n====== VÉRIFICATION DES VUES ======');
  const viewsToCheck = ['vw_kpis', 'vw_kpi_fonction_scores', 'vw_kpi_global_score'];
  
  for (const view of viewsToCheck) {
    try {
      console.log(`\nVérification de la vue '${view}'...`);
      const { data, error } = await supabase.from(view).select('*').limit(1);
      
      if (error) {
        console.log(`  ERREUR - ${error.message}`);
      } else {
        console.log(`  OK - Vue existante`);
        if (data && data.length > 0) {
          console.log(`  Colonnes: ${Object.keys(data[0]).join(', ')}`);
        } else {
          console.log(`  Vue vide (aucune donnée)`);
        }
      }
    } catch (e) {
      console.log(`  ERREUR CRITIQUE pour '${view}' - ${e.message}`);
    }
  }
}

checkTables().catch(error => {
  console.error('Erreur globale:', error);
});
