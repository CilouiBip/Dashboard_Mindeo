import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

// Créer le client Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Variables d\'environnement manquantes: VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createKpiValueView() {
  console.log('Création de la vue vw_kpi_values_with_names...');
  
  try {
    // Créer la vue qui joint kpi_value et kpi_def pour montrer le nom du KPI
    const { error } = await supabase.rpc('create_view_kpi_values_with_names');

    if (error) {
      console.error('Erreur lors de la création de la vue:', error);
      return;
    }
    
    console.log('Vue créée avec succès!');
    
    // Afficher quelques données de la nouvelle vue pour vérification
    const { data, error: fetchError } = await supabase
      .from('vw_kpi_values_with_names')
      .select('*')
      .limit(10);
      
    if (fetchError) {
      console.error('Erreur lors de la récupération des données de la vue:', fetchError);
      return;
    }
    
    console.log('Exemple de données dans la nouvelle vue:');
    console.log(data);
    
  } catch (error) {
    console.error('Erreur:', error);
  }
}

// Exécuter la fonction
createKpiValueView();
