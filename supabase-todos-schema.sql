-- =====================================================================
-- Planning Board: todos table + seed data
-- Run this AFTER supabase-schema.sql, in the Supabase SQL Editor.
-- Safe to re-run: tables/policies/types use IF NOT EXISTS / DO NOTHING.
-- =====================================================================

-- Custom types
DO $$ BEGIN
  CREATE TYPE todo_category AS ENUM (
    'Ceremony',
    'Photo & Video',
    'Vendors & Setup',
    'Attire',
    'Gifts',
    'Wedding Party',
    'BEO / Catering',
    'Travel & Lodging',
    'Other'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE todo_owner AS ENUM (
    'Francis',
    'Yuwen',
    'Both',
    'Planner',
    'Unassigned'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Table
CREATE TABLE IF NOT EXISTS todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  notes TEXT,
  category todo_category NOT NULL DEFAULT 'Other',
  due_date DATE,
  owner todo_owner DEFAULT 'Unassigned',
  in_progress BOOLEAN DEFAULT false,
  done BOOLEAN DEFAULT false,
  done_by TEXT,
  done_at TIMESTAMP WITH TIME ZONE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_todos_due_date ON todos(due_date);
CREATE INDEX IF NOT EXISTS idx_todos_category ON todos(category);
CREATE INDEX IF NOT EXISTS idx_todos_done ON todos(done);

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- The "secret" is the URL slug at the app layer; anon role gets full CRUD on todos only.
-- (No PII; worst case if DB creds leak, todos are exposed — same risk as photos table.)
DO $$ BEGIN
  CREATE POLICY "Allow public read access to todos" ON todos
    FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public insert of todos" ON todos
    FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public update of todos" ON todos
    FOR UPDATE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public delete of todos" ON todos
    FOR DELETE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Reuse the trigger function from supabase-schema.sql
DROP TRIGGER IF EXISTS update_todos_updated_at ON todos;
CREATE TRIGGER update_todos_updated_at BEFORE UPDATE ON todos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================================
-- Seed: 19 todos extracted from "Due by 05.11.26_To Do List.docx"
-- Default due_date = 2026-05-11 (one month before wedding); adjust per item.
-- =====================================================================

INSERT INTO todos (title, category, due_date, owner, in_progress, order_index, created_by) VALUES
  ('Walk through ceremony program with officiant',                'Ceremony',         '2026-05-11', 'Both',    true,  10,  'seed'),
  ('Choose ceremony & reception music + games',                   'Ceremony',         '2026-05-11', 'Both',    false, 20,  'seed'),
  ('Learn first dance',                                           'Ceremony',         '2026-05-25', 'Both',    false, 30,  'seed'),

  ('Meet with photographers + cinematographers re: shot list',    'Photo & Video',    '2026-05-11', 'Both',    false, 40,  'seed'),

  ('Mock up table setup at rental or florist studio',             'Vendors & Setup',  '2026-05-11', 'Both',    true,  50,  'seed'),
  ('Purchase or rent accessories (refer to Manna''s Item List)',  'Vendors & Setup',  '2026-05-11', 'Both',    false, 60,  'seed'),

  ('Final dress fitting (with shoes + undergarments)',            'Attire',           '2026-05-25', 'Yuwen',   false, 70,  'seed'),
  ('Arrange gown cleaning & preservation',                        'Attire',           '2026-06-15', 'Yuwen',   false, 80,  'seed'),
  ('Purchase wedding rings',                                      'Attire',           '2026-05-11', 'Both',    true,  90,  'seed'),
  ('Order bridal accessories (veil, shoes, undergarments)',       'Attire',           '2026-05-11', 'Yuwen',   true,  100, 'seed'),
  ('Select & order bridesmaids dresses',                          'Attire',           '2026-05-11', 'Yuwen',   true,  110, 'seed'),
  ('Reserve groom + groomsmen attire',                            'Attire',           '2026-05-11', 'Francis', true,  120, 'seed'),

  ('Order wedding favors (for guests)',                           'Gifts',            '2026-05-25', 'Both',    false, 130, 'seed'),
  ('Order gifts for wedding party (bestmen / bestwomen)',         'Gifts',            '2026-05-25', 'Both',    false, 140, 'seed'),

  ('Confirm rehearsal date/location (4pm 06/11/26)',              'Wedding Party',    '2026-05-11', 'Both',    false, 150, 'seed'),
  ('Schedule rehearsal dinner',                                   'Wedding Party',    '2026-05-11', 'Both',    false, 160, 'seed'),

  ('Confirm wedding-party names + phone + email (BEO)',           'BEO / Catering',   '2026-05-11', 'Both',    false, 170, 'seed'),
  ('Confirm final guest count (adults / teens / kids) (BEO)',     'BEO / Catering',   '2026-05-11', 'Both',    false, 180, 'seed'),
  ('Collect entrée selections — combo / veg / kids meal (BEO)',   'BEO / Catering',   '2026-05-11', 'Both',    false, 190, 'seed')
ON CONFLICT DO NOTHING;
