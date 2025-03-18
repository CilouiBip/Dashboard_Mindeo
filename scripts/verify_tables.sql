-- Vérification des tables
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_name IN ('okr_sessions', 'objectives', 'key_results', 'roadmap')
ORDER BY 
    table_name, ordinal_position;
