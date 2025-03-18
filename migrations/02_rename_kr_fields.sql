-- Rename columns in key_results table
ALTER TABLE key_results 
  RENAME COLUMN metric TO kr_name;

ALTER TABLE key_results 
  RENAME COLUMN target TO target_value;

ALTER TABLE key_results 
  RENAME COLUMN unit TO target_unit;

-- Add new columns for better tracking
ALTER TABLE key_results
  ADD COLUMN IF NOT EXISTS baseline_value DECIMAL,
  ADD COLUMN IF NOT EXISTS description TEXT;

-- Add comments for clarity
COMMENT ON COLUMN key_results.kr_name IS 'The main description of the key result, e.g. "Generate leads per day"';
COMMENT ON COLUMN key_results.target_value IS 'The numeric goal to achieve, e.g. 100';
COMMENT ON COLUMN key_results.target_unit IS 'The unit of measurement, e.g. "leads", "%", "users"';
COMMENT ON COLUMN key_results.baseline_value IS 'Starting value before the KR begins';
COMMENT ON COLUMN key_results.description IS 'Additional context or details about the key result';
