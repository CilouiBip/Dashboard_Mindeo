-- Ajout de la contrainte d'unicité sur la table okr
ALTER TABLE okr ADD CONSTRAINT unique_objective_vision 
UNIQUE (objective, vision_id) WHERE vision_id IS NOT NULL;
