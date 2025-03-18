-- Migration: Update KPI benchmarks and scoring logic
-- Date: 2025-03-18

-- 1. Update Marketing KPIs
UPDATE public.kpi_def
SET min_value = 10, max_value = 5, min_acceptable = 10, max_acceptable = 5
WHERE code = 'cpl';

UPDATE public.kpi_def
SET min_value = 300, max_value = 100, min_acceptable = 300, max_acceptable = 100
WHERE code = 'cac';

UPDATE public.kpi_def
SET min_value = 100, max_value = 500, min_acceptable = 100, max_acceptable = 500
WHERE code = 'nb_leads_mois';

UPDATE public.kpi_def
SET min_value = 5, max_value = 15, min_acceptable = 5, max_acceptable = 15
WHERE code = 'taux_conv_landing';

-- 2. Update Sales KPIs
UPDATE public.kpi_def
SET min_value = 5, max_value = 20, min_acceptable = 5, max_acceptable = 20
WHERE code = 'close_rate';

UPDATE public.kpi_def
SET min_value = 500, max_value = 5000, min_acceptable = 500, max_acceptable = 5000
WHERE code = 'acv';

UPDATE public.kpi_def
SET min_value = 10000, max_value = 50000, min_acceptable = 10000, max_acceptable = 50000
WHERE code = 'ca_par_closer';

UPDATE public.kpi_def
SET min_value = 30, max_value = 15, min_acceptable = 30, max_acceptable = 15
WHERE code = 'pipeline_velocity';

UPDATE public.kpi_def
SET min_value = 5, max_value = 15, min_acceptable = 5, max_acceptable = 15
WHERE code = 'nb_appels_hebdo';

-- 3. Update Content KPIs
UPDATE public.kpi_def
SET min_value = 5000, max_value = 30000, min_acceptable = 5000, max_acceptable = 30000
WHERE code = 'impressions_mensuelles';

UPDATE public.kpi_def
SET min_value = 3, max_value = 7, min_acceptable = 3, max_acceptable = 7
WHERE code = 'taux_engagement_moyen';

UPDATE public.kpi_def
SET min_value = 3, max_value = 7, min_acceptable = 3, max_acceptable = 7
WHERE code = 'watch_time_moyen';

UPDATE public.kpi_def
SET min_value = 2, max_value = 10, min_acceptable = 2, max_acceptable = 10
WHERE code = 'ctr_contenu';

UPDATE public.kpi_def
SET min_value = 0.5, max_value = 1, min_acceptable = 0.5, max_acceptable = 1
WHERE code = 'ca_par_vues';

-- 4. Update Product KPIs
UPDATE public.kpi_def
SET min_value = 40, max_value = 70, min_acceptable = 40, max_acceptable = 70
WHERE code = 'taux_completion';

UPDATE public.kpi_def
SET min_value = 20, max_value = 70, min_acceptable = 20, max_acceptable = 70
WHERE code = 'nps';

UPDATE public.kpi_def
SET min_value = 15, max_value = 40, min_acceptable = 15, max_acceptable = 40
WHERE code = 'clients_objectif';

UPDATE public.kpi_def
SET min_value = 20, max_value = 5, min_acceptable = 20, max_acceptable = 5
WHERE code = 'taux_remboursement';

-- 5. Update Finance KPIs
UPDATE public.kpi_def
SET min_value = 5000, max_value = 50000, min_acceptable = 5000, max_acceptable = 50000
WHERE code = 'ca_mensuel';

UPDATE public.kpi_def
SET min_value = 20, max_value = 50, min_acceptable = 20, max_acceptable = 50
WHERE code = 'marge_beneficiaire';

UPDATE public.kpi_def
SET min_value = 2000, max_value = 50000, min_acceptable = 2000, max_acceptable = 50000
WHERE code = 'cash_flow_op';

-- 6. Special case for EBITDA with inverted logic
UPDATE public.kpi_def
SET min_value = 60, max_value = 40, min_acceptable = 60, max_acceptable = 40
WHERE code = 'ebitda';

-- 7. Create or update the function to calculate KPI score with the new logic
CREATE OR REPLACE FUNCTION calculate_kpi_score()
 RETURNS TRIGGER AS $$
DECLARE
  v_min NUMERIC;
  v_max NUMERIC;
  v_val NUMERIC;
  v_score NUMERIC;
  v_statut TEXT;
  v_code TEXT;
  v_is_inverse BOOLEAN := FALSE;
BEGIN
  -- Retrieve min and max values from kpi_def
  SELECT min_value, max_value, code 
  INTO v_min, v_max, v_code
  FROM public.kpi_def 
  WHERE id = NEW.kpi_id;
  
  v_val := NEW.valeur;
  
  -- Check if this is a KPI where lower is better (inverse logic)
  -- Common inverse KPIs: cpl, cac, pipeline_velocity, taux_remboursement
  -- New: EBITDA now has special inverse scoring
  IF v_code IN ('cpl', 'cac', 'pipeline_velocity', 'taux_remboursement') OR 
     (v_min > v_max) THEN
    v_is_inverse := TRUE;
  END IF;
  
  -- Calculate score based on whether lower or higher values are better
  IF v_is_inverse THEN
    -- For inverse KPIs, score is 10 when value reaches or exceeds min to max range
    IF v_val <= v_max THEN
      v_score := 10;
    ELSIF v_val >= v_min THEN
      v_score := 0;
    ELSE
      -- Normalize between 0-10, but invert the scale since lower is better
      v_score := 10 - (((v_val - v_max) / (v_min - v_max)) * 10);
    END IF;
  ELSE
    -- For regular KPIs, score is 10 when value reaches or exceeds max value
    IF v_val >= v_max THEN
      v_score := 10;
    ELSIF v_val <= v_min THEN
      v_score := 0;
    ELSE
      -- Normalize between 0-10
      v_score := ((v_val - v_min) / (v_max - v_min)) * 10;
    END IF;
  END IF;
  
  -- Round score to one decimal place
  v_score := ROUND(v_score, 1);
  
  -- Determine status based on score
  -- Special case for EBITDA with inverted status logic
  IF v_code = 'ebitda' THEN
    -- For EBITDA: > 40% = red, 40-60% = orange, > 60% = green (per specific requirement)
    IF v_val > 60 THEN
      v_statut := 'Vert';
    ELSIF v_val >= 40 THEN
      v_statut := 'Orange';
    ELSE
      v_statut := 'Rouge';
    END IF;
  ELSE
    -- Normal KPI status logic
    IF v_score >= 7 THEN
      v_statut := 'Vert';
    ELSIF v_score >= 3 THEN
      v_statut := 'Orange';
    ELSE
      v_statut := 'Rouge';
    END IF;
  END IF;
  
  -- Update the score and status
  NEW.score := v_score;
  NEW.statut := v_statut;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Make sure the trigger exists on kpi_value table
DROP TRIGGER IF EXISTS calculate_kpi_score_trigger ON public.kpi_value;

CREATE TRIGGER calculate_kpi_score_trigger
BEFORE INSERT OR UPDATE ON public.kpi_value
FOR EACH ROW
EXECUTE FUNCTION calculate_kpi_score();

-- 9. Update existing KPI values to recalculate scores with new benchmarks
UPDATE public.kpi_value SET valeur = valeur WHERE is_latest = TRUE;
