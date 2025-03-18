# Rapport technique - Dashboard Mindeo

## Date : 18 mars 2025

## Table des matiu00e8res
1. [Pru00e9sentation du projet](#pru00e9sentation-du-projet)
2. [Architecture technique](#architecture-technique)
3. [Migration Airtable vers Supabase](#migration-airtable-vers-supabase)
4. [Structure des donnu00e9es Supabase](#structure-des-donnu00e9es-supabase)
5. [Calculs des scores KPI](#calculs-des-scores-kpi)
6. [Harmonisation des calculs](#harmonisation-des-calculs)
7. [Composants principaux](#composants-principaux)
8. [Hooks personnalisu00e9s](#hooks-personnalisu00e9s)
9. [Problu00e8mes ru00e9solus](#problu00e8mes-ru00e9solus)
10. [Recommandations futures](#recommandations-futures)

## Pru00e9sentation du projet

Le Dashboard Mindeo est une application web conu00e7ue pour visualiser et gu00e9rer les KPIs (Key Performance Indicators) d'une organisation. L'application permet de suivre les performances par fonction (comme PRODUIT, FINANCE, SALES) et fournit une vue globale des scores. 

Originellement basu00e9e sur Airtable comme source de donnu00e9es, l'application est en cours de migration vers Supabase pour amu00e9liorer les performances, la flexibilitu00e9 et ru00e9duire les cou00fbts d'opu00e9ration.

## Architecture technique

### Stack technologique
- **Frontend** : React avec TypeScript
- **Styling** : Tailwind CSS
- **Navigation** : React Router
- **Gestion des requu00eates** : React Query (TanStack Query)
- **Base de donnu00e9es** : Supabase (PostgreSQL)
- **Authentification** : Supabase Auth
- **Environnement de du00e9veloppement** : Vite

### Structure du projet

```
Dashboard_Mindeo-dev/
u251cu2500u2500 public/              # Ressources statiques
u251cu2500u2500 src/                 # Code source principal
u2502   u251cu2500u2500 api/            # Services d'API (Airtable et Supabase)
u2502   u251cu2500u2500 components/     # Composants ru00e9utilisables
u2502   u251cu2500u2500 hooks/          # Hooks personnalisu00e9s pour la logique
u2502   u251cu2500u2500 pages/          # Composants niveau page
u2502   u251cu2500u2500 repositories/    # Couche d'abstraction pour l'accu00e8s aux donnu00e9es
u2502   u251cu2500u2500 services/       # Services mu00e9tier
u2502   u251cu2500u2500 types/          # Interfaces et types TypeScript
u2502   u251cu2500u2500 utils/          # Fonctions utilitaires
u251cu2500u2500 .env                # Variables d'environnement
u251cu2500u2500 vite.config.ts      # Configuration de Vite
u251cu2500u2500 tsconfig.json       # Configuration TypeScript
```

## Migration Airtable vers Supabase

Le projet est actuellement en phase de migration d'Airtable vers Supabase. Cette migration est structuru00e9e comme suit :

### Phase actuelle

La migration est en cours avec une architecture permettant u00e0 l'application de fonctionner avec les deux systu00e8mes en parallu00e8le. La couche de ru00e9fu00e9rence est maintenant Supabase.

### Pattern Repository

L'application utilise le pattern Repository pour abstraire l'accu00e8s aux donnu00e9es. La classe principale `KPIRepository` sert d'interface :

```typescript
// Interface gu00e9nu00e9rique pour les repos KPI
export interface KPIRepository {
  fetchKPIs(): Promise<KPI[]>;
  fetchGlobalScore(): Promise<GlobalScore>;
  fetchFunctionScores(): Promise<FunctionScore[]>;
  updateKPIValue(params: UpdateKPIParams): Promise<KPI>;
}
```

Deux implu00e9mentations sont disponibles :
- `AirtableKPIRepository` : Accu00e8s aux donnu00e9es via Airtable
- `SupabaseKPIRepository` : Accu00e8s aux donnu00e9es via Supabase

La factory `getKPIRepository()` du00e9termine quelle implu00e9mentation utiliser en fonction de la configuration.

## Structure des donnu00e9es Supabase

### Tables principales

#### Table `kpis`
Table principale contenant tous les KPIs avec les champs suivants :

- `ID_KPI` : Identifiant unique du KPI (UUID)
- `Nom_KPI` : Nom du KPI
- `Description` : Description du00e9taillu00e9e du KPI
- `Fonctions` : Fonctions associu00e9es au KPI (format CSV)
- `Valeur_Actuelle` : Valeur numu00e9rique actuelle du KPI
- `Valeur_Precedente` : Valeur numu00e9rique pru00e9cu00e9dente du KPI
- `Score_KPI_Final` : Score calculu00e9 du KPI (0-10)
- `Type_KPI` : Type du KPI (Principal/Secondaire)
- `Formule` : Formule de calcul si applicable
- `Date_Creation` : Date de cru00e9ation du KPI
- `Date_Modification` : Date de derniu00e8re modification

### Vues Supabase

#### Vue `vw_kpis`
Vue principale utilisu00e9e pour ru00e9cupu00e9rer les KPIs avec les donnu00e9es nu00e9cessaires au calcul des scores.

```sql
CREATE OR REPLACE VIEW vw_kpis AS
SELECT 
  k.ID_KPI,
  k.Nom_KPI,
  k.Description,
  k.Fonctions,
  k.Valeur_Actuelle,
  k.Valeur_Precedente,
  k.Score_KPI_Final,
  k.Type_KPI,
  k.Formule
FROM kpis k
WHERE k.active = true
ORDER BY k.created_at DESC;
```

## Calculs des scores KPI

### Calcul du score individuel des KPIs

Chaque KPI a un score individuel calculu00e9 selon cette formule :

```typescript
export const calculateScore = (current: number, target: number, isInverse: boolean = false): number => {
  if (target === 0) return 5; // Default middle score if no target
  
  let ratio: number;
  if (isInverse) {
    // For inverse metrics (lower is better)
    ratio = target / (current || 1); // Avoid division by zero
  } else {
    // For regular metrics (higher is better)
    ratio = current / target;
  }
  
  // Cap between 0 and 2 (0-200%)
  ratio = Math.max(0, Math.min(ratio, 2));
  
  // Convert to 0-10 scale
  return ratio * 5;
};
```

Ou si aucune valeur pru00e9cu00e9dente n'est disponible, le score est calculu00e9 comme suit :

```typescript
if (kpi.Valeur_Precedente > 0) {
  const changeRatio = kpi.Valeur_Actuelle / kpi.Valeur_Precedente;
  // Basic scoring: 1.0 = no change (score 5), 1.1 = 10% improvement (score ~6-7), 0.9 = 10% decline (score ~3-4)
  kpi.Score_KPI_Final = Math.min(10, Math.max(0, 5 * changeRatio));
} else if (kpi.Score_KPI_Final === 0) {
  // Initialize score if not already set and no previous value for comparison
  kpi.Score_KPI_Final = 5; // Neutral score
}
```

### Calcul des scores par fonction

Les scores par fonction sont calculu00e9s dans le fichier `SupabaseKPIRepository.ts`, mu00e9thode `fetchFunctionScores()` :

1. Ru00e9cupu00e9ration de tous les KPIs via le service Supabase
2. Regroupement des KPIs par fonction
3. Pour chaque fonction :
   - Calcul de la moyenne des scores des KPIs associu00e9s u00e0 cette fonction
   - Comptage du nombre total de KPIs et du nombre de KPIs en alerte (score < 4)

```typescript
// Calculer la moyenne des scores pour chaque fonction
Object.keys(functionGroups).forEach(func => {
  const funcKpis = functionGroups[func];
  let totalScore = 0;
  let validScoreCount = 0;
  let alertCount = 0;
  
  funcKpis.forEach(kpi => {
    if (typeof kpi.Score_KPI_Final === 'number' && !isNaN(kpi.Score_KPI_Final)) {
      totalScore += kpi.Score_KPI_Final;
      validScoreCount++;
      
      // Compter les KPIs en alerte (score < 4)
      if (kpi.Score_KPI_Final < 4) {
        alertCount++;
      }
    }
  });
  
  // Calculer la moyenne pour cette fonction
  const avgScore = validScoreCount > 0 ? totalScore / validScoreCount : 0;
  
  functionScores.push({
    Name: func,
    Score_Final_Fonction: Number(avgScore.toFixed(1)),
    Nbr_KPIs: validScoreCount,
    Nbr_KPIs_Alert: alertCount
  });
});
```

### Calcul du score global

Le score global est calculu00e9 dans la mu00e9thode `fetchGlobalScore()` du `SupabaseKPIRepository` :

1. Ru00e9cupu00e9ration de tous les KPIs via le service Supabase
2. Calcul de la moyenne de tous les scores des KPIs
3. Comptage du nombre total de KPIs et du nombre de KPIs en alerte (score < 4)

```typescript
async fetchGlobalScore(): Promise<GlobalScore> {
  try {
    console.log('[SupabaseKPIRepository] Calculating global score from KPIs...');
    
    // 1. Ru00e9cupu00e9rer tous les KPIs via le service existant
    const kpis = await supabaseKpiService.getKPIs();
    console.log(`[SupabaseKPIRepository] Retrieved ${kpis.length} KPIs for global score calculation`);
    
    if (!kpis || kpis.length === 0) {
      console.warn('[SupabaseKPIRepository] No KPIs found to calculate global score');
      return {
        Score_Final_Global: 0,
        Nbr_KPIs_Total: 0,
        Nbr_KPIs_Alert: 0
      };
    }
    
    // 2. Calculer la moyenne des scores de tous les KPIs
    let totalScore = 0;
    let validScoreCount = 0;
    let alertCount = 0;
    
    kpis.forEach(kpi => {
      if (typeof kpi.Score_KPI_Final === 'number' && !isNaN(kpi.Score_KPI_Final)) {
        totalScore += kpi.Score_KPI_Final;
        validScoreCount++;
        
        // Compter les KPIs en alerte (score infu00e9rieur u00e0 4)
        if (kpi.Score_KPI_Final < 4) {
          alertCount++;
        }
      }
    });
    
    const globalScore = validScoreCount > 0 ? totalScore / validScoreCount : 0;
    
    // 3. Construire l'objet de ru00e9ponse au format attendu
    const result: GlobalScore = {
      Score_Final_Global: Number(globalScore.toFixed(1)), // Arrondir u00e0 1 du00e9cimale
      Nbr_KPIs_Total: validScoreCount,
      Nbr_KPIs_Alert: alertCount
    };
    
    console.log(`[SupabaseKPIRepository] Calculated global score: ${result.Score_Final_Global}`);
    return result;
  } catch (error) {
    console.error('[SupabaseKPIRepository] Error calculating global score:', error);
    throw error;
  }
}
```

## Harmonisation des calculs

Un travail ru00e9cent a u00e9tu00e9 effectuu00e9 pour harmoniser les calculs entre les diffu00e9rentes sections de l'application :

### Problu00e8me identifiu00e9

Il y avait une divergence dans le calcul des scores par fonction entre :
- L'onglet KPI (`KPIsMVD.tsx`) qui utilisait le score du premier KPI rencontru00e9 pour chaque fonction
- Le Dashboard qui calculait correctement la moyenne des scores des KPIs pour chaque fonction

### Solution implu00e9mentu00e9e

1. Modification de `KPIsMVD.tsx` pour utiliser le mu00eame calcul de moyenne que le Dashboard :

```typescript
// Calculer la moyenne des scores pour chaque fonction
const functionScoresMap: Record<string, number> = {};
Object.keys(functionGroups).forEach(func => {
  const funcKpis = functionGroups[func];
  let totalScore = 0;
  let validCount = 0;
  
  funcKpis.forEach(kpi => {
    if (typeof kpi.Score_KPI_Final === 'number' && !isNaN(kpi.Score_KPI_Final)) {
      totalScore += kpi.Score_KPI_Final;
      validCount++;
    }
  });
  
  // Calculer la moyenne pour cette fonction
  const avgScore = validCount > 0 ? totalScore / validCount : 0;
  functionScoresMap[func] = Number(avgScore.toFixed(1)); // Arrondir u00e0 1 du00e9cimale
});
```

2. Ajout de logs de diagnostic pour valider les calculs et faciliter le du00e9bogage

Ces modifications garantissent maintenant une cohu00e9rence dans les scores affichu00e9s u00e0 travers l'application.

## Composants principaux

### Pages

#### `Dashboard.tsx`
Page principale affichant les scores globaux et par fonction dans un format visuel avec des graphiques.

#### `KPIsMVD.tsx`
Affiche les KPIs groupu00e9s par fonction, permettant de voir les du00e9tails de chaque KPI et de modifier leurs valeurs.

### Hooks personnalisu00e9s

#### `useKPIData.ts`
Principal hook pour ru00e9cupu00e9rer les donnu00e9es KPI via le repository appropriu00e9.

```typescript
export const useKPIData = (options: KPIQueryOptions = {}) => {
  const { isDebugMode } = useDebugMode();
  const {
    enabled = true,
    staleTime = 30 * 1000,
    refetchInterval = 30 * 1000,
    refetchOnWindowFocus = true,
  } = options;

  const kpiRepository = getKPIRepository();

  return useQuery<KPI[], Error>({
    queryKey: ['kpis'],
    queryFn: () => kpiRepository.fetchKPIs(),
    select: (data) => {
      const scores = calculateFunctionScores(data);
      return scores;
    },
    enabled,
    staleTime,
    refetchInterval,
    refetchOnWindowFocus,
  });
};
```

#### `useSupabaseGlobalScore.ts`
Hook pour ru00e9cupu00e9rer le score global depuis Supabase.

#### `useSupabaseFunctionScores.ts`
Hook pour ru00e9cupu00e9rer les scores par fonction depuis Supabase.

## Services

### `supabaseKpi.ts`
Sert d'interface directe avec Supabase pour ru00e9cupu00e9rer et manipuler les donnu00e9es KPI.

```typescript
export const supabaseKpiService = {
  /**
   * Vu00e9rifie la connexion u00e0 Supabase
   */
  testConnection: async () => {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    
    const { data, error } = await supabase.from('kpis').select('count()').limit(1);
    
    if (error) {
      console.error('Error testing Supabase connection:', error);
      throw error;
    }
    
    return { success: true, message: 'Successfully connected to Supabase' };
  },
  
  /**
   * Ru00e9cupu00e8re tous les KPIs via la vue vw_kpis
   */
  getKPIs: async (): Promise<KPI[]> => {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return [];
    }
    
    const { data, error } = await supabase.from('vw_kpis').select('*');
    
    if (error) {
      console.error('Error fetching KPIs from Supabase:', error);
      return [];
    }
    
    return data || [];
  },
  
  /**
   * Met u00e0 jour la valeur d'un KPI
   */
  updateKPIValue: async (params: UpdateKPIParams): Promise<KPI | null> => {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return null;
    }
    
    const { ID_KPI, Valeur_Actuelle } = params;
    
    // Ru00e9cupu00e9rer la valeur actuelle pour la stocker comme valeur pru00e9cu00e9dente
    const { data: currentKPI, error: fetchError } = await supabase
      .from('kpis')
      .select('*')
      .eq('ID_KPI', ID_KPI)
      .single();
    
    if (fetchError) {
      console.error('Error fetching current KPI value:', fetchError);
      return null;
    }
    
    // Mettre u00e0 jour avec la nouvelle valeur
    const { data, error } = await supabase
      .from('kpis')
      .update({ 
        Valeur_Actuelle, 
        Valeur_Precedente: currentKPI.Valeur_Actuelle,
        Date_Modification: new Date().toISOString()
      })
      .eq('ID_KPI', ID_KPI)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating KPI value:', error);
      return null;
    }
    
    return data;
  }
};
```

## Recommandations futures

### Court terme
1. Nettoyer les logs de diagnostic une fois la cohu00e9rence des calculs vu00e9rifiu00e9e
2. Ajouter des tests unitaires pour les fonctions de calcul
3. Documenter les formules de calcul dans un fichier su00e9paru00e9

### Moyen terme
1. Finaliser la migration complu00e8te vers Supabase
2. Implu00e9menter des vues materialized dans Supabase pour optimiser les requu00eates fru00e9quentes
3. Ajouter un systu00e8me de cache pour ru00e9duire les appels API

### Long terme
1. Implu00e9menter un systu00e8me d'historisation des scores pour suivre l'u00e9volution au fil du temps
2. Du00e9velopper des fonctionnalitu00e9s d'alerte automatique
3. Ajouter des visualisations avancu00e9es pour l'analyse des tendances

---

Ce rapport a u00e9tu00e9 gu00e9nu00e9ru00e9 le 18 mars 2025 pour documenter l'u00e9tat actuel du projet Dashboard Mindeo, avec un focus particulier sur l'intu00e9gration de Supabase et les calculs des scores KPI.
