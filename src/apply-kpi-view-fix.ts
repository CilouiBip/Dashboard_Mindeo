import { createClient } from '@supabase/supabase-js';

// Configuration de la connexion Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Variables d\'environnement Supabase manquantes. Veuillez configurer VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyKpiViewFix() {
  console.log('Correction de la vue vw_kpis...');
  try {
    // Création ou remplacement de la vue vw_kpis avec la correction pour le champ Type
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE OR REPLACE VIEW public.vw_kpis AS
        SELECT DISTINCT ON (kv.kpi_id) 
          kv.id AS ID_KPI,
          kd.nom AS Nom_KPI,
          kd.description AS Description,
          kd.fonction AS Fonctions,
          kv.valeur AS Valeur_Actuelle,
          lag(kv.valeur) OVER (PARTITION BY kv.kpi_id ORDER BY kv.date_creation) AS Valeur_Precedente,
          kv.score AS Score_KPI_Final,
          kv.statut AS Statut,
          kd.unite AS Unite,
          kd.code AS Code_KPI,
          kd.type AS Type,  -- Renommé de Type_KPI à Type pour correspondre aux attentes du frontend
          kd.min_value,
          kd.max_value
        FROM 
          public.kpi_value kv
        JOIN 
          public.kpi_def kd ON kv.kpi_id = kd.id
        WHERE 
          kv.is_latest = true
        ORDER BY 
          kv.kpi_id, kv.date_creation DESC, kd.fonction, kd.nom;
      `
    });

    if (error) {
      console.error('Erreur lors de la création de la vue:', error);
      process.exit(1);
    }

    console.log('Vue vw_kpis corrigée avec succès!');

    // Vérification de la vue avec un SELECT
    const { data: testData, error: testError } = await supabase
      .from('vw_kpis')
      .select('*')
      .limit(10);

    if (testError) {
      console.error('Erreur lors du test de la vue:', testError);
      process.exit(1);
    }

    console.log('Test de la vue réussi. Exemples de données:');
    if (testData && testData.length > 0) {
      console.log('Champs disponibles:', Object.keys(testData[0]));
      console.log('Premier KPI:', testData[0]);

      // Vérification spécifique des KPIs problématiques
      const cacKpis = testData.filter(k => k.Nom_KPI.includes('CAC'));
      const cplKpis = testData.filter(k => k.Nom_KPI.includes('CPL'));
      const ebitdaKpis = testData.filter(k => k.Nom_KPI.includes('EBITDA'));

      console.log('\nCAC KPIs:', cacKpis.length);
      cacKpis.forEach(k => console.log(' -', k.ID_KPI, k.Nom_KPI, 'Type:', k.Type));

      console.log('\nCPL KPIs:', cplKpis.length);
      cplKpis.forEach(k => console.log(' -', k.ID_KPI, k.Nom_KPI, 'Type:', k.Type));

      console.log('\nEBITDA KPIs:', ebitdaKpis.length);
      ebitdaKpis.forEach(k => console.log(' -', k.ID_KPI, k.Nom_KPI, 'Type:', k.Type));
    } else {
      console.log('Aucune donnée trouvée dans la vue');
    }

    // Vérification des doublons
    if (testData) {
      const distinctIds = new Set(testData.map(kpi => kpi.ID_KPI));
      console.log(`\nNombre total de KPIs: ${testData.length}`);
      console.log(`Nombre de KPIs distincts: ${distinctIds.size}`);
      
      if (testData.length === distinctIds.size) {
        console.log('✅ Aucun doublon détecté!');
      } else {
        console.log('⚠️ Des doublons ont été détectés. Vérifiez la clause DISTINCT de la vue.');
      }
    }

  } catch (err) {
    console.error('Erreur inattendue:', err);
    process.exit(1);
  }
}

applyKpiViewFix();
