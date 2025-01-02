-- Renomme la colonne next_step en description si elle existe
DO $$ 
BEGIN 
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'roadmap' AND column_name = 'next_step'
    ) THEN
        ALTER TABLE roadmap RENAME COLUMN next_step TO description;
    ELSE
        -- Si next_step n'existe pas, crée la colonne description
        ALTER TABLE roadmap ADD COLUMN IF NOT EXISTS description text;
    END IF;
END $$;
