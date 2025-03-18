-- Migration: Update KPI views for new benchmarks
-- Date: 2025-03-18

-- 1. Update or recreate the main KPI view
CREATE OR REPLACE VIEW public.vw_kpis AS
SELECT 
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
  kd.type AS Type_KPI,
  kd.min_value,
  kd.max_value
FROM 
  public.kpi_value kv
JOIN 
  public.kpi_def kd ON kv.kpi_id = kd.id
WHERE 
  kv.is_latest = true
ORDER BY 
  kd.fonction, kd.nom;

-- 2. Update function scores view to leverage the new benchmarks
CREATE OR REPLACE VIEW public.vw_kpi_fonction_scores AS
SELECT
  kd.fonction AS Name,
  ROUND(AVG(kv.score), 1) AS Score_Final_Fonction,
  COUNT(kv.id) AS Nbr_KPIs,
  SUM(CASE WHEN kv.score < 4 THEN 1 ELSE 0 END) AS Nbr_KPIs_Alert
FROM
  public.kpi_value kv
JOIN
  public.kpi_def kd ON kv.kpi_id = kd.id
WHERE
  kv.is_latest = true
GROUP BY
  kd.fonction
ORDER BY
  kd.fonction;

-- 3. Update global score view
CREATE OR REPLACE VIEW public.vw_kpi_global_score AS
SELECT
  ROUND(AVG(score), 1) AS Score_Global_Sur_10
FROM
  public.kpi_value
WHERE
  is_latest = true;

-- 4. Grant permissions on views
GRANT SELECT ON public.vw_kpis TO anon, authenticated, service_role;
GRANT SELECT ON public.vw_kpi_fonction_scores TO anon, authenticated, service_role;
GRANT SELECT ON public.vw_kpi_global_score TO anon, authenticated, service_role;
