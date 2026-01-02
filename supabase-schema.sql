-- Supabase Database Schema for Wedding App
-- Run this in Supabase SQL Editor

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Create custom types
CREATE TYPE rsvp_status AS ENUM ('Pending', 'Attending', 'Declined');
CREATE TYPE accommodation_type AS ENUM ('andaz', 'ac_hotel', 'self');
CREATE TYPE photo_category AS ENUM ('hero', 'couple', 'story', 'gallery');

-- Create guests table
CREATE TABLE IF NOT EXISTS guests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  rsvp_status rsvp_status DEFAULT 'Pending',
  accommodation accommodation_type,
  room_detail TEXT,
  booking_method TEXT,
  meal_choice TEXT,
  dietary_restrictions TEXT,
  plus_one BOOLEAN DEFAULT false,
  plus_one_name TEXT,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create photos table
CREATE TABLE IF NOT EXISTS photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  category photo_category NOT NULL,
  alt_text TEXT,
  caption TEXT,
  order_index INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  uploaded_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create story_content table
CREATE TABLE IF NOT EXISTS story_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_guests_family_id ON guests(family_id);
CREATE INDEX IF NOT EXISTS idx_guests_rsvp_status ON guests(rsvp_status);
CREATE INDEX IF NOT EXISTS idx_guests_email ON guests(email);
CREATE INDEX IF NOT EXISTS idx_photos_category ON photos(category);
CREATE INDEX IF NOT EXISTS idx_photos_order_index ON photos(order_index);
CREATE INDEX IF NOT EXISTS idx_story_content_order_index ON story_content(order_index);
CREATE INDEX IF NOT EXISTS idx_admin_settings_key ON admin_settings(key);

-- Enable Row Level Security
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Guests: Allow anyone to read, but only authenticated users can modify
CREATE POLICY "Allow public read access to guests" ON guests
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert guests" ON guests
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update guests" ON guests
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Photos: Allow anyone to read, authenticated users can modify
CREATE POLICY "Allow public read access to photos" ON photos
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage photos" ON photos
  FOR ALL USING (auth.role() = 'authenticated');

-- Story Content: Allow anyone to read, authenticated users can modify
CREATE POLICY "Allow public read access to story content" ON story_content
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage story content" ON story_content
  FOR ALL USING (auth.role() = 'authenticated');

-- Admin Settings: Only authenticated users can access
CREATE POLICY "Allow authenticated users to manage admin settings" ON admin_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_guests_updated_at BEFORE UPDATE ON guests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_photos_updated_at BEFORE UPDATE ON photos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_story_content_updated_at BEFORE UPDATE ON story_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_settings_updated_at BEFORE UPDATE ON admin_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some initial data
INSERT INTO admin_settings (key, value, description, updated_by) VALUES
('wedding_date', '"2026-06-12"', 'Wedding date in YYYY-MM-DD format', 'system'),
('wedding_location', '"Wailea, Maui"', 'Wedding location', 'system'),
('couple_names', '{"groom": "Xiaodong", "bride": "Yuwen"}', 'Names of the couple', 'system'),
('max_guests', '150', 'Maximum number of guests expected', 'system')
ON CONFLICT (key) DO NOTHING;

-- Insert sample story content
INSERT INTO story_content (title, content, order_index, created_by) VALUES
('How We Met', 'Our love story began in the most unexpected way...', 1, 'system'),
('The Proposal', 'A magical moment that changed everything...', 2, 'system'),
('Our Journey', 'From the first date to forever...', 3, 'system')
ON CONFLICT DO NOTHING;