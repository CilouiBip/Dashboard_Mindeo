-- 1. Vérification de la structure des tables
SELECT 
    table_name,
    column_name,
    data_type,
    column_default,
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_name IN ('okr_sessions', 'objectives', 'key_results', 'roadmap')
ORDER BY 
    table_name, ordinal_position;

-- 2. Vérification des relations et données
SELECT 
    s.id AS session_id,
    s.name AS session_name,
    s.status AS session_status,
    o.id AS objective_id,
    o.title AS objective_title,
    kr.id AS kr_id,
    kr.kr_name,
    kr.target_value,
    kr.target_unit
FROM 
    okr_sessions s
LEFT JOIN 
    objectives o ON o.session_id = s.id
LEFT JOIN 
    key_results kr ON kr.objective_id = o.id
ORDER BY 
    s.created_at DESC, o.created_at DESC, kr.created_at DESC;
