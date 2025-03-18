import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyKPIFix() {
  console.log('=====================================');
  console.log('🔍 VÉRIFICATION DES CORRECTIONS KPI');
  console.log('=====================================\n');

  try {
    // 1. Vérifier que la vue vw_kpis contient bien le champ Type et infopreneur_id
    console.log('Étape 1: Vérification de la structure de la vue vw_kpis...');
    const { data: kpiSample, error: kpiError } = await supabase
      .from('vw_kpis')
      .select('*')
      .limit(1);

    if (kpiError) {
      throw new Error(`Erreur d'accès à la vue vw_kpis: ${kpiError.message}`);
    }

    if (!kpiSample || kpiSample.length === 0) {
      console.log('❌ Aucun KPI trouvé dans la vue');
    } else {
      const sampleKpi = kpiSample[0];
      const fields = Object.keys(sampleKpi);
      
      console.log(`Champs disponibles dans la vue (${fields.length}):`, fields.join(', '));
      console.log(`Type présent: ${fields.includes('Type') ? '✅' : '❌'}`);
      console.log(`infopreneur_id présent: ${fields.includes('infopreneur_id') ? '✅' : '❌'}`);
      
      if (fields.includes('Type') && fields.includes('infopreneur_id')) {
        console.log('✅ La vue contient tous les champs nécessaires!');
      } else {
        console.log('❌ Il manque des champs critiques dans la vue');
      }
    }

    // 2. Vérifier les KPIs problématiques (CAC, CPL, EBITDA)
    console.log('\nÉtape 2: Vérification des KPIs problématiques...');
    const { data: allKpis, error: allKpisError } = await supabase
      .from('vw_kpis')
      .select('*');

    if (allKpisError) {
      throw new Error(`Erreur lors de la récupération des KPIs: ${allKpisError.message}`);
    }

    if (!allKpis || allKpis.length === 0) {
      console.log('❌ Aucun KPI trouvé');
    } else {
      console.log(`Total KPIs trouvés: ${allKpis.length}`);
      
      // Vérifier l'unicité par ID_KPI
      const uniqueIds = new Set(allKpis.map(k => k.ID_KPI));
      console.log(`Nombre d'IDs uniques: ${uniqueIds.size}`);
      
      if (uniqueIds.size === allKpis.length) {
        console.log('✅ Pas de doublons par ID_KPI dans la vue');
      } else {
        console.log(`❌ Doublons détectés: ${allKpis.length - uniqueIds.size} KPIs dupliqués`);
        
        // Identifier les doublons
        const idCounts: Record<string, number> = {};
        allKpis.forEach(kpi => {
          idCounts[kpi.ID_KPI] = (idCounts[kpi.ID_KPI] || 0) + 1;
        });
        
        const duplicateIds = Object.entries(idCounts)
          .filter(([_, count]) => count > 1)
          .map(([id, _]) => id);
          
        duplicateIds.forEach(id => {
          const dupes = allKpis.filter(k => k.ID_KPI === id);
          console.log(`  KPI dupliqué ID ${id}: ${dupes[0].Nom_KPI}, ${dupes.length} occurrences`);
        });
      }
      
      // Vérifier les KPIs spécifiques
      ['CAC', 'CPL', 'EBITDA'].forEach(kpiName => {
        const matches = allKpis.filter(k => k.Nom_KPI.includes(kpiName));
        console.log(`\nVérification des KPIs ${kpiName}: ${matches.length} trouvés`);
        
        if (matches.length === 0) {
          console.log(`❌ Aucun KPI ${kpiName} trouvé`);
        } else if (matches.length === 1) {
          console.log(`✅ Un seul KPI ${kpiName} trouvé:`);
          console.log(`  - ID: ${matches[0].ID_KPI}`);
          console.log(`  - Nom: ${matches[0].Nom_KPI}`);
          console.log(`  - Type: ${matches[0].Type || 'Non défini'}`);
          console.log(`  - Fonction: ${matches[0].Fonctions || 'Non définie'}`);
          console.log(`  - Score: ${matches[0].Score_KPI_Final}`);
        } else {
          console.log(`❌ Multiple KPIs ${kpiName} trouvés:`);
          matches.forEach((kpi, i) => {
            console.log(`  ${i+1}. ID: ${kpi.ID_KPI}, Nom: ${kpi.Nom_KPI}, Fonction: ${kpi.Fonctions}, Type: ${kpi.Type}`);
          });
        }
      });
    }

    // 3. Vérifier le regroupement par fonction
    console.log('\nÉtape 3: Vérification du regroupement par fonction...');
    if (allKpis && allKpis.length > 0) {
      const functionGroups: Record<string, number> = {};
      
      allKpis.forEach(kpi => {
        if (kpi.Fonctions) {
          const functions = kpi.Fonctions.split(',').map((f: string) => f.trim());
          functions.forEach((func: string) => {
            if (func) {
              functionGroups[func] = (functionGroups[func] || 0) + 1;
            }
          });
        }
      });
      
      console.log('Répartition des KPIs par fonction:');
      Object.entries(functionGroups).forEach(([func, count]) => {
        console.log(`  - ${func}: ${count} KPIs`);
      });
    }

    console.log('\n=====================================');
    console.log('🏁 VÉRIFICATION TERMINÉE');
    console.log('=====================================');
  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
  }
}

verifyKPIFix();
