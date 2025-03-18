# Changelog - Dashboard Mindeo

## [Non publié] - 2025-03-18

### Ajouté
- Nouveaux benchmarks pour tous les KPIs basés sur le marché francophone de l'infopreneuriat
- Logique spécifique pour l'EBITDA (statut inversé: >40% rouge, 40-60% orange, >60% vert)
- Migration SQL pour mettre à jour les KPIs et leurs seuils (fichier `04_update_kpi_benchmarks.sql`)
- Mise à jour des vues SQL pour refléter les nouveaux benchmarks (fichier `05_update_kpi_views.sql`)

### Modifié
- Mise à jour des seuils min/max pour tous les KPIs dans la table `kpi_def`
- Amélioration du calcul des scores avec gestion spécifique pour les KPIs inversés
- Optimisation des vues SQL pour garantir la cohérence des données

### Corrections
- Intégration Supabase : Harmonisation des calculs de scores entre l'onglet KPI et le Dashboard
  - Correction de la méthode `fetchFunctionScores()` dans `SupabaseKPIRepository.ts` pour calculer correctement les moyennes
  - Mise à jour de l'onglet KPI (fichier `KPIsMVD.tsx`) pour utiliser une méthode de calcul basée sur la moyenne
  - Amélioration de la cohérence des scores affichés entre les différentes parties de l'application
  - Ajout de logs de diagnostic pour faciliter la validation et le débogage

- Refonte complète du système de calcul des KPIs (18 mars 2025)
  - Normalisation directe des scores sur échelle 0-10 (au lieu de 0-100 divisé par 10)
  - Implémentation correcte de la logique d'inversion pour CAC, CPL, pipeline_velocity, taux_remboursement
  - Gestion spéciale du statut EBITDA basé sur la valeur brute (>60% = OK, 40-60% = Warning, <40% = Alerte)
  - Nettoyage des triggers et unification en un seul trigger principal
  - Mise à jour complète des benchmarks pour tous les KPIs
- Gestion améliorée des KPIs avec logique inversée (plus petit = meilleur)

## [Non publié] - 2025-03-17

### Ajouts
- OVERVIEW.md : Vue d'ensemble du projet et de son architecture actuelle
- ROADMAP.md : Plan de développement technique avec phases et priorités
- CHANGELOG.md : Journal des modifications et des évolutions

### Analyse technique
- Identification de la structure des données Airtable et des relations
- Cartographie des flux d'intégration API
- Évaluation des performances et identification des points d'amélioration
- Analyse des dépendances et de la dette technique

### Planification
- Définition de 4 phases pour la migration et l'amélioration
- Priorisation des micro-blocs de développement
- Établissement d'un plan de migration Airtable vers Supabase
- Identification des risques et des stratégies de mitigation

## Phases planifiées

### Phase 1 - Stabilisation & Préparation (1-2 mois)
- Audit technique complet des tables Airtable
- Refactoring de la couche API pour abstraction complète
- Tests unitaires et d'intégration des composants critiques
- Correction des bugs identifiés et optimisations de performance

### Phase 2 - Migration initiale vers Supabase (1-2 mois)
- Conception du schéma de données Supabase
- Migration des données statiques et de référence
- Implémentation du système dual-write
- Création d'adaptateurs de données pour normalisation

### Phase 3 - Nouveaux modules (2-3 mois)
- Développement du module Dealflow
- Mise en place du module Due Diligence
- Amélioration des Scorecards
- Finalisation des OKR Tools

### Phase 4 - Migration complète & Optimisations (1-2 mois)
- Migration finale vers Supabase
- Optimisations de performance avancées
- Analytics et reporting améliorés
