-- Verify table structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM 
    information_schema.columns
WHERE 
    table_name IN ('okr_sessions', 'objectives', 'key_results')
ORDER BY 
    table_name, ordinal_position;

-- Verify existing data
SELECT 
    s.id,
    s.name,
    o.title AS objective_title,
    kr.kr_name
FROM 
    okr_sessions s
LEFT JOIN 
    objectives o ON o.session_id = s.id
LEFT JOIN 
    key_results kr ON kr.objective_id = o.id
ORDER BY 
    s.created_at DESC
LIMIT 5;
