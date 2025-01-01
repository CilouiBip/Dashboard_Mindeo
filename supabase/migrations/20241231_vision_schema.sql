-- Ensure vision table has all required columns
DO $$ 
BEGIN 
    -- Check if vision table exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_name = 'vision'
    ) THEN 
        CREATE TABLE vision (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            vision_text TEXT NOT NULL,
            current_revenue TEXT NOT NULL,
            target_revenue TEXT NOT NULL,
            main_product TEXT NOT NULL,
            main_challenges TEXT,
            context TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
        );
    END IF;

    -- Add context column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'vision' 
        AND column_name = 'context'
    ) THEN 
        ALTER TABLE vision ADD COLUMN context TEXT;
    END IF;
END $$;
