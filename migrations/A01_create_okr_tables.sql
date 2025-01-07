-- Enable UUID extension if not already enabled
DO $$ 
BEGIN 
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'uuid-ossp extension already exists';
END $$;

-- Start transaction
BEGIN;

-- Safety check: Ensure roadmap table exists and has id column
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'roadmap'
    ) THEN
        RAISE EXCEPTION 'roadmap table does not exist';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'roadmap' 
        AND column_name = 'id'
    ) THEN
        RAISE EXCEPTION 'roadmap table does not have id column';
    END IF;
END $$;

-- Create objectives table if not exists
CREATE TABLE IF NOT EXISTS objectives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) CHECK (status IN ('draft', 'active', 'archived')) DEFAULT 'draft',
    quarter VARCHAR(7) NOT NULL, -- Format: "2025-Q1"
    ai_generated BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create key_results table if not exists
CREATE TABLE IF NOT EXISTS key_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    objective_id UUID REFERENCES objectives(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_value DECIMAL,
    current_value DECIMAL DEFAULT 0,
    unit VARCHAR(50),
    status VARCHAR(20) CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create initiatives table if not exists
CREATE TABLE IF NOT EXISTS initiatives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key_result_id UUID REFERENCES key_results(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) CHECK (status IN ('proposed', 'approved', 'in_progress', 'completed')) DEFAULT 'proposed',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create roadmap_kr_links table if not exists
CREATE TABLE IF NOT EXISTS roadmap_kr_links (
    roadmap_id UUID REFERENCES roadmap(id) ON DELETE CASCADE,
    key_result_id UUID REFERENCES key_results(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (roadmap_id, key_result_id)
);

-- Create ai_generated_okrs table if not exists
CREATE TABLE IF NOT EXISTS ai_generated_okrs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content JSONB NOT NULL,
    validated BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_objectives_quarter ON objectives(quarter);
CREATE INDEX IF NOT EXISTS idx_objectives_status ON objectives(status);
CREATE INDEX IF NOT EXISTS idx_key_results_objective_id ON key_results(objective_id);
CREATE INDEX IF NOT EXISTS idx_key_results_status ON key_results(status);
CREATE INDEX IF NOT EXISTS idx_initiatives_kr_id ON initiatives(key_result_id);
CREATE INDEX IF NOT EXISTS idx_initiatives_status ON initiatives(status);
CREATE INDEX IF NOT EXISTS idx_roadmap_kr_links_roadmap_id ON roadmap_kr_links(roadmap_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_kr_links_kr_id ON roadmap_kr_links(key_result_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_objectives_updated_at
    BEFORE UPDATE ON objectives
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_key_results_updated_at
    BEFORE UPDATE ON key_results
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_initiatives_updated_at
    BEFORE UPDATE ON initiatives
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Commit transaction
COMMIT;

-- Verify tables were created
DO $$ 
BEGIN
    ASSERT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'objectives'), 'objectives table not created';
    ASSERT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'key_results'), 'key_results table not created';
    ASSERT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'initiatives'), 'initiatives table not created';
    ASSERT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'roadmap_kr_links'), 'roadmap_kr_links table not created';
    ASSERT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ai_generated_okrs'), 'ai_generated_okrs table not created';
END $$;
