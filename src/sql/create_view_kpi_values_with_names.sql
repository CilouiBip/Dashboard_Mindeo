-- SQL pour cru00e9er une vue qui joint kpi_value et kpi_def pour obtenir le nom du KPI

CREATE OR REPLACE FUNCTION public.create_view_kpi_values_with_names()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Supprimer la vue si elle existe du00e9ju00e0
  DROP VIEW IF EXISTS public.vw_kpi_values_with_names;
  
  -- Cru00e9er la vue
  EXECUTE 'CREATE VIEW public.vw_kpi_values_with_names AS
    SELECT 
      kv.id,
      kv.infopreneur_id,
      kv.kpi_id,
      kv.valeur,
      kv.score,
      kv.statut,
      kv.is_latest,
      kv.date_creation,
      kd.code AS kpi_code,
      kd.nom AS kpi_nom,
      kd.description AS kpi_description,
      kd.fonction AS kpi_fonction,
      kd.unite AS kpi_unite,
      kd.min_value,
      kd.max_value,
      kd.min_acceptable,
      kd.max_acceptable
    FROM 
      public.kpi_value kv
    JOIN 
      public.kpi_def kd ON kv.kpi_id = kd.id
    ORDER BY 
      kv.date_creation DESC;
  ';
  
  -- Ajouter des droits sur la vue
  EXECUTE 'GRANT SELECT ON public.vw_kpi_values_with_names TO anon, authenticated, service_role;';

END;
$function$;
