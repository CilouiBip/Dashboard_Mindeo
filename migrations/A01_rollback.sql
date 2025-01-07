-- Start transaction
BEGIN;

-- Drop tables in reverse order
DROP TABLE IF EXISTS roadmap_kr_links;
DROP TABLE IF EXISTS initiatives;
DROP TABLE IF EXISTS key_results;
DROP TABLE IF EXISTS objectives;
DROP TABLE IF EXISTS ai_generated_okrs;

-- Drop triggers
DROP TRIGGER IF EXISTS update_objectives_updated_at ON objectives;
DROP TRIGGER IF EXISTS update_key_results_updated_at ON key_results;
DROP TRIGGER IF EXISTS update_initiatives_updated_at ON initiatives;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column();

COMMIT;
