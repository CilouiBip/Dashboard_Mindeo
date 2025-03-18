import { createClient } from '@supabase/supabase-js';

// Utilise les mêmes variables d'environnement que l'application
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log des informations de connexion
console.log('====== DIAGNOSTIC SUPABASE ======');
console.log('URL:', supabaseUrl);
console.log('Key length:', supabaseKey?.length || 0);

// Initialise le client Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction pour lister toutes les tables disponibles
async function listTables() {
  try {
    // Requête spéciale pour postgres qui liste les tables
    const { data: tables, error } = await supabase.rpc('list_tables');
    
    if (error) {
      console.error('Erreur lors de la récupération des tables:', error.message);
      // Alternative: essayer une autre méthode
      testConnection();
      return;
    }
    
    console.log('Tables disponibles dans la base de données:', tables);
  } catch (e) {
    console.error('Exception lors de la récupération des tables:', e);
    // Alternative si la fonction RPC n'existe pas
    testConnection();
  }
}

// Test de connexion de base et vérification de la table mvd_kpi
async function testConnection() {
  try {
    console.log('Test de connexion de base à Supabase...');
    
    // Tente de récupérer les lignes de la table mvd_kpi
    const { data, error } = await supabase.from('mvd_kpi').select('*').limit(5);
    
    if (error) {
      console.error('ERREUR DE CONNEXION:', error.message, error.details, error.hint);
      if (error.code === '42P01') {
        console.error("La table 'mvd_kpi' n'existe pas dans la base de données.");
      }
      return;
    }
    
    console.log('Connexion réussie!');
    console.log(`Nombre de KPIs trouvés: ${data?.length || 0}`);
    if (data && data.length > 0) {
      console.log('Premier KPI trouvé:', data[0]);
      console.log('Structure du KPI (noms des champs):', Object.keys(data[0]));
    } else {
      console.log('Aucun KPI trouvé dans la table mvd_kpi');
    }
  } catch (e) {
    console.error('Exception lors du test de connexion:', e);
  }
}

// Exécute les tests
(async () => {
  console.log('Démarrage des diagnostics Supabase...');
  await listTables();
  await testConnection();
  console.log('Diagnostics terminés.');
})();
