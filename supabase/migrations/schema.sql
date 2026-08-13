-- =============================================================================
-- CINEOPS AI — SUPABASE PRODUCTION SCHEMA
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. INCIDENTS TABLE (Matches app/api/agent/route.ts)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cineops_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('CRITICAL', 'WARNING', 'INFO')),
    node VARCHAR(100) NOT NULL,
    cause TEXT NOT NULL,
    action TEXT NOT NULL,
    duration VARCHAR(50) NOT NULL DEFAULT '0s',
    saved VARCHAR(50) NOT NULL DEFAULT '$0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 2. INDEXES
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_incidents_created_at ON cineops_incidents (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_incidents_severity ON cineops_incidents (severity);
CREATE INDEX IF NOT EXISTS idx_incidents_node ON cineops_incidents (node);

-- -----------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY (RLS)
-- -----------------------------------------------------------------------------
ALTER TABLE cineops_incidents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to prevent conflict errors
DROP POLICY IF EXISTS "Allow public read access" ON cineops_incidents;
DROP POLICY IF EXISTS "Allow anon & authenticated insert" ON cineops_incidents;
DROP POLICY IF EXISTS "Allow service_role full access" ON cineops_incidents;

-- Create fresh RLS policies
CREATE POLICY "Allow public read access" 
    ON cineops_incidents FOR SELECT 
    TO public 
    USING (true);

CREATE POLICY "Allow anon & authenticated insert" 
    ON cineops_incidents FOR INSERT 
    TO anon, authenticated 
    WITH CHECK (true);

CREATE POLICY "Allow service_role full access" 
    ON cineops_incidents FOR ALL 
    TO service_role 
    USING (true) 
    WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- 4. INITIAL SEED DATA
-- -----------------------------------------------------------------------------
INSERT INTO cineops_incidents (title, severity, node, cause, action, duration, saved)
VALUES 
    (
        'UE5.4 texture streaming pool overflow', 
        'CRITICAL', 
        'Node-04', 
        'TextureStreamingPool reached 16,384MB on Node-04 after a 16K texture burst.', 
        'Clear GPU cache, migrate frames to Node-12, throttle texture mipmaps to 75%.', 
        '1.4s', 
        '$2,840'
    ),
    (
        'GPU thermal throttling on Node-12', 
        'WARNING', 
        'Node-12', 
        'GPU hotspot reached 91°C during the volumetric render pass.', 
        'Reduce render concurrency, migrate queue to Node-19, raise cooling profile.', 
        '2.1s', 
        '$1,200'
    ),
    (
        'Missing asset dependency in Scene 08 / Take 3', 
        'CRITICAL', 
        'Node-04', 
        'Published scene references an unmounted shared asset path.', 
        'Mount asset volume, rehydrate dependency, and re-queue the affected frame range.', 
        '0.8s', 
        '$4,500'
    );
