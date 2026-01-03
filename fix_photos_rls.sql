-- Fix RLS policies for photos table to allow public read access
-- This ensures the REST API calls to /photos succeed

DROP POLICY IF EXISTS "Allow public read access to photos" ON photos;

CREATE POLICY "Allow public read access to photos"
ON photos FOR SELECT
USING (true);

-- Ensure anon role has permission to select
GRANT SELECT ON photos TO anon;
GRANT SELECT ON photos TO authenticated;
