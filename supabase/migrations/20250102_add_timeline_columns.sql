-- Ajouter les colonnes start_date et end_date à la table roadmap
ALTER TABLE public.roadmap
ADD COLUMN start_date DATE,
ADD COLUMN end_date DATE;
