import { createClient } from '@supabase/supabase-js';
import type { KPI, KPIType } from '../types/airtable';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('[DIAGNOSTIC] VITE_SUPABASE_URL value check:', supabaseUrl ? 'exists (length=' + supabaseUrl.length + ')' : 'missing');
console.log('[DIAGNOSTIC] VITE_SUPABASE_ANON_KEY value check:', supabaseKey ? 'exists (length=' + supabaseKey.length + ')' : 'missing');

const supabase = createClient(supabaseUrl, supabaseKey);

// Test de connexion immédiate à Supabase
supabase.from('mvd_kpi').select('count').then(({ data, error }) => {
  if (error) {
    console.error('[DIAGNOSTIC] Supabase connection test failed:', error.message);
  } else {
    console.log('[DIAGNOSTIC] Supabase connection test succeeded, table exists');
    console.log('[DIAGNOSTIC] Tables in the database:', data);
  }
});

/**
 * Service pour gérer les opérations CRUD sur la table mvd_kpi dans Supabase
 * Remplace les appels précédents à Airtable
 */
export const supabaseKpiService = {
  /**
   * Récupère tous les KPIs pour un infopreneur donné
   * @param infopreneurId - ID de l'infopreneur
   * @returns Liste des KPIs formatés selon l'interface KPI
   */
  async getKPIs(infopreneurId?: number): Promise<KPI[]> {
    console.log('[getKPIs] Initiating KPI retrieval with infopreneurId:', infopreneurId);

    try {
      let query = supabase.from('vw_kpis').select('*');
      
      // Ajouter le filtre par infopreneurId seulement si fourni
      if (infopreneurId !== undefined) {
        query = query.eq('infopreneur_id', infopreneurId);
        console.log(`[getKPIs] Filtering by infopreneur_id: ${infopreneurId}`);
      } else {
        console.log('[getKPIs] No infopreneur filter applied');
      }
      
      // Tri par fonction et nom pour cohérence d'affichage
      const { data, error } = await query.order('Fonctions', { ascending: true });

      if (error) {
        console.error('[getKPIs] DB Error:', error);
        throw new Error(`Error fetching KPIs: ${error.message}`);
      }

      if (!data || data.length === 0) {
        console.log('[getKPIs] No KPIs found');
        return [];
      }

      console.log(`[getKPIs] Retrieved ${data.length} KPIs from view`);

      // Vérification des champs pour déboguer
      if (data.length > 0) {
        console.log('[DIAGNOSTIC] Premier KPI récupéré:', {
          id: data[0].ID_KPI,
          nom: data[0].Nom_KPI,
          type: data[0].Type || 'Type manquant',
          fonction: data[0].Fonctions,
          infopreneur_id: data[0].infopreneur_id
        });
      }
      
      // IMPORTANT: Déduplication supplémentaire par ID_KPI si nécessaire
      // bien que la vue devrait déjà être dédupliquée avec DISTINCT ON
      const uniqueKpis = data.filter((kpi, index, self) => 
        index === self.findIndex(k => k.ID_KPI === kpi.ID_KPI)
      );
      
      if (uniqueKpis.length < data.length) {
        console.log(`[getKPIs] Déduplication supplémentaire: ${data.length} -> ${uniqueKpis.length} KPIs`);
      }

      // Vérification spécifique des KPIs problématiques (CAC, CPL, EBITDA)
      const problemKpis = ['CAC', 'CPL', 'EBITDA'];
      problemKpis.forEach(kpiName => {
        const matches = uniqueKpis.filter(k => k.Nom_KPI.includes(kpiName));
        console.log(`[DIAGNOSTIC] ${kpiName} KPIs trouvés: ${matches.length}`);
        if (matches.length > 1) {
          console.log(`[ALERTE] Multiple ${kpiName} KPIs détectés:`, matches.map(k => ({
            id: k.ID_KPI,
            nom: k.Nom_KPI,
            fonction: k.Fonctions
          })));
        }
      });

      console.log(`[getKPIs] Processing completed, returning ${uniqueKpis.length} KPIs`);
      return uniqueKpis;
    } catch (error) {
      console.error('[getKPIs] Error processing KPIs:', error);
      throw error;
    }
  },

  /**
   * Crée un nouveau KPI pour un infopreneur donné
   * @param infopreneurId - ID de l'infopreneur
   * @param newKpi - Données du KPI à créer
   * @returns ID du KPI créé
   */
  async createKPI(infopreneurId: number, newKpi: Partial<KPI>): Promise<number> {
    const dbData = {
      infopreneur_id: infopreneurId,
      nom: newKpi.Nom_KPI,
      kpi_type: newKpi.Type,
      valeur_actuelle: newKpi.Valeur_Actuelle,
      valeur_precedente: newKpi.Valeur_Precedente,
      score_final: newKpi.Score_KPI_Final,
      statut: newKpi.Statut,
      fonction: newKpi.Fonctions,
      date_mise_a_jour: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('mvd_kpi')
      .insert(dbData)
      .select('id')
      .single();

    if (error) throw error;
    return data.id as number;
  },

  /**
   * Met à jour un KPI existant
   * @param kpiId - ID du KPI à mettre à jour
   * @param updatedKpi - Données mises à jour du KPI
   */
  async updateKPI(kpiId: number, updatedKpi: Partial<KPI>): Promise<void> {
    console.log('[DIAGNOSTIC] 🔄 Mise à jour du KPI', kpiId, 'avec valeurs:', updatedKpi);
    
    // 1. Vérifier d'abord si c'est un ID provenant de la vue ou un code KPI
    let kpiDefId = null;
    let kpiCode = null;
    
    try {
      // D'abord, essayons de trouver le KPI par code (plus fiable)
      console.log('[DIAGNOSTIC] 🔍 Recherche du KPI par code...');
      const kpiIdStr = kpiId.toString();
      
      // Si l'ID semble être un code KPI (non-numérique ou < 100)
      if (isNaN(kpiId) || kpiId < 100) {
        console.log('[DIAGNOSTIC] ⚠️ ID pourrait être un code KPI');
        
        // Recherche par code dans kpi_def
        const { data: kpiByCode, error: kpiCodeError } = await supabase
          .from('kpi_def')
          .select('id, code')
          .eq('code', kpiIdStr)
          .limit(1);
          
        if (!kpiCodeError && kpiByCode && kpiByCode.length > 0) {
          kpiDefId = kpiByCode[0].id;
          kpiCode = kpiByCode[0].code;
          console.log(`[DIAGNOSTIC] ✅ KPI trouvé par code: ${kpiCode}, ID: ${kpiDefId}`);
          // KPI trouvé, on peut sortir de la recherche
        } else {
          console.log('[DIAGNOSTIC] ❌ KPI non trouvé par code, essai par ID...');
        }
      }
      
      // Si on n'a pas trouvé par code, on essaie les autres méthodes
      if (!kpiDefId) {
        // Essai par ID dans vw_kpis
        const { data: kpiInfo, error: kpiError } = await supabase
          .from('vw_kpis')
          .select('ID_KPI, Nom_KPI')  // ID de la ligne dans kpi_value
          .eq('ID_KPI', kpiIdStr)
          .limit(1);
          
        if (!kpiError && kpiInfo && kpiInfo.length > 0) {
          console.log(`[DIAGNOSTIC] ✅ KPI trouvé dans vw_kpis: ${kpiInfo[0].Nom_KPI}`);
          
          // Récupérer le kpi_id correspondant à l'ID_KPI de la vue
          const { data: kpiVal, error: kpiValError } = await supabase
            .from('kpi_value')
            .select('kpi_id')
            .eq('id', parseInt(kpiInfo[0].ID_KPI))
            .limit(1);
            
          if (!kpiValError && kpiVal && kpiVal.length > 0) {
            kpiDefId = kpiVal[0].kpi_id;
            console.log(`[DIAGNOSTIC] ✅ ID du KPI dans kpi_def obtenu: ${kpiDefId}`);
          } else {
            console.log('[DIAGNOSTIC] ❌ Impossible de retrouver le kpi_id depuis kpi_value');
          }
        } else {
          console.log('[DIAGNOSTIC] ❌ KPI non trouvé dans vw_kpis, essai direct par id dans kpi_def...');
          
          // Dernier essai: recherche directe dans kpi_def par ID
          const { data: kpiDef, error: kpiDefError } = await supabase
            .from('kpi_def')
            .select('id, code')
            .eq('id', kpiId)
            .limit(1);
            
          if (!kpiDefError && kpiDef && kpiDef.length > 0) {
            kpiDefId = kpiDef[0].id;
            kpiCode = kpiDef[0].code;
            console.log(`[DIAGNOSTIC] ✅ KPI trouvé directement dans kpi_def: ${kpiCode}`);
          } else {
            console.log('[DIAGNOSTIC] ❌ KPI non trouvé nulle part');
          }
        }
      }
      
      // Si on n'a toujours pas trouvé le KPI
      if (!kpiDefId) {
        throw new Error(`KPI avec ID/code ${kpiId} introuvable après toutes les tentatives`);
      }
    } catch (error) {
      console.error('[DIAGNOSTIC] ❌ Erreur lors de la recherche du KPI:', error);
      throw error;
    }
    
    console.log('[DIAGNOSTIC] 🔍 ID final du KPI dans kpi_def:', kpiDefId);
    
    // 2. Récupérer l'ID de l'infopreneur (prendre le premier par défaut si non spécifié)
    console.log('[DIAGNOSTIC] 🔍 Récupération de l\'infopreneur...');
    const { data: infopreneur, error: infopreneurError } = await supabase
      .from('infopreneur')
      .select('id')
      .limit(1);
      
    if (infopreneurError || !infopreneur || infopreneur.length === 0) {
      console.error('[DIAGNOSTIC] ❌ Aucun infopreneur trouvé:', infopreneurError);
      throw new Error('Aucun infopreneur trouvé');
    }
    
    const infopreneurId = infopreneur[0].id;
    console.log('[DIAGNOSTIC] ✅ ID de l\'infopreneur pour la mise à jour:', infopreneurId);
    
    // 3. Insérer une nouvelle valeur dans kpi_value
    // Note: Le trigger SQL calculera automatiquement le score et le statut
    if (updatedKpi.Valeur_Actuelle !== undefined) {
      console.log('[DIAGNOSTIC] 🔄 Préparation de l\'insertion avec valeur:', updatedKpi.Valeur_Actuelle);
      
      try {
        // Vérifier si la valeur est différente de la valeur actuelle
        const { data: latestValue, error: latestError } = await supabase
          .from('kpi_value')
          .select('valeur')
          .eq('kpi_id', kpiDefId)
          .eq('infopreneur_id', infopreneurId)
          .order('date_created', { ascending: false })
          .limit(1);
          
        if (!latestError && latestValue && latestValue.length > 0) {
          if (latestValue[0].valeur === updatedKpi.Valeur_Actuelle) {
            console.log('[DIAGNOSTIC] ⚠️ La nouvelle valeur est identique à l\'ancienne, pas d\'insertion nécessaire');
            return;
          }
        }
        
        // Insérer la nouvelle valeur
        const { error } = await supabase
          .from('kpi_value')
          .insert({
            infopreneur_id: infopreneurId,
            kpi_id: kpiDefId,
            valeur: updatedKpi.Valeur_Actuelle,
            // Forcer la mise à jour du score via un trigger PL/pgSQL
            date_created: new Date().toISOString()
          });
          
        if (error) {
          console.error('[DIAGNOSTIC] ❌ Erreur lors de l\'insertion de la valeur KPI:', error);
          throw error;
        }
        
        console.log('[DIAGNOSTIC] ✅ Valeur KPI mise à jour avec succès');
        
        // Vérifier que le score a bien été calculé
        const { data: updatedValue, error: valueError } = await supabase
          .from('kpi_value')
          .select('id, valeur, score, date_created')
          .eq('kpi_id', kpiDefId)
          .eq('infopreneur_id', infopreneurId)
          .order('date_created', { ascending: false })
          .limit(1);
          
        if (!valueError && updatedValue && updatedValue.length > 0) {
          console.log('[DIAGNOSTIC] 📈 Nouveau score calculé:', updatedValue[0].score);
        }
      } catch (insertError) {
        console.error('[DIAGNOSTIC] ❌ Erreur lors de la gestion de la mise à jour:', insertError);
        throw insertError;
      }
    } else {
      console.log('[DIAGNOSTIC] ⚠️ Aucune valeur à mettre à jour');
    }
  },

  /**
   * Supprime un KPI existant
   * @param kpiId - ID du KPI à supprimer
   */
  async deleteKPI(kpiId: number): Promise<void> {
    const { error } = await supabase
      .from('mvd_kpi')
      .delete()
      .eq('id', kpiId);

    if (error) throw error;
  },

  /**
   * Récupère l'historique des valeurs d'un KPI sur une période donnée
   * Note: Cette fonction nécessite une table d'historique (mvd_kpi_history)
   * @param kpiId - ID du KPI
   * @param period - Période (semaine, mois, trimestre, année)
   */
  async getKPIHistory(kpiId: number, period: 'week' | 'month' | 'quarter' | 'year') {
    // Calcul de la date de début en fonction de la période
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'quarter':
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    // Format de la date pour PostgreSQL
    const formattedStartDate = startDate.toISOString();

    // Cette requête suppose l'existence d'une table mvd_kpi_history
    // Si cette table n'existe pas encore, il faudra la créer
    const { data, error } = await supabase
      .from('mvd_kpi_history')
      .select('*')
      .eq('kpi_id', kpiId)
      .gte('date_enregistrement', formattedStartDate)
      .order('date_enregistrement', { ascending: true });

    if (error) throw error;
    return data || [];
  }
};

/**
 * Récupère les KPIs avec leurs fonctions en utilisant des requêtes directes Supabase
 * À utiliser pour débugger les problèmes d'affichage des KPIs individuels
 * @param infopreneurId - ID de l'infopreneur
 * @returns Liste des KPIs formatés selon l'interface KPI
 */
export async function getDetailedKPIs(infopreneurId?: number): Promise<KPI[]> {
  console.log('[DIAGNOSTIC] Récupération directe des KPIs avec fonctions');
  
  try {
    // Requête directe sur la table kpi_value jointe avec kpi_def au lieu de la vue
    const { data: kpiData, error: kpiError } = await supabase
      .from('kpi_value')
      .select(`
        id,
        valeur,
        valeur_precedente,
        score,
        statut,
        infopreneur_id,
        kpi_def:kpi_id (
          id,
          label,
          type,
          fonction
        )
      `)
      // Ajouter la condition sur l'infopreneur si spécifiée
      .eq(infopreneurId ? 'infopreneur_id' : '', infopreneurId || '')
      .order('kpi_id');
      
    if (kpiError) {
      console.error('[DIAGNOSTIC] Erreur récupération KPIs:', kpiError);
      throw kpiError;
    }
    
    if (!kpiData || !Array.isArray(kpiData) || kpiData.length === 0) {
      console.log('[DIAGNOSTIC] Aucun KPI trouvé');
      return [];
    }
    
    console.log('[DIAGNOSTIC] Données brutes KPIs:', kpiData.slice(0, 2));
    
    // Mapper aux KPIs attendus par le frontend
    const kpis: KPI[] = kpiData.map(item => {
      // Corriger le typage pour éviter les erreurs TypeScript
      // kpi_def pourrait être un objet ou un tableau, nous devons le traiter correctement
      const kpiDefRaw = item.kpi_def;
      // Créer un objet avec les valeurs par défaut
      const kpiDef = {
        id: '',
        label: 'Inconnu',
        type: 'Principal' as KPIType,
        fonction: ''
      };
      
      // Si kpiDefRaw est un objet, extraire ses valeurs
      if (kpiDefRaw && typeof kpiDefRaw === 'object') {
        // Si c'est un tableau avec un élément, prendre le premier élément
        if (Array.isArray(kpiDefRaw) && kpiDefRaw.length > 0) {
          kpiDef.id = kpiDefRaw[0]?.id || '';
          kpiDef.label = kpiDefRaw[0]?.label || 'Inconnu';
          kpiDef.type = (kpiDefRaw[0]?.type as KPIType) || 'Principal';
          kpiDef.fonction = kpiDefRaw[0]?.fonction || '';
        } else {
          // Si c'est un objet, utiliser directement ses propriétés
          kpiDef.id = (kpiDefRaw as any)?.id || '';
          kpiDef.label = (kpiDefRaw as any)?.label || 'Inconnu';
          kpiDef.type = ((kpiDefRaw as any)?.type as KPIType) || 'Principal';
          kpiDef.fonction = (kpiDefRaw as any)?.fonction || '';
        }
      }
      
      return {
        ID_KPI: String(item.id),
        Nom_KPI: kpiDef.label,
        Type: kpiDef.type,
        Valeur_Actuelle: item.valeur,
        Valeur_Precedente: item.valeur_precedente,
        Score_KPI_Final: item.score,
        Statut: item.statut,
        Fonctions: kpiDef.fonction
      };
    });
    
    console.log(`[DIAGNOSTIC] KPIs récupérés: ${kpis.length}`);
    if (kpis.length > 0) {
      console.log('[DIAGNOSTIC] Échantillon KPI formaté:', kpis[0]);
    }
    
    return kpis;
  } catch (err) {
    console.error('[DIAGNOSTIC] Erreur lors de la récupération des KPIs:', err);
    throw err;
  }
}
