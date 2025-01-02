-- Create roadmap table
CREATE TABLE IF NOT EXISTS roadmap (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    owner TEXT NOT NULL,
    status TEXT NOT NULL,
    due_date DATE,
    priority TEXT NOT NULL DEFAULT 'Medium',
    next_step TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Add row level security (RLS) policies
ALTER TABLE roadmap ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON roadmap
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Grant access to authenticated users
GRANT ALL ON roadmap TO authenticated;
