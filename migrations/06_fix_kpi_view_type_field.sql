-- Migration: Fix KPI view type field and prevent duplicates
-- Date: 2025-03-18

-- 1. Update the main KPI view to correct the Type field name and ensure no duplicates
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
  kd.max_value,
  kv.infopreneur_id  -- Ajout du champ infopreneur_id nécessaire pour le filtrage
FROM 
  public.kpi_value kv
JOIN 
  public.kpi_def kd ON kv.kpi_id = kd.id
WHERE 
  kv.is_latest = true
ORDER BY 
  kv.kpi_id, kv.date_creation DESC, kd.fonction, kd.nom;

-- 2. Grant permissions on the updated view
GRANT SELECT ON public.vw_kpis TO anon, authenticated, service_role;
