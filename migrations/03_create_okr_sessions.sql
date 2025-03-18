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
    session_id UUID REFERENCES okr_sessions(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active',
    priority INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_objectives_session_id ON objectives(session_id);
CREATE INDEX IF NOT EXISTS idx_okr_sessions_vision_id ON okr_sessions(vision_id);

-- Add comments for documentation
COMMENT ON TABLE okr_sessions IS 'Stores OKR sessions, which group objectives for a specific time period';
COMMENT ON TABLE objectives IS 'Stores objectives that belong to an OKR session';

-- Update existing key_results table to reference objectives
ALTER TABLE key_results
    ADD COLUMN IF NOT EXISTS objective_id UUID REFERENCES objectives(id) ON DELETE CASCADE,
    DROP COLUMN IF EXISTS okr_id;

CREATE INDEX IF NOT EXISTS idx_key_results_objective_id ON key_results(objective_id);
