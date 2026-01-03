-- Check if story content exists
SELECT id, title, is_active, created_at FROM story_content ORDER BY order_index;

-- If no records exist, insert sample data
INSERT INTO story_content (title, content, order_index, is_active, created_by) VALUES
('How We Met', 'Our love story began in the most unexpected way. What started as a chance encounter blossomed into something truly magical. Every moment we spent together revealed new layers of connection and understanding.', 1, true, 'admin'),
('The Proposal', 'After months of planning and anticipation, the moment finally arrived. Surrounded by the beauty of Maui, I asked the most important question of my life. Her smile and joyful "yes" made everything worth it.', 2, true, 'admin'),
('Our Journey', 'From the first date to this beautiful journey we''re on together, every step has been filled with love, laughter, and unforgettable memories. We can''t wait to celebrate with you all!', 3, true, 'admin')
ON CONFLICT DO NOTHING;
