-- Complete Supabase Database Setup for PDF Library
-- Run this entire script in your Supabase SQL Editor

-- 1. Create the PDF categories table
CREATE TABLE pdf_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category VARCHAR(255) NOT NULL,
  subcategory VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category, subcategory)
);

-- 2. Create the PDF resources table
CREATE TABLE pdf_resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES pdf_categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  file_link TEXT NOT NULL,
  thumbnail TEXT,
  description TEXT,
  pages INTEGER DEFAULT 0,
  size VARCHAR(50),
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0.0,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create indexes for better performance
CREATE INDEX idx_pdf_resources_category_id ON pdf_resources(category_id);
CREATE INDEX idx_pdf_resources_name ON pdf_resources(name);
CREATE INDEX idx_pdf_resources_downloads ON pdf_resources(downloads);
CREATE INDEX idx_pdf_resources_rating ON pdf_resources(rating);
CREATE INDEX idx_pdf_resources_created_at ON pdf_resources(created_at);
CREATE INDEX idx_pdf_categories_category ON pdf_categories(category);
CREATE INDEX idx_pdf_resources_tags ON pdf_resources USING GIN(tags);

-- 4. Enable Row Level Security
ALTER TABLE pdf_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdf_resources ENABLE ROW LEVEL SECURITY;

-- 5. Create policies for public read access
CREATE POLICY "Public read access for pdf_categories" ON pdf_categories
  FOR SELECT USING (true);

CREATE POLICY "Public read access for pdf_resources" ON pdf_resources
  FOR SELECT USING (true);

-- 6. Create policies for authenticated users to insert/update (optional)
CREATE POLICY "Authenticated users can insert categories" ON pdf_categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert resources" ON pdf_resources
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update categories" ON pdf_categories
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update resources" ON pdf_resources
  FOR UPDATE USING (auth.role() = 'authenticated');

-- 7. Insert your initial data
-- First, insert categories
INSERT INTO pdf_categories (category, subcategory, description) VALUES
('Placement Material', 'C & DSA Notes', 'Programming and Data Structures preparation material'),
('Placement Material', 'English', 'English language improvement resources'),
('Computer Science', 'Web Development', 'Modern web development tutorials and guides'),
('Mathematics', 'Calculus', 'Mathematical analysis and calculus resources'),
('Physics', 'Quantum Mechanics', 'Advanced physics and quantum theory'),
('Business', 'Marketing', 'Digital marketing and business strategy');

-- 8. Insert your specific PDF resources
WITH category_data AS (
  SELECT id, category, subcategory FROM pdf_categories
)
INSERT INTO pdf_resources (category_id, name, file_link, thumbnail, description, pages, size, downloads, rating, tags)
SELECT 
  c.id,
  '100 Python Interview Questions',
  'https://drive.google.com/file/d/14M-9ZZmD9oAgE1UprFG7ywLpBi9CBCYV/view?usp=sharing',
  'https://lh3.googleusercontent.com/d/14M-9ZZmD9oAgE1UprFG7ywLpBi9CBCYV=s1024?authuser=0',
  'Comprehensive collection of Python interview questions with detailed answers and explanations.',
  150,
  '5.2 MB',
  5420,
  4.8,
  ARRAY['Python', 'Programming', 'Interview', 'Coding']
FROM category_data c 
WHERE c.category = 'Placement Material' AND c.subcategory = 'C & DSA Notes'

UNION ALL

SELECT 
  c.id,
  'C Code for Raspberry Pi (92 pages)',
  'https://drive.google.com/file/d/1jkHSy8VI5u2etxcueN1SbVOpeLkN21l_/view?usp=sharing',
  'https://lh3.googleusercontent.com/d/1jkHSy8VI5u2etxcueN1SbVOpeLkN21l_=s1024?authuser=0',
  'Complete guide to C programming for Raspberry Pi development with practical examples.',
  92,
  '3.8 MB',
  3210,
  4.6,
  ARRAY['C Programming', 'Raspberry Pi', 'Hardware', 'Embedded']
FROM category_data c 
WHERE c.category = 'Placement Material' AND c.subcategory = 'C & DSA Notes'

UNION ALL

SELECT 
  c.id,
  'Word Power Made Easy by Norman Lewis',
  'https://drive.google.com/file/d/19LpQSN46RN_dt65cogaI8b4-6W9yGoVg/view?usp=sharing',
  'https://lh3.googleusercontent.com/d/19LpQSN46RN_dt65cogaI8b4-6W9yGoVg=s1024?authuser=0',
  'The complete vocabulary builder that will enhance your English communication skills.',
  420,
  '12.5 MB',
  8950,
  4.9,
  ARRAY['English', 'Language', 'Vocabulary', 'Literature']
FROM category_data c 
WHERE c.category = 'Placement Material' AND c.subcategory = 'English';

-- 9. Create a function to automatically generate tags from PDF name
CREATE OR REPLACE FUNCTION generate_tags_from_name(pdf_name TEXT)
RETURNS TEXT[] AS $$
DECLARE
  tags TEXT[] := '{}';
  name_lower TEXT := LOWER(pdf_name);
BEGIN
  -- Add programming language tags
  IF name_lower LIKE '%python%' THEN tags := array_append(tags, 'Python'); END IF;
  IF name_lower LIKE '%javascript%' OR name_lower LIKE '%js%' THEN tags := array_append(tags, 'JavaScript'); END IF;
  IF name_lower LIKE '%react%' THEN tags := array_append(tags, 'React'); END IF;
  IF name_lower LIKE '%node%' THEN tags := array_append(tags, 'Node.js'); END IF;
  IF name_lower LIKE '%java%' AND name_lower NOT LIKE '%javascript%' THEN tags := array_append(tags, 'Java'); END IF;
  IF name_lower LIKE '%c++%' OR name_lower LIKE '%cpp%' THEN tags := array_append(tags, 'C++'); END IF;
  IF name_lower LIKE '%c %' OR name_lower LIKE '%c programming%' THEN tags := array_append(tags, 'C Programming'); END IF;
  
  -- Add subject tags
  IF name_lower LIKE '%math%' OR name_lower LIKE '%calculus%' THEN tags := array_append(tags, 'Mathematics'); END IF;
  IF name_lower LIKE '%physics%' THEN tags := array_append(tags, 'Physics'); END IF;
  IF name_lower LIKE '%english%' OR name_lower LIKE '%vocabulary%' THEN tags := array_append(tags, 'English'); END IF;
  IF name_lower LIKE '%business%' OR name_lower LIKE '%marketing%' THEN tags := array_append(tags, 'Business'); END IF;
  IF name_lower LIKE '%interview%' THEN tags := array_append(tags, 'Interview'); END IF;
  IF name_lower LIKE '%algorithm%' OR name_lower LIKE '%dsa%' THEN tags := array_append(tags, 'Algorithms'); END IF;
  
  -- Add general tags
  IF array_length(tags, 1) IS NULL THEN tags := ARRAY['General', 'Education']; END IF;
  
  RETURN tags;
END;
$$ LANGUAGE plpgsql;

-- 10. Create a trigger to auto-generate tags when inserting new resources
CREATE OR REPLACE FUNCTION auto_generate_tags()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tags IS NULL OR array_length(NEW.tags, 1) IS NULL THEN
    NEW.tags := generate_tags_from_name(NEW.name);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_generate_tags
  BEFORE INSERT OR UPDATE ON pdf_resources
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_tags();

-- 11. Create a view for easy data retrieval
CREATE OR REPLACE VIEW pdf_library_view AS
SELECT 
  r.id,
  r.name,
  r.file_link,
  r.thumbnail,
  r.description,
  r.pages,
  r.size,
  r.downloads,
  r.rating,
  r.tags,
  r.created_at,
  c.category,
  c.subcategory,
  c.description as category_description
FROM pdf_resources r
JOIN pdf_categories c ON r.category_id = c.id
ORDER BY r.created_at DESC;

-- Success message
SELECT 'Database setup completed successfully! You can now use your PDF library.' as status;