# Mindeo Private Equity Dashboard - Project Overview

## 📊 Introduction

Le Dashboard Mindeo est une application web conçue pour aider les équipes de private equity à suivre les indicateurs clés de performance (KPIs), gérer les audits, prioriser les actions et simuler l'impact des décisions stratégiques. L'application permet une visualisation claire des données via différentes vues, y compris des tableaux de bord, des listes de KPIs, des checklists d'audit et des planificateurs de projet.

## 🛠️ Stack Technique

### Frontend
- **Framework** : React 18 avec TypeScript
- **UI** : Tailwind CSS avec composants Radix UI
- **Routing** : React Router v6
- **Gestion d'état** : Zustand pour l'état global, React Query pour les requêtes
- **Tests** : Vitest avec React Testing Library
- **Build** : Vite

### Backend & Données
- **Source de données principale** : Airtable
- **Migration planifiée** : Supabase (PostgreSQL)
- **API** : Integration avec REST API

## 🏢 Architecture actuelle

```
┌─────────────────┐           ┌─────────────────┐
│  React Frontend │ ────────► │  Airtable API   │
└─────────────────┘           └─────────────────┘
         │                            │
         ▼                            ▼
┌─────────────────┐           ┌─────────────────┐
│ UI Components   │           │  Airtable Base  │
│ & State Mgmt    │           │  (Tables/Views) │
└─────────────────┘           └─────────────────┘
```

## 📁 Structure du projet

```
src/
├── api/           # Intégration API Airtable
├── components/    # Composants React réutilisables
├── contexts/      # Contextes React
├── hooks/         # Custom hooks
├── lib/           # Intégrations tierces
├── pages/         # Composants de page
├── schemas/       # Schémas Zod pour validation
├── types/         # Types TypeScript
└── utils/         # Fonctions utilitaires
```

## 🧩 Modules fonctionnels

### 1. Dashboard principal
Tableau de bord principal avec vue d'ensemble des KPIs, scores par fonction et alertes.

### 2. Gestion des KPIs
Module de suivi et mise à jour des KPIs avec historique et benchmarks.

### 3. Audits & Checklists
Gestion des éléments d'audit avec statuts, criticité et actions requises.

### 4. Plan d'action & Priorités
Suivi des actions prioritaires issues des audits et KPIs.

### 5. Simulation d'impact
Simulation des impacts financiers liés aux changements de KPIs.

### 6. OKR Tools (En développement)
Outils de gestion des Objectifs et Résultats Clés (OKR) avec roadmap.

## 🔄 Flux de données

1. Les données sont principalement stockées dans Airtable
2. L'application récupère les données via API calls
3. Les données sont transformées et normalisées côté client
4. Les calculs métier (scores, impacts) sont parfois calculés dans Airtable, parfois dans l'application
5. Les mises à jour sont envoyées via API calls vers Airtable

## 🚩 Contraintes actuelles

### Techniques
- Dépendance forte à Airtable pour la logique métier
- Manque de séparation claire entre la logique métier et l'UI
- Absence de tests automatisés complets
- Besoin d'amélioration de la gestion des erreurs et des états de chargement

### Fonctionnelles
- Besoin d'intégration plus forte entre les modules existants
- Demande croissante pour des fonctionnalités de Dealflow et Due Diligence
- Nécessité d'améliorer l'automatisation des scorecards

## 📈 État actuel et perspectives

L'application est fonctionnelle mais fait face à des défis d'évolutivité en raison de sa dépendance à Airtable. Une migration progressive vers Supabase est envisagée pour permettre :

- Une meilleure modélisation des données
- Des performances accrues pour les calculs complexes
- Plus de flexibilité dans les requêtes et relations
- Une réduction des coûts à long terme

Les développements prioritaires concernent :
1. La mise en place de modules Dealflow et Due Diligence
2. L'amélioration de l'automatisation des scorecards
3. La fiabilisation de l'application existante
4. La préparation de la migration vers Supabase

## 🔍 Conclusion

Le Dashboard Mindeo est un outil critique pour la prise de décision en private equity. Son évolution vers une architecture plus robuste avec Supabase représente un investissement stratégique qui renforcera ses capacités tout en réduisant sa dette technique.
