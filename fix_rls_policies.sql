-- Fix RLS policies for story content to allow anonymous operations
-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to manage story content" ON story_content;

-- Create new policy allowing public management
CREATE POLICY "Allow public management of story content" ON story_content
  FOR ALL USING (true);

-- Also fix photos policies for consistency
DROP POLICY IF EXISTS "Allow authenticated users to manage photos" ON photos;

CREATE POLICY "Allow public management of photos" ON photos
  FOR ALL USING (true);

-- And admin settings
DROP POLICY IF EXISTS "Allow authenticated users to manage admin settings" ON admin_settings;

CREATE POLICY "Allow public management of admin settings" ON admin_settings
  FOR ALL USING (true);
