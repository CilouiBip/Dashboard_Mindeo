-- Ajout de la contrainte de clé étrangère
ALTER TABLE key_results
ADD CONSTRAINT fk_key_results_okr
FOREIGN KEY (okr_id)
REFERENCES okr(id)
ON DELETE CASCADE;

-- Index pour améliorer les performances des jointures
CREATE INDEX idx_key_results_okr_id ON key_results(okr_id);
