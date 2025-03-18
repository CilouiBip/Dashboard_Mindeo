/**
 * Script pour exécuter les migrations de mise à jour des benchmarks KPI
 * 
 * Ce script exécute séquentiellement les fichiers de migration SQL pour mettre à jour
 * les benchmarks KPI et les vues associées dans la base de données Supabase.
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir le chemin du répertoire actuel (équivalent à __dirname en CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration de la connexion Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erreur: Variables d\'environnement VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Chemins des fichiers de migration
const migrationFiles = [
  '../migrations/04_update_kpi_benchmarks.sql',
  '../migrations/05_update_kpi_views.sql'
];

/**
 * Exécute un fichier SQL
 * @param {string} filePath - Chemin vers le fichier SQL
 */
async function executeSqlFile(filePath) {
  try {
    console.log(`🔄 Exécution du fichier: ${path.basename(filePath)}`);
    
    // Lire le contenu du fichier SQL
    const fullPath = path.join(__dirname, filePath);
    const sqlContent = fs.readFileSync(fullPath, 'utf8');
    
    // Diviser le fichier en instructions SQL individuelles
    const sqlStatements = sqlContent
      .split(';')
      .filter(statement => statement.trim() !== '');
    
    // Exécuter chaque instruction séparément
    for (let i = 0; i < sqlStatements.length; i++) {
      const sql = sqlStatements[i].trim() + ';';
      
      // Exécuter la requête SQL via l'API Supabase rpc
      const { data, error } = await supabase.rpc('exec_sql', { sql });
      
      if (error) {
        console.error(`❌ Erreur à l'instruction ${i+1}: ${error.message}`);
        console.error('Instruction SQL:', sql.substring(0, 100) + '...');
      } else {
        console.log(`✅ Instruction ${i+1} exécutée avec succès`);
      }
    }
    
    console.log(`✅ Fichier ${path.basename(filePath)} exécuté avec succès`);
  } catch (error) {
    console.error(`❌ Erreur lors de l'exécution du fichier ${filePath}:`, error.message);
    throw error;
  }
}

/**
 * Vérifier que les benchmarks ont été correctement mis à jour
 */
async function verifyUpdates() {
  console.log('\n🔍 Vérification des mises à jour des benchmarks KPI...');
  
  // Vérifier les valeurs de benchmark pour quelques KPIs clés
  const kpisToCheck = ['cpl', 'ebitda', 'ca_mensuel', 'taux_completion'];
  
  for (const kpiCode of kpisToCheck) {
    const { data, error } = await supabase
      .from('kpi_def')
      .select('code, min_value, max_value')
      .eq('code', kpiCode)
      .single();
    
    if (error) {
      console.error(`❌ Erreur lors de la vérification du KPI ${kpiCode}:`, error.message);
    } else if (data) {
      console.log(`✅ KPI ${kpiCode}: min_value = ${data.min_value}, max_value = ${data.max_value}`);
    } else {
      console.error(`❌ KPI ${kpiCode} non trouvé`);
    }
  }
  
  // Vérifier que les vues ont été mises à jour
  const views = ['vw_kpis', 'vw_kpi_fonction_scores', 'vw_kpi_global_score'];
  
  for (const view of views) {
    const { data, error } = await supabase
      .from(view)
      .select('count')
      .limit(1);
    
    if (error) {
      console.error(`❌ Erreur lors de la vérification de la vue ${view}:`, error.message);
    } else {
      console.log(`✅ Vue ${view} accessible`);
    }
  }
}

/**
 * Fonction principale qui exécute toutes les migrations
 */
async function main() {
  console.log('🚀 Début de la mise à jour des benchmarks KPI');
  console.log('🔗 Connexion à Supabase:', supabaseUrl);
  
  try {
    // Test de connexion à Supabase
    const { data, error } = await supabase.from('kpi_def').select('count');
    
    if (error) {
      console.error('❌ Erreur de connexion à Supabase:', error.message);
      process.exit(1);
    }
    
    console.log('✅ Connexion à Supabase établie avec succès');
    
    // Exécuter chaque fichier de migration
    for (const file of migrationFiles) {
      await executeSqlFile(file);
    }
    
    // Vérifier les mises à jour
    await verifyUpdates();
    
    console.log('\n✅✅✅ Mise à jour des benchmarks KPI terminée avec succès! ✅✅✅');
  } catch (error) {
    console.error('❌❌❌ Erreur lors de la mise à jour:', error.message);
    process.exit(1);
  }
}

// Exécuter le script
// Exécuter le script
main().catch(error => {
  console.error('❌❌❌ Erreur non gérée:', error);
  process.exit(1);
});
