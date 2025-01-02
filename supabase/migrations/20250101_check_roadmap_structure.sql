-- 1. Vérifier la structure de la table
SELECT 
    column_name, 
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'roadmap'
ORDER BY ordinal_position;

-- 2. Vérifier si RLS est activé
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'roadmap';

-- 3. Vérifier les policies existantes
SELECT *
FROM pg_policies
WHERE tablename = 'roadmap';

-- 4. Supprimer les policies existantes pour repartir de zéro
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.roadmap;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.roadmap;

-- 5. Créer des policies pour permettre toutes les opérations à tous les utilisateurs
CREATE POLICY "Enable all access for all users" ON public.roadmap
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);

-- 6. Activer RLS
ALTER TABLE public.roadmap ENABLE ROW LEVEL SECURITY;
