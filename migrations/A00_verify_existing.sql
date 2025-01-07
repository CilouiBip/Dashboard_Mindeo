-- Vérification de l'extension UUID
SELECT EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp'
) as has_uuid_extension;

-- Vérification de la table roadmap
SELECT EXISTS (
    SELECT 1 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'roadmap'
) as has_roadmap_table;

-- Obtenir la structure de la table roadmap si elle existe
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'roadmap';
