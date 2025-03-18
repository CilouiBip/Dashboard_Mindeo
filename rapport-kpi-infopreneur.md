# Rapport technique et business sur le système de KPIs pour infopreneurs

**Date :** 18 mars 2025  
**Auteur :** Équipe Technique Dashboard Mindeo  
**Destinataires :** CEO, CTO

## Résumé exécutif

Ce rapport présente une analyse complète du système de KPIs mis en place pour les infopreneurs, couvrant à la fois les aspects techniques de l'implémentation et la logique business sous-jacente. La migration réussie d'Airtable vers Supabase offre désormais une architecture robuste et évolutive permettant un suivi précis des performances des infopreneurs à travers différentes fonctions clés de leur activité.

## Table des matières

1. [Architecture technique](#1-architecture-technique)
2. [Logique de calcul des KPIs](#2-logique-de-calcul-des-kpis)
3. [Benchmarks et seuils](#3-benchmarks-et-seuils)
4. [Recommandations d'amélioration](#4-recommandations-damélioration)
5. [Annexes : Glossaire et définitions](#5-annexes--glossaire-et-définitions)

## 1. Architecture technique

### 1.1 Structure de la base de données

L'architecture de données repose sur un modèle normalisé dans Supabase avec les tables suivantes :

- **`kpi_def`** : Définition des KPIs
  - Contient la structure des KPIs (nom, code, description, fonction, unité)
  - Stocke les valeurs de référence (min_value, max_value) pour les calculs de score

- **`kpi_value`** : Valeurs des KPIs
  - Stocke l'historique complet des valeurs saisies
  - Chaque entrée est liée à un KPI et à un infopreneur
  - Inclut le score calculé automatiquement via trigger

- **`infopreneur`** : Données des utilisateurs
  - Identifie chaque infopreneur dans le système

- **Vues :**
  - `vw_kpis` : Vue principale pour l'affichage frontend
  - `vw_kpi_fonction_scores` : Calcule les scores par fonction
  - `vw_kpi_global_score` : Calcule le score global
  - `vw_kpi_values_with_names` : Vue de débogage avec noms de KPIs

### 1.2 Flux de données

Le système suit un flux de données clair :

1. **Saisie des KPIs** : L'utilisateur entre des valeurs via l'interface
2. **Stockage** : Les valeurs sont enregistrées dans `kpi_value`
3. **Calcul automatique** : Les triggers SQL calculent scores et statuts
4. **Affichage** : Les vues agrègent les données pour le tableau de bord

## 2. Logique de calcul des KPIs

### 2.1 Calcul des scores individuels

La fonction `calculate_kpi_score` normalise chaque valeur entre 0 et 10 :

```sql
v_score := ((v_val - v_min) / (v_max - v_min)) * 10;
```

Où :
- `v_val` est la valeur actuelle du KPI
- `v_min` est la valeur minimum acceptable
- `v_max` est la valeur maximum/objectif

Cette normalisation permet de comparer des KPIs avec des unités différentes sur une échelle commune.

### 2.2 Statuts des KPIs

Chaque KPI se voit attribuer un statut selon sa position par rapport aux seuils :

- **Alerte** (rouge) : < 3/10
- **Avertissement** (orange) : entre 3/10 et 7/10
- **Bon** (vert) : > 7/10

### 2.3 Scores par fonction

Le système calcule un score agrégé pour chaque fonction (MARKETING, SALES, CONTENU, etc.) :

```sql
AVG(score_final) WHERE fonction = X
```

Chaque fonction comprend entre 3 et 6 KPIs spécifiques.

### 2.4 Score global

Le score global est calculé en combinant les scores de toutes les fonctions avec une pondération :

```sql
SUM(fonction_score * pond) / SUM(pond)
```

Cette approche donne plus d'importance aux fonctions critiques comme les ventes (SALES).

## 3. Benchmarks et seuils

### 3.1 Définition des seuils par expertise métier

Les valeurs min/max pour chaque KPI ont été définies selon :

- **Données historiques** : Performances passées des infopreneurs
- **Standards de l'industrie** : Benchmarks du secteur de l'infopreneur
- **Objectifs stratégiques** : Alignement avec la vision business

### 3.2 Analyse des KPIs par fonction

#### MARKETING

| KPI | Description | Unité | Min acceptable | Objectif cible |
|-----|-------------|-------|----------------|----------------|
| cpl | Coût par lead | € | 15 | 5 |
| cac | Coût d'acquisition client | € | 300 | 100 |
| nb_leads_mois | Nombre de leads mensuels | Nombre | 120 | 400 |
| taux_conv_landing | Taux de conversion landing page | % | 5 | 15 |

#### SALES

| KPI | Description | Unité | Min acceptable | Objectif cible |
|-----|-------------|-------|----------------|----------------|
| close_rate | Taux de conversion vente | % | 5 | 20 |
| acv | Valeur moyenne client | € | 1500 | 10000 |
| ca_par_closer | CA mensuel par vendeur | € | 10000 | 50000 |
| pipeline_velocity | Vitesse du pipeline | Jours | 30 | 15 |
| nb_appels_hebdo | Appels de vente hebdo | Nombre | 10 | 30 |

#### CONTENU

| KPI | Description | Unité | Min acceptable | Objectif cible |
|-----|-------------|-------|----------------|----------------|
| impressions_mensuelles | Impressions tous canaux | Nombre | 5000 | 30000 |
| taux_engagement_moyen | Taux engagement moyen | % | 5 | 20 |
| watch_time_moyen | Temps de visionnage moyen | Minutes | 5 | 20 |
| ca_par_vues | CA généré par 1000 vues | € | 0.1 | 1.5 |
| ctr_contenu | Taux de clic contenu | % | 2 | 10 |

#### PRODUIT

| KPI | Description | Unité | Min acceptable | Objectif cible |
|-----|-------------|-------|----------------|----------------|
| taux_completion | Taux de complétion formation | % | 30 | 70 |
| nps | Net Promoter Score | Score | 20 | 70 |
| clients_objectif | % clients atteignant objectifs | % | 15 | 40 |
| taux_remboursement | Taux de remboursement | % | 30 | 5 |

#### FINANCE

| KPI | Description | Unité | Min acceptable | Objectif cible |
|-----|-------------|-------|----------------|----------------|
| ca_mensuel | Chiffre d'affaires mensuel | € | 5000 | 100000 |
| marge_beneficiaire | Marge bénéficiaire | % | 20 | 80 |
| cash_flow_op | Cash flow opérationnel | € | 2000 | 50000 |
| ebitda | EBITDA | € | 1000 | 40000 |

## 4. Mise à jour du système - 18 mars 2025

Une refonte majeure du système de calcul des KPIs a été effectuée le 18 mars 2025 pour résoudre plusieurs problèmes identifiés lors d'un audit technique.

### 4.1 Problèmes corrigés

- **Échelle de score**: Passage d'un calcul 0-100 divisé par 10 à un calcul direct sur échelle 0-10
- **KPIs inversés**: Implémentation correcte de la logique d'inversion pour les KPIs où "plus petit = meilleur" (CAC, CPL, pipeline_velocity, taux_remboursement)
- **Cas EBITDA**: Mise en place d'une logique spéciale pour le statut d'EBITDA basée sur la valeur brute (>60% = OK, 40-60% = Warning, <40% = Alerte)
- **Conflits de triggers**: Nettoyage et unification des triggers sur la table kpi_value

### 4.2 Modifications techniques

1. **Fonction calculate_kpi_score**: Refonte complète pour calculer directement les scores sur échelle 0-10
   - Détection automatique des KPIs inversés
   - Normalisation correcte des scores entre 0 et 10
   - Arrondi à une décimale pour plus de lisibilité

2. **Trigger fn_calcul_score_kpi**: Simplification et unification
   - Récupération de la valeur précédente
   - Gestion spéciale du statut pour EBITDA basée sur la valeur brute
   - Détermination standard du statut pour les autres KPIs (≥7 = OK, ≥3 = Warning, <3 = Alerte)

3. **Benchmarks**: Mise à jour de tous les benchmarks pour les KPIs clés
   - KPIs inversés: min_value > max_value (ex: CAC: min=300, max=100)
   - EBITDA: min_value=40, max_value=60

### 4.3 Résultats validés

Les tests effectués confirment que le système fonctionne désormais comme prévu:
- **CAC à 50€**: Score=10.0, Statut=OK (valeur bien en-dessous du benchmark de 100-300)
- **CPL à 25**: Score=0.0, Statut=Alerte (seuils à revoir: min=10, max=5)
- **EBITDA à 50%**: Score=5.0, Statut=Warning (conforme à la règle spéciale)
- **EBITDA à 70%**: Score=10.0, Statut=OK (conforme à la règle spéciale)

## 5. Recommandations d'amélioration

### 5.1 Optimisations techniques

1. **Historisation avancée** : Implémenter des graphiques d'évolution des KPIs dans le temps
2. **Alertes automatiques** : Notifier les infopreneurs lors de changements significatifs
3. **API dédiée** : Créer une API robuste pour intégration avec d'autres outils

### 4.2 Optimisations business

1. **Benchmarks dynamiques** : Ajuster automatiquement les seuils selon les performances moyennes
2. **KPIs prédictifs** : Ajouter des indicateurs avancés prédisant les performances futures
3. **Segmentation** : Proposer des benchmarks différents selon la maturité de l'infopreneur

### 4.3 Évolution de la méthode de calcul

1. **Pondération avancée** : Affiner les poids des KPIs selon leur impact réel sur le succès
2. **Saisonnalité** : Intégrer des facteurs de correction saisonniers pour certains KPIs
3. **Corrélations** : Mesurer les interdépendances entre KPIs pour des insights plus riches

## 5. Annexes : Glossaire et définitions

### 5.1 Définitions des termes techniques

- **KPI** : Key Performance Indicator, indicateur clé de performance
- **Benchmark** : Valeur de référence permettant de situer la performance
- **Seuil** : Valeur limite déterminant un changement de statut

### 5.2 Glossaire business infopreneur

- **CPL** : Coût Par Lead - coût d'acquisition d'un prospect
- **CAC** : Coût d'Acquisition Client - investissement total pour acquérir un client
- **NPS** : Net Promoter Score - mesure la satisfaction et fidélité client
- **ACV** : Average Customer Value - valeur moyenne d'un client
- **Close Rate** : Taux de conversion des prospects en clients

---

*Ce rapport est confidentiel et destiné uniquement à l'équipe de direction.*
