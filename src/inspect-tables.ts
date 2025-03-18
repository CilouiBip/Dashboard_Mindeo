import { createClient } from '@supabase/supabase-js';

// Utilise les variables d'environnement de l'application
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialise le client Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Affiche la structure de la table en listant toutes ses colonnes
 */
async function inspectTable(tableName: string) {
  console.log(`\n======= INSPECTANT TABLE: ${tableName} =======`);
  
  try {
    // Requête pour obtenir les informations sur les colonnes de la table
    const { data, error } = await supabase
      .rpc('inspect_table_columns', { table_name: tableName });
      
    if (error) {
      console.error(`Erreur lors de l'inspection de la table ${tableName}:`, error.message);
      // Méthode alternative si la fonction RPC n'existe pas
      await checkTableExists(tableName);
      return;
    }
    
    if (!data || data.length === 0) {
      console.log(`Aucune colonne trouvée pour la table ${tableName}.`);
      return;
    }
    
    console.log(`Structure de la table ${tableName}:`);
    console.table(data);
  } catch (e) {
    console.error(`Exception lors de l'inspection de la table ${tableName}:`, e);
    // Méthode alternative si la fonction RPC échoue
    await checkTableExists(tableName);
  }
}

/**
 * Vérifie si une table existe et essaie de déterminer sa structure
 */
async function checkTableExists(tableName: string) {
  try {
    console.log(`Tentative de vérification alternative pour la table ${tableName}...`);
    
    // Essaie de récupérer les premières lignes de la table pour voir sa structure
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
      
    if (error) {
      console.error(`La table ${tableName} n'existe probablement pas ou n'est pas accessible:`, error.message);
      return;
    }
    
    if (!data || data.length === 0) {
      console.log(`La table ${tableName} existe mais est vide.`);
      return;
    }
    
    // Affiche la structure de la première ligne pour comprendre les colonnes
    console.log(`Structure déterminée à partir d'un enregistrement existant:`);
    console.log('Colonnes:', Object.keys(data[0]));
    console.log('Premier enregistrement:', data[0]);
  } catch (e) {
    console.error(`Exception lors de la vérification de la table ${tableName}:`, e);
  }
}

/**
 * Liste toutes les tables accessibles dans la base de données
 */
async function listAllTables() {
  console.log('\n======= LISTER TOUTES LES TABLES =======');
  
  try {
    // Requête pour lister toutes les tables du schéma public
    const { data, error } = await supabase
      .rpc('list_all_tables');
      
    if (error) {
      console.error('Erreur lors de la récupération des tables:', error.message);
      // Méthode alternative - utiliser information_schema
      await listTablesAlternative();
      return;
    }
    
    if (!data || data.length === 0) {
      console.log('Aucune table trouvée dans la base de données.');
      return;
    }
    
    console.log('Tables disponibles:');
    console.table(data);
  } catch (e) {
    console.error('Exception lors de la récupération des tables:', e);
    // Méthode alternative
    await listTablesAlternative();
  }
}

/**
 * Méthode alternative pour lister les tables si la fonction RPC n'est pas disponible
 */
async function listTablesAlternative() {
  console.log('\n======= MÉTHODE ALTERNATIVE POUR LISTER LES TABLES =======');
  
  try {
    // Essaie de récupérer les tables connues par notre application
    const knownTables = ['mvd_kpi', 'infopreneurs', 'users'];
    console.log('Vérification des tables connues...');
    
    for (const tableName of knownTables) {
      await checkTableExists(tableName);
    }
  } catch (e) {
    console.error('Exception lors de la méthode alternative:', e);
  }
}

// Exécute les fonctions de diagnostic
(async () => {
  console.log('\n====== DIAGNOSTIC DES TABLES SUPABASE ======');
  console.log('URL Supabase:', supabaseUrl ? `configurée (${supabaseUrl})` : 'manquante');
  console.log('Clé Supabase:', supabaseKey ? `configurée (longueur: ${supabaseKey.length})` : 'manquante');
  
  try {
    // Liste toutes les tables
    await listAllTables();
    
    // Inspecte les tables spécifiques
    await inspectTable('mvd_kpi');
    await inspectTable('infopreneurs');
    
    console.log('\n====== DIAGNOSTIC TERMINÉ ======');
  } catch (e) {
    console.error('Erreur lors du diagnostic:', e);
  }
})();
