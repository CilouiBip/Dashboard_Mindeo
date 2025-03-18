import { createClient } from '@supabase/supabase-js';

// Utilise les mu00eames variables d'environnement que l'application
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialise le client Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Insu00e8re des valeurs test pour quelques KPIs
 */
async function insererDonneesTest() {
  console.log('Du00e9but de l\'insertion des donnu00e9es de test...');
  
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
    
    // 2. Ru00e9cupu00e9rer les IDs des KPIs par code
    const codesKPI = ['cac', 'cpl', 'close_rate', 'ca_mensuel', 'nps'];
    const kpiMap = new Map();
    
    for (const code of codesKPI) {
      const { data: kpi, error: kpiError } = await supabase
        .from('kpi_def')
        .select('id')
        .eq('code', code)
        .limit(1);
        
      if (kpiError || !kpi || kpi.length === 0) {
        console.error(`Erreur lors de la ru00e9cupu00e9ration du KPI '${code}':`, kpiError);
        continue;
      }
      
      kpiMap.set(code, kpi[0].id);
      console.log(`KPI ${code}: ID=${kpi[0].id}`);
    }
    
    // 3. Insu00e9rer les valeurs test pour chaque KPI
    const valeursTest = [
      { code: 'cac', valeur: 180 },       // CAC u00e0 180u20ac
      { code: 'cpl', valeur: 25 },        // CPL u00e0 25u20ac
      { code: 'close_rate', valeur: 32 },  // Close Rate u00e0 32%
      { code: 'ca_mensuel', valeur: 65000 }, // CA Mensuel u00e0 65000u20ac
      { code: 'nps', valeur: 8.5 }       // NPS u00e0 8.5/10
    ];
    
    for (const { code, valeur } of valeursTest) {
      const kpiId = kpiMap.get(code);
      if (!kpiId) {
        console.error(`KPI '${code}' non trouvu00e9 dans la table kpi_def`);
        continue;
      }
      
      const { data, error } = await supabase
        .from('kpi_value')
        .insert({
          infopreneur_id: infopreneurId,
          kpi_id: kpiId,
          valeur: valeur
        });
        
      if (error) {
        console.error(`Erreur lors de l'insertion de la valeur pour '${code}':`, error);
      } else {
        console.log(`Valeur insu00e9ru00e9e avec succu00e8s pour ${code}: ${valeur}`);
      }
    }
    
    console.log('Insertion des donnu00e9es de test terminu00e9e!');
    console.log('Vous pouvez maintenant redu00e9marrer l\'application pour voir les KPIs.');
    
  } catch (error) {
    console.error('Erreur gu00e9nu00e9rale:', error);
  }
}

insererDonneesTest();
