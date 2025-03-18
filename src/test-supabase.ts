/**
 * Utilitaire de test pour vérifier la connexion à Supabase et les vues
 * Exécuter avec: npx ts-node src/test-supabase.ts
 */
import { createClient } from '@supabase/supabase-js';

async function testSupabaseConnection() {
  try {
    // Test des variables d'environnement
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    console.log('=== TEST CONNEXION SUPABASE ===');
    console.log('Variables d\'environnement:');
    console.log(` - VITE_SUPABASE_URL: ${supabaseUrl ? 'présente' : 'ABSENTE'} (${supabaseUrl?.length || 0} caractères)`);
    console.log(` - VITE_SUPABASE_ANON_KEY: ${supabaseKey ? 'présente' : 'ABSENTE'} (${supabaseKey?.length || 0} caractères)`);

    if (!supabaseUrl || !supabaseKey) {
      console.error('\nERREUR: Variables d\'environnement manquantes ou invalides');
      return;
    }

    // Test de création du client
    console.log('\nTest de création du client Supabase...');
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Client créé avec succès');

    // Test de la vue globale
    console.log('\nTest de la vue vw_kpi_global_score...');
    const { data: globalData, error: globalError } = await supabase
      .from('vw_kpi_global_score')
      .select('Score_Global_Sur_10')
      .limit(1);

    if (globalError) {
      console.error(`Erreur lors de l'accès à vw_kpi_global_score: ${globalError.message}`);
    } else {
      console.log('Résultat de vw_kpi_global_score:', globalData);
    }

    // Test de la vue de fonctions
    console.log('\nTest de la vue vw_kpi_fonction_scores...');
    const { data: functionData, error: functionError } = await supabase
      .from('vw_kpi_fonction_scores')
      .select('*')
      .limit(3);

    if (functionError) {
      console.error(`Erreur lors de l'accès à vw_kpi_fonction_scores: ${functionError.message}`);
    } else {
      console.log('Résultat de vw_kpi_fonction_scores:', functionData);
    }

  } catch (error) {
    console.error('Erreur lors du test de connexion:', error);
  }
}

testSupabaseConnection();
