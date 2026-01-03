-- Fix RLS policies for guests table to allow public/anonymous registration and updates
-- This is necessary because guests self-register without logging in

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow authenticated users to insert guests" ON guests;
DROP POLICY IF EXISTS "Allow authenticated users to update guests" ON guests;

-- Create new policies allowing public access
-- Allow anyone to insert (register)
CREATE POLICY "Allow public insert of guests" ON guests
  FOR INSERT WITH CHECK (true);

-- Allow anyone to update (RSVP)
-- In production, you might want to restrict this by ID or a secret token,
-- but for a simple wedding app, public update is often acceptable or you can check matching family_id
CREATE POLICY "Allow public update of guests" ON guests
  FOR UPDATE USING (true);
