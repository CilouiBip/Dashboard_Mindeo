# Rapport Technique: Schéma Airtable Mindeo

## Informations sur la Base

- **ID de la Base**: app6Q4KQzMBm5MEsz
- **Nombre de Tables**: 18
- **Date du Rapport**: 17/03/2025 16:39:06

## Vue d'Ensemble des Tables

| # | Nom de la Table | Nombre de Champs |
|---|----------------|------------------|
| 1 | KPIs | 53 |
| 2 | Fonctions_Problems | 14 |
| 3 | Sub_Problems | 13 |
| 4 | Catégorie_Problem | 20 |
| 5 | Audit_Items | 30 |
| 6 | Score_Fonction | 9 |
| 7 | GLOBAL_SCORE | 8 |
| 8 | Global Settings. | 7 |
| 9 | KPIs_Benchmark | 31 |
| 10 | Liste_Complète | 30 |
| 11 | Actions_Priority | 42 |
| 12 | KPIs_Definitions | 31 |
| 13 | Qualification_Infopreneurs | 44 |
| 14 | OKRs | 8 |
| 15 | ProjectPlan_OKRs | 9 |
| 16 | DD_Items | 18 |
| 17 | DD_Phases | 7 |
| 18 | MVD_Answers | 8 |

## Détails des Tables et Champs

### Table: KPIs

- **Nombre de Champs**: 53

#### Champs

| Nom du Champ | Type | Formule/Options |
|--------------|------|--------------|
| ID_KPI | autoNumber | N/A |
| Nom_KPI | singleLineText | N/A |
| Fonctions_Readable | formula | N/A |
| Fonctions | multipleRecordLinks | Lié à: tblet5Ajde662PBXG |
| Fonctions_KPIs | multipleLookupValues | N/A |
| Type | singleSelect | N/A |
| Valeur_Actuelle | number | N/A |
| Valeur_Precedente | number | N/A |
| Valeur_Min | number | N/A |
| Valeur_Max | number | N/A |
| Score_Final | formula | N/A |
| Statut | formula | N/A |
| Pondération | number | N/A |
| Score_Normalisé  | formula | N/A |
| Score_Normalisé_Sur_10 | formula | N/A |
| Produit_Score_Pondération. | formula | N/A |
| Score_KPI_Final | formula | N/A |
| Description | richText | N/A |
| KPIs liés  | multipleRecordLinks | Lié à: tblHoCPx9TJH877Mv |
| Période | singleSelect | N/A |
| To Audit | formula | N/A |
| Catégorie_Liée | multipleRecordLinks | Lié à: tbljaBUOGj1YYzGW2 |
|  Audit_Items_Récupérés | multipleLookupValues | N/A |
| Items_A_Auditer. | formula | N/A |
| Nom_Actions_Auditer | multipleLookupValues | N/A |
| Filtrer_Actions | formula | N/A |
| Filtrer_Actions copy | singleLineText | N/A |
| Catégorie_Audit | rollup | N/A |
| Problem_Fonctions | rollup | N/A |
| Sub_Problem_Audit | rollup | N/A |
| Liaison vers une autre table | multipleRecordLinks | Lié à: tbltSDngZx19Hj3kC |
| Global Score Link | multipleLookupValues | N/A |
| Global Settings | multipleRecordLinks | Lié à: tbleqcRWm25KUQIpO |
| Global Pondération Link | multipleLookupValues | N/A |
| Pondération Max  | multipleRecordLinks | Lié à: tbleqcRWm25KUQIpO |
| Pondération Max (from Pondération Max ) | multipleLookupValues | N/A |
| Pondération_Totale_Lookup | multipleLookupValues | N/A |
| Fonctions_Problems | singleLineText | N/A |
| Sub_Problems | singleLineText | N/A |
| Catégorie_Problem | singleLineText | N/A |
| Catégorie_Problem 2 | multipleRecordLinks | Lié à: tbljaBUOGj1YYzGW2 |
| Audit_Items 2 | singleLineText | N/A |
| Audit_Items | singleLineText | N/A |
| Table 10 | singleLineText | N/A |
| Audit_Items 3 | multipleRecordLinks | Lié à: tblLPDyFhJYTNZspm |
| Imported table | multipleRecordLinks | Lié à: tblA3A9N6Mu8P4afl |
| KPIs_Benchmark | multipleRecordLinks | Lié à: tblA3A9N6Mu8P4afl |
| Audit_Items copy | multipleRecordLinks | Lié à: tblrawgsdUBkHOE3W |
| Actions_Priority | multipleRecordLinks | Lié à: tblnSR53lyQyRA2JE |
| KPIs_Benchmark copy | singleLineText | N/A |
| KPIs_Benchmark copy | singleLineText | N/A |
| KPIs_Benchmark copy | multipleRecordLinks | Lié à: tbll8EOUVzYyhb8LI |
| KPIs_Benchmark copy | multipleRecordLinks | Lié à: tbll8EOUVzYyhb8LI |

### Table: Fonctions_Problems

- **Nombre de Champs**: 14

#### Champs

| Nom du Champ | Type | Formule/Options |
|--------------|------|--------------|
| Problem_ID | autoNumber | N/A |
| Problem_Name | singleLineText | N/A |
| Function | singleSelect | N/A |
| Description | multilineText | N/A |
| Priority | singleSelect | N/A |
| Status | singleSelect | N/A |
| Nom_KPI (from Main_KPIs) | multipleRecordLinks | Lié à: tblwzvkSHEzrlkdM6 |
| KPIs_Liés (from Nom_KPI (from Main_KPIs)) | multipleLookupValues | N/A |
| Sub_Problems | singleLineText | N/A |
| Sub_Problems copy | singleLineText | N/A |
| Sub_Problems copy | singleLineText | N/A |
| Sub_Problems 2 | multipleRecordLinks | Lié à: tblwzvkSHEzrlkdM6 |
| Sub_Problems 2 copy | singleLineText | N/A |
| Record | multipleRecordLinks | Lié à: tblrawgsdUBkHOE3W |

### Table: Sub_Problems

- **Nombre de Champs**: 13

#### Champs

| Nom du Champ | Type | Formule/Options |
|--------------|------|--------------|
| SubProblem_ID | formula | N/A |
| SubProblem_Name | singleLineText | N/A |
| Fonctions_Name_Problems | multipleRecordLinks | Lié à: tbl97Q6zqWcSWSfvh |
| Sub_Order | number | N/A |
| Problem_Name (from Fonctions_Name_Problems) | multipleLookupValues | N/A |
| Description | multilineText | N/A |
| Priority | singleSelect | N/A |
| Status | singleSelect | N/A |
| Catégorie_Problem | multipleRecordLinks | Lié à: tbljaBUOGj1YYzGW2 |
| KPIs_Liés | multipleLookupValues | N/A |
| Fonction_Name | multipleLookupValues | N/A |
| Fonctions_Problems | singleLineText | N/A |
| Fonctions_Problems 2 | multipleRecordLinks | Lié à: tbl97Q6zqWcSWSfvh |

### Table: Catégorie_Problem

- **Nombre de Champs**: 20

#### Champs

| Nom du Champ | Type | Formule/Options |
|--------------|------|--------------|
| Category_ID | autoNumber | N/A |
| Catégorie_Name | singleLineText | N/A |
| Sub_Problems_Lin | multipleRecordLinks | Lié à: tblwzvkSHEzrlkdM6 |
| Problem_Name_Fonctions | multipleLookupValues | N/A |
| KPIs_Name | multipleRecordLinks | Lié à: tblHoCPx9TJH877Mv |
| Fonctions_Name_Problems (from Fonctions_Problems_Lin) | multipleLookupValues | N/A |
| KPIs_Lookup_Audit | multipleLookupValues | N/A |
| Description | multilineText | N/A |
| Priority | singleSelect | N/A |
| Status | singleSelect | N/A |
| Audit_Items 3 | multipleRecordLinks | Lié à: tblLPDyFhJYTNZspm |
| Name_Items_Audit | multipleLookupValues | N/A |
| Fonction_Name | multipleLookupValues | N/A |
| ID_KPI_Audit_Baseline | multipleLookupValues | N/A |
| Nom_KPI (from KPIs_Name) | multipleLookupValues | N/A |
| KPIs_Status | multipleLookupValues | N/A |
| ID_Sub | multipleLookupValues | N/A |
| KPIs 2 | singleLineText | N/A |
| KPIs 3 | multipleRecordLinks | Lié à: tblHoCPx9TJH877Mv |
| Audit_Items copy | multipleRecordLinks | Lié à: tblrawgsdUBkHOE3W |

### Table: Audit_Items

- **Nombre de Champs**: 30

#### Champs

| Nom du Champ | Type | Formule/Options |
|--------------|------|--------------|
| Item_ID | autoNumber | N/A |
| Item_Name | singleLineText | N/A |
| Action_Required | multilineText | N/A |
| Catégorie_Link copy | multipleRecordLinks | Lié à: tbljaBUOGj1YYzGW2 |
| KPIs_Liés_Baseline | multipleRecordLinks | Lié à: tblHoCPx9TJH877Mv |
| ID_KPI_Baseline | multipleLookupValues | N/A |
| Nom_KPI_Baseline | multipleLookupValues | N/A |
| KPIs_Audit | formula | N/A |
| KPIs_Liés copy | multipleLookupValues | N/A |
| Sub_ID_Order | multipleLookupValues | N/A |
| Guidance | multilineText | N/A |
| Categorie_Problems_Name | multipleLookupValues | N/A |
| Sub_Problems_Name | multipleLookupValues | N/A |
| Sub_Problems_Text | formula | N/A |
| Sub_Problems_ID | multipleLookupValues | N/A |
| Problems_Name | multipleLookupValues | N/A |
| Fonction_Name | multipleLookupValues | N/A |
| Criticality | singleSelect | N/A |
| Status | singleSelect | N/A |
| Score | number | N/A |
| ScoreValue | number | N/A |
| Comments | multilineText | N/A |
| Playbook_Link | url | N/A |
|  Audit Record ID | formula | N/A |
| KPIs_Status_ | multipleLookupValues | N/A |
| KPIs_Name | multipleLookupValues | N/A |
| Problem_Fonct_ID | multipleLookupValues | N/A |
| Catégorie_Problem | singleLineText | N/A |
| Catégorie_Problem 2 | singleLineText | N/A |
| Actions_Priority | multipleRecordLinks | Lié à: tblnSR53lyQyRA2JE |

### Table: Score_Fonction

- **Nombre de Champs**: 9

#### Champs

| Nom du Champ | Type | Formule/Options |
|--------------|------|--------------|
| Name | singleLineText | N/A |
| KPIs | multipleRecordLinks | Lié à: tblHoCPx9TJH877Mv |
| Nom_KPI Rollup (from KPIs) | rollup | N/A |
| Score_Normalisé  Rollup (from KPIs) | rollup | N/A |
| Nbr_KPIs | count | N/A |
| Pondération totale  | rollup | N/A |
| Nbr_KPIs_Alert | rollup | N/A |
| Score pondéré & normalisé  | rollup | N/A |
| Score_Final_Fonction | formula | N/A |

### Table: GLOBAL_SCORE

- **Nombre de Champs**: 8

#### Champs

| Nom du Champ | Type | Formule/Options |
|--------------|------|--------------|
| Score Global | singleLineText | N/A |
| KPIs liés | singleLineText | N/A |
| KPIs | multipleRecordLinks | Lié à: tblHoCPx9TJH877Mv |
| Pondération_Totale_Globale | rollup | N/A |
| Somme_Scores_Pondérés_Globale | rollup | N/A |
| Score_Global_Pondéré | formula | N/A |
| Score_Global_Sur_10 | formula | N/A |
| Somme_Scores_Pondérés_Sur_10 | rollup | N/A |

### Table: Global Settings.

- **Nombre de Champs**: 7

#### Champs

| Nom du Champ | Type | Formule/Options |
|--------------|------|--------------|
| Name | singleLineText | N/A |
| KPIs | multipleRecordLinks | Lié à: tblHoCPx9TJH877Mv |
| Global Settings Rollup (from KPIs) | rollup | N/A |
| Pondération Max | rollup | N/A |
| KPIs 2 | multipleRecordLinks | Lié à: tblHoCPx9TJH877Mv |
| Produit_Score_Pondération | rollup | N/A |
| Pondération_Totale  | number | N/A |

### Table: KPIs_Benchmark

- **Nombre de Champs**: 31

#### Champs

| Nom du Champ | Type | Formule/Options |
|--------------|------|--------------|
| KPI_ID | autoNumber | N/A |
| Link_KPIs | multipleRecordLinks | Lié à: tblHoCPx9TJH877Mv |
| ID_KPI (from Link_KPIs) | multipleLookupValues | N/A |
| Nom_KPI | multipleLookupValues | N/A |
| Nom_KPI_Sort | formula | N/A |
| Fonctions_Readable (from Link_KPIs) | multipleLookupValues | N/A |
| Fonctions (from Link_KPIs) | multipleLookupValues | N/A |
| Fonctions_KPIs (from Link_KPIs) | multipleLookupValues | N/A |
| Fonctions_Sort | formula | N/A |
| Current_Values | multipleLookupValues | N/A |
| Previous_Value | multipleLookupValues | N/A |
| Impact_Weight | number | N/A |
| Category_Weight | number | N/A |
| Min_Benchmark | number | N/A |
| Max_Benchmark | number | N/A |
| Dependencies | multipleLookupValues | N/A |
| Dependencies_KPIs | multipleRecordLinks | Lié à: tblHoCPx9TJH877Mv |
| Impact_Type | singleSelect | N/A |
| Baseline_Revenue | currency | N/A |
| Baseline_EBITDA | currency | N/A |
| Scaling_Factor | number | N/A |
| EBITDA_Factor | number | N/A |
| Impact_Delta  | formula | N/A |
| Revenue_Impact | formula | N/A |
| EBITDA_Impact | formula | N/A |
| Total_Revenue_Potential | formula | N/A |
| Total_EBITDA_Potential | formula | N/A |
| Revenue_Growth_Percent | formula | N/A |
| EBITDA_Growth_Percent | formula | N/A |
| Impact_Direction | singleSelect | N/A |
| KPI_Type | singleSelect | N/A |

### Table: Liste_Complète

- **Nombre de Champs**: 30

#### Champs

| Nom du Champ | Type | Formule/Options |
|--------------|------|--------------|
| Item_ID | autoNumber | N/A |
| Item_Name | singleLineText | N/A |
| Action_Required | multilineText | N/A |
| Catégorie_Link copy | multipleRecordLinks | Lié à: tbljaBUOGj1YYzGW2 |
| KPIs_Liés_Baseline | multipleRecordLinks | Lié à: tblHoCPx9TJH877Mv |
| ID_KPI_Baseline | multipleLookupValues | N/A |
| Nom_KPI_Baseline | multipleLookupValues | N/A |
| KPIs_Liés copy | multipleLookupValues | N/A |
| Guidance | multilineText | N/A |
| Categorie_Problems_Name | multipleLookupValues | N/A |
| Sub_Problems_Name | multipleLookupValues | N/A |
| Sub_Problems_Text | formula | N/A |
| Problems_Name | multipleLookupValues | N/A |
| Fonction_Name | multipleLookupValues | N/A |
| Criticality | singleSelect | N/A |
| Status | singleSelect | N/A |
| Sub_ID_Order | multipleLookupValues | N/A |
| Score | number | N/A |
| ScoreValue | number | N/A |
| Comments | multilineText | N/A |
| Playbook_Link | url | N/A |
|  Audit Record ID | formula | N/A |
| KPIs_Status_ | multipleLookupValues | N/A |
| KPIs_Name | multipleLookupValues | N/A |
| Action_Audit 2 | singleLineText | N/A |
| Catégorie_Problem | singleLineText | N/A |
| Catégorie_Problem 2 | singleLineText | N/A |
| Field 27 | singleSelect | N/A |
| Problems name | manualSort | N/A |
| Fonctions_Problems | multipleRecordLinks | Lié à: tbl97Q6zqWcSWSfvh |

### Table: Actions_Priority

- **Nombre de Champs**: 42

#### Champs

| Nom du Champ | Type | Formule/Options |
|--------------|------|--------------|
| Action_Number | autoNumber | N/A |
| Action_ID | multipleRecordLinks | Lié à: tblLPDyFhJYTNZspm |
| Score (from Action_ID) 2 | multipleLookupValues | N/A |
| Playbook_Link (from Action_ID) | multipleLookupValues | N/A |
| To_Audit | multipleLookupValues | N/A |
| Item_ID | multipleLookupValues | N/A |
| Action_Required | multipleLookupValues | N/A |
| Item_Name | multipleLookupValues | N/A |
| Catégorie_Link copy (from Action_ID) | multipleLookupValues | N/A |
| Catégorie_Name_Link | multipleLookupValues | N/A |
| KPIs_Liés_Baseline (from Action_ID) | multipleLookupValues | N/A |
| ID_KPI_Baseline (from Action_ID) | multipleLookupValues | N/A |
| Sub_Problems_Name | multipleLookupValues | N/A |
| Sub_Problems_Text (from Action_ID) | multipleLookupValues | N/A |
| Problems_Name | multipleLookupValues | N/A |
| Fonction_Name | multipleLookupValues | N/A |
| Criticality | multipleLookupValues | N/A |
| Status_Actions | multipleLookupValues | N/A |
| Status_Actions_App | singleSelect | N/A |
| Status_Actions_Beta | singleSelect | N/A |
| Score (from Action_ID) | multipleLookupValues | N/A |
| KPIs_Status_ (from Action_ID) | multipleLookupValues | N/A |
| Status | singleSelect | N/A |
| Time_Frame | formula | N/A |
| KPIs_IDs | formula | N/A |
| KPIs_Link | multipleRecordLinks | Lié à: tblHoCPx9TJH877Mv |
| KPIs_Scores | multipleLookupValues | N/A |
| Priority_Score | formula | N/A |
| Average_KPI_Score | formula | N/A |
| Combined_Score | formula | N/A |
| Action_Week | formula | N/A |
| Start_Date | dateTime | N/A |
| Completion_Date | dateTime | N/A |
| Estimated_Hours | number | N/A |
| Actual_Hours | number | N/A |
| Progress | number | N/A |
| Assignee | singleSelect | N/A |
| Priority_Level | singleSelect | N/A |
| Duration_Day | formula | N/A |
| Efficiency_Rate | formula | N/A |
| Moyenne des heures | formula | N/A |
| Taux de complétion | formula | N/A |

### Table: KPIs_Definitions

- **Nombre de Champs**: 31

#### Champs

| Nom du Champ | Type | Formule/Options |
|--------------|------|--------------|
| KPI_ID | autoNumber | N/A |
| Link_KPIs | multipleRecordLinks | Lié à: tblHoCPx9TJH877Mv |
| ID_KPI (from Link_KPIs) | multipleLookupValues | N/A |
| Nom_KPI | multipleLookupValues | N/A |
| Nom_KPI_Sort | formula | N/A |
| Fonctions_Readable (from Link_KPIs) | multipleLookupValues | N/A |
| Fonctions (from Link_KPIs) | multipleLookupValues | N/A |
| Fonctions_KPIs (from Link_KPIs) | multipleLookupValues | N/A |
| Fonctions_Sort | formula | N/A |
| Current_Values | multipleLookupValues | N/A |
| Previous_Value | multipleLookupValues | N/A |
| Impact_Weight | number | N/A |
| Category_Weight | number | N/A |
| Min_Benchmark | number | N/A |
| Max_Benchmark | number | N/A |
| Dependencies | multipleLookupValues | N/A |
| Dependencies_KPIs | multipleRecordLinks | Lié à: tblHoCPx9TJH877Mv |
| Impact_Type | singleSelect | N/A |
| Baseline_Revenue | currency | N/A |
| Baseline_EBITDA | currency | N/A |
| Scaling_Factor | number | N/A |
| EBITDA_Factor | number | N/A |
| Impact_Delta  | formula | N/A |
| Revenue_Impact | formula | N/A |
| EBITDA_Impact | formula | N/A |
| Total_Revenue_Potential | formula | N/A |
| Total_EBITDA_Potential | formula | N/A |
| Revenue_Growth_Percent | formula | N/A |
| EBITDA_Growth_Percent | formula | N/A |
| Impact_Direction | singleSelect | N/A |
| KPI_Type | singleSelect | N/A |

### Table: Qualification_Infopreneurs

- **Nombre de Champs**: 44

#### Champs

| Nom du Champ | Type | Formule/Options |
|--------------|------|--------------|
| Nom_Complet | singleLineText | N/A |
| ID_Infopreneur | autoNumber | N/A |
| CreatedDate | dateTime | N/A |
| Téléphone | phoneNumber | N/A |
| Nom_Business | singleLineText | N/A |
| Lien_Principal | url | N/A |
| Instagram | url | N/A |
| YouTube | url | N/A |
| LinkedIn | url | N/A |
| Facebook | url | N/A |
| TikTok | url | N/A |
| Autre_Réseau | url | N/A |
| Sous_Niche | singleLineText | N/A |
| Expérience_Années | number | N/A |
| CA_Mensuel | number | N/A |
| CA_Source_Principale | singleSelect | N/A |
| Marge_Bénéficiaire | percent | N/A |
| Taille_Liste_Email | number | N/A |
| Taille_Audience_Sociale | number | N/A |
| Canal_Acquisition_Principal | singleSelect | N/A |
| Budget_Ads_Mensuel | number | N/A |
| Prix_Moyen_Offre | number | N/A |
| Taux_Conversion_Global | percent | N/A |
| Type_Funnel_Principal | singleSelect | N/A |
| Type_Contenu_Principal | singleSelect | N/A |
| CTA_Principale | singleLineText | N/A |
| Processus_Closing | singleSelect | N/A |
| Outil_CRM | singleLineText | N/A |
| Objectif_CA_6Mois | number | N/A |
| Priorité_1 | multilineText | N/A |
| Priorité_2 | multilineText | N/A |
| Défi_Principal | multilineText | N/A |
| Blocage_Croissance | multipleSelects | N/A |
| Objectif_Collaboration | multilineText | N/A |
| Statut | singleSelect | N/A |
| Date_Soumission | dateTime | N/A |
| Dernière_Modification | dateTime | N/A |
| Score_Qualification | formula | N/A |
| DD_Items | multipleRecordLinks | Lié à: tblTbZ5y7tuIx1S5d |
| MVD_Answers | multipleRecordLinks | Lié à: tbljoWrZS9kZelzs1 |
| DD Items Link  | multipleRecordLinks | Lié à: tblTbZ5y7tuIx1S5d |
| InfopreneurID (from DD Items Link ) | multipleLookupValues | N/A |
| DD_NbInProgress | rollup | N/A |
| StatutAuto | formula | N/A |

### Table: OKRs

- **Nombre de Champs**: 8

#### Champs

| Nom du Champ | Type | Formule/Options |
|--------------|------|--------------|
| OKR_ID | autoNumber | N/A |
| Objective | singleLineText | N/A |
| Key_Results | multilineText | N/A |
| Owner | singleSelect | N/A |
| Status | singleSelect | N/A |
| Iteration | number | N/A |
| VisionRef | multilineText | N/A |
| Comments | multilineText | N/A |

### Table: ProjectPlan_OKRs

- **Nombre de Champs**: 9

#### Champs

| Nom du Champ | Type | Formule/Options |
|--------------|------|--------------|
| Name | singleLineText | N/A |
| Description | multilineText | N/A |
| Owner | singleSelect | N/A |
| Owner copy | singleCollaborator | N/A |
| Due Date | dateTime | N/A |
| Status | singleSelect | N/A |
| Priority | singleSelect | N/A |
| OKR_Ref | multilineText | N/A |
| Comments | multilineText | N/A |

### Table: DD_Items

- **Nombre de Champs**: 18

#### Champs

| Nom du Champ | Type | Formule/Options |
|--------------|------|--------------|
| ID_Item | singleLineText | N/A |
| InfopreneurID | multipleRecordLinks | Lié à: tbl7t2wc7ZFuZdijP |
| Nom_Complet (from InfopreneurID) | multipleLookupValues | N/A |
| ID_Infopreneur (from InfopreneurID) | multipleLookupValues | N/A |
| Category | singleSelect | N/A |
| SubCategory | singleSelect | N/A |
| ItemName | singleLineText | N/A |
| Description | multilineText | N/A |
| DueDate | date | N/A |
| Owner | singleLineText | N/A |
| Status | singleSelect | N/A |
| DeliverableType | singleSelect | N/A |
| Attachment | multipleAttachments | N/A |
| Observations | multilineText | N/A |
| Priority | singleSelect | N/A |
| CreatedDate | dateTime | N/A |
| IsInProgress | formula | N/A |
| Qualification_Infopreneurs | multipleRecordLinks | Lié à: tbl7t2wc7ZFuZdijP |

### Table: DD_Phases

- **Nombre de Champs**: 7

#### Champs

| Nom du Champ | Type | Formule/Options |
|--------------|------|--------------|
| ID_Phase | singleLineText | N/A |
| InfopreneurID | singleLineText | N/A |
| PhaseName | singleSelect | N/A |
| StartDate | date | N/A |
| EndDate | date | N/A |
| Status | singleSelect | N/A |
| Notes | multilineText | N/A |

### Table: MVD_Answers

- **Nombre de Champs**: 8

#### Champs

| Nom du Champ | Type | Formule/Options |
|--------------|------|--------------|
| ID_Answer | singleLineText | N/A |
| InfopreneurID | multipleRecordLinks | Lié à: tbl7t2wc7ZFuZdijP |
| Nom_Complet (from InfopreneurID) | multipleLookupValues | N/A |
| ID_Infopreneur (from InfopreneurID) | multipleLookupValues | N/A |
| KPI_Name | singleSelect | N/A |
| CurrentValue | number | N/A |
| ProofUpload | multipleAttachments | N/A |
| CreatedDate | dateTime | N/A |

## Relations entre Tables

| Table Source | Champ | Table Destination |
|--------------|-------|------------------|
| KPIs | Fonctions | tblet5Ajde662PBXG |
| KPIs | KPIs liés  | tblHoCPx9TJH877Mv |
| KPIs | Catégorie_Liée | tbljaBUOGj1YYzGW2 |
| KPIs | Liaison vers une autre table | tbltSDngZx19Hj3kC |
| KPIs | Global Settings | tbleqcRWm25KUQIpO |
| KPIs | Pondération Max  | tbleqcRWm25KUQIpO |
| KPIs | Catégorie_Problem 2 | tbljaBUOGj1YYzGW2 |
| KPIs | Audit_Items 3 | tblLPDyFhJYTNZspm |
| KPIs | Imported table | tblA3A9N6Mu8P4afl |
| KPIs | KPIs_Benchmark | tblA3A9N6Mu8P4afl |
| KPIs | Audit_Items copy | tblrawgsdUBkHOE3W |
| KPIs | Actions_Priority | tblnSR53lyQyRA2JE |
| KPIs | KPIs_Benchmark copy | tbll8EOUVzYyhb8LI |
| KPIs | KPIs_Benchmark copy | tbll8EOUVzYyhb8LI |
| Fonctions_Problems | Nom_KPI (from Main_KPIs) | tblwzvkSHEzrlkdM6 |
| Fonctions_Problems | Sub_Problems 2 | tblwzvkSHEzrlkdM6 |
| Fonctions_Problems | Record | tblrawgsdUBkHOE3W |
| Sub_Problems | Fonctions_Name_Problems | tbl97Q6zqWcSWSfvh |
| Sub_Problems | Catégorie_Problem | tbljaBUOGj1YYzGW2 |
| Sub_Problems | Fonctions_Problems 2 | tbl97Q6zqWcSWSfvh |
| Catégorie_Problem | Sub_Problems_Lin | tblwzvkSHEzrlkdM6 |
| Catégorie_Problem | KPIs_Name | tblHoCPx9TJH877Mv |
| Catégorie_Problem | Audit_Items 3 | tblLPDyFhJYTNZspm |
| Catégorie_Problem | KPIs 3 | tblHoCPx9TJH877Mv |
| Catégorie_Problem | Audit_Items copy | tblrawgsdUBkHOE3W |
| Audit_Items | Catégorie_Link copy | tbljaBUOGj1YYzGW2 |
| Audit_Items | KPIs_Liés_Baseline | tblHoCPx9TJH877Mv |
| Audit_Items | Actions_Priority | tblnSR53lyQyRA2JE |
| Score_Fonction | KPIs | tblHoCPx9TJH877Mv |
| GLOBAL_SCORE | KPIs | tblHoCPx9TJH877Mv |
| Global Settings. | KPIs | tblHoCPx9TJH877Mv |
| Global Settings. | KPIs 2 | tblHoCPx9TJH877Mv |
| KPIs_Benchmark | Link_KPIs | tblHoCPx9TJH877Mv |
| KPIs_Benchmark | Dependencies_KPIs | tblHoCPx9TJH877Mv |
| Liste_Complète | Catégorie_Link copy | tbljaBUOGj1YYzGW2 |
| Liste_Complète | KPIs_Liés_Baseline | tblHoCPx9TJH877Mv |
| Liste_Complète | Fonctions_Problems | tbl97Q6zqWcSWSfvh |
| Actions_Priority | Action_ID | tblLPDyFhJYTNZspm |
| Actions_Priority | KPIs_Link | tblHoCPx9TJH877Mv |
| KPIs_Definitions | Link_KPIs | tblHoCPx9TJH877Mv |
| KPIs_Definitions | Dependencies_KPIs | tblHoCPx9TJH877Mv |
| Qualification_Infopreneurs | DD_Items | tblTbZ5y7tuIx1S5d |
| Qualification_Infopreneurs | MVD_Answers | tbljoWrZS9kZelzs1 |
| Qualification_Infopreneurs | DD Items Link  | tblTbZ5y7tuIx1S5d |
| DD_Items | InfopreneurID | tbl7t2wc7ZFuZdijP |
| DD_Items | Qualification_Infopreneurs | tbl7t2wc7ZFuZdijP |
| MVD_Answers | InfopreneurID | tbl7t2wc7ZFuZdijP |

## Notes Techniques

- Ce rapport a été généré automatiquement le 17/03/2025 16:39:06.
- Les formules longues ont été tronquées pour la lisibilité.
