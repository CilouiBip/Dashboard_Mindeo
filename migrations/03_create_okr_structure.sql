-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (ATTENTION: Ceci effacera les données existantes)
DROP TABLE IF EXISTS initiatives CASCADE;
DROP TABLE IF EXISTS key_results CASCADE;
DROP TABLE IF EXISTS objectives CASCADE;
DROP TABLE IF EXISTS okr_sessions CASCADE;

-- Create okr_sessions table
CREATE TABLE IF NOT EXISTS okr_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active',
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    vision_id UUID REFERENCES vision(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create objectives table
CREATE TABLE IF NOT EXISTS objectives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES okr_sessions(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active',
    priority INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create key_results table
CREATE TABLE IF NOT EXISTS key_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    objective_id UUID NOT NULL REFERENCES objectives(id) ON DELETE CASCADE,
    kr_name VARCHAR(255) NOT NULL,
    description TEXT,
    target_value DECIMAL NOT NULL,
    baseline_value DECIMAL,
    current DECIMAL DEFAULT 0,
    target_unit VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    start_date TIMESTAMP WITH TIME ZONE,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create initiatives table
CREATE TABLE IF NOT EXISTS initiatives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key_result_id UUID NOT NULL REFERENCES key_results(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'todo',
    priority INTEGER,
    start_date TIMESTAMP WITH TIME ZONE,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_objectives_session_id ON objectives(session_id);
CREATE INDEX IF NOT EXISTS idx_key_results_objective_id ON key_results(objective_id);
CREATE INDEX IF NOT EXISTS idx_initiatives_key_result_id ON initiatives(key_result_id);
CREATE INDEX IF NOT EXISTS idx_okr_sessions_vision_id ON okr_sessions(vision_id);

-- Add table comments
COMMENT ON TABLE okr_sessions IS 'Stores OKR sessions which group objectives for a specific time period';
COMMENT ON TABLE objectives IS 'Stores objectives that belong to an OKR session';
COMMENT ON TABLE key_results IS 'Stores key results that measure progress towards objectives';
COMMENT ON TABLE initiatives IS 'Stores initiatives/tasks that contribute to key results';

-- Add column comments
COMMENT ON COLUMN okr_sessions.vision_id IS 'Reference to the vision this OKR session is working towards';
COMMENT ON COLUMN objectives.session_id IS 'Reference to the parent OKR session';
COMMENT ON COLUMN key_results.objective_id IS 'Reference to the parent objective';
COMMENT ON COLUMN initiatives.key_result_id IS 'Reference to the parent key result';

-- Create enum types for status fields
DO $$ BEGIN
    CREATE TYPE okr_session_status AS ENUM ('active', 'completed', 'archived');
    CREATE TYPE objective_status AS ENUM ('active', 'completed', 'cancelled');
    CREATE TYPE key_result_status AS ENUM ('active', 'completed', 'at_risk');
    CREATE TYPE initiative_status AS ENUM ('todo', 'in_progress', 'done');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_okr_sessions_updated_at
    BEFORE UPDATE ON okr_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

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
