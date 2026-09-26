-- supabase/migrations/0002_policies.sql

CREATE TABLE Policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    version TEXT NOT NULL,
    target_type TEXT NOT NULL,
    jurisdiction TEXT,
    requirements JSONB NOT NULL,
    policy_hash TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
