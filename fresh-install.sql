-- 🚀 PDF Library Database Setup (Clean Installation)
-- Run this in your Supabase SQL Editor

-- ===============================================
-- 1. CREATE CORE TABLES
-- ===============================================

-- Create PDF categories table (matches your JSON structure)
CREATE TABLE pdf_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category VARCHAR(255) NOT NULL,
  subcategory VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique category + subcategory combinations
  CONSTRAINT unique_category_subcategory UNIQUE(category, subcategory)
);

-- Create PDF resources table (matches your JSON resources structure)
CREATE TABLE pdf_resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES pdf_categories(id) ON DELETE CASCADE,
  name VARCHAR(500) NOT NULL,
  file_link TEXT NOT NULL,
  thumbnail TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- ===============================================

-- Indexes for faster queries
CREATE INDEX idx_pdf_resources_category_id ON pdf_resources(category_id);
CREATE INDEX idx_pdf_resources_name ON pdf_resources USING gin(to_tsvector('english', name));
CREATE INDEX idx_pdf_resources_created_at ON pdf_resources(created_at DESC);
CREATE INDEX idx_pdf_categories_category ON pdf_categories(category);
CREATE INDEX idx_pdf_categories_subcategory ON pdf_categories(subcategory);

-- ===============================================
-- 3. CREATE VIEW FOR EASY DATA RETRIEVAL
-- ===============================================

CREATE VIEW pdf_library_view AS
SELECT 
  r.id,
  r.name,
  r.file_link,
  r.thumbnail,
  r.created_at,
  r.updated_at,
  c.category,
  c.subcategory,
  c.id as category_id
FROM pdf_resources r
JOIN pdf_categories c ON r.category_id = c.id
ORDER BY r.created_at DESC;

-- ===============================================
-- 4. ENABLE ROW LEVEL SECURITY
-- ===============================================

ALTER TABLE pdf_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdf_resources ENABLE ROW LEVEL SECURITY;

-- ===============================================
-- 5. CREATE SECURITY POLICIES
-- ===============================================

-- Allow everyone to read data (public access)
CREATE POLICY "Public read access for pdf_categories" ON pdf_categories
  FOR SELECT USING (true);

CREATE POLICY "Public read access for pdf_resources" ON pdf_resources
  FOR SELECT USING (true);

-- Allow authenticated users to insert/update data
CREATE POLICY "Authenticated users can insert categories" ON pdf_categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert resources" ON pdf_resources
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update categories" ON pdf_categories
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update resources" ON pdf_resources
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete (optional)
CREATE POLICY "Authenticated users can delete categories" ON pdf_categories
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete resources" ON pdf_resources
  FOR DELETE USING (auth.role() = 'authenticated');

-- ===============================================
-- 6. INSERT YOUR SAMPLE DATA
-- ===============================================

-- Insert categories first (from your JSON structure)
INSERT INTO pdf_categories (category, subcategory) VALUES
('Placement Material', 'C & DSA Notes'),
('Placement Material', 'English')
ON CONFLICT (category, subcategory) DO NOTHING;

-- Insert PDF resources (from your JSON data)
WITH category_lookup AS (
  SELECT id, category, subcategory FROM pdf_categories
)
INSERT INTO pdf_resources (category_id, name, file_link, thumbnail)
SELECT 
  c.id,
  '100 Python Interview Questions',
  'https://drive.google.com/file/d/14M-9ZZmD9oAgE1UprFG7ywLpBi9CBCYV/view?usp=sharing',
  'https://lh3.googleusercontent.com/d/14M-9ZZmD9oAgE1UprFG7ywLpBi9CBCYV=s1024?authuser=0'
FROM category_lookup c 
WHERE c.category = 'Placement Material' AND c.subcategory = 'C & DSA Notes'

UNION ALL

SELECT 
  c.id,
  'C Code for Raspberry Pi (92 pages)',
  'https://drive.google.com/file/d/1jkHSy8VI5u2etxcueN1SbVOpeLkN21l_/view?usp=sharing',
  'https://lh3.googleusercontent.com/d/1jkHSy8VI5u2etxcueN1SbVOpeLkN21l_=s1024?authuser=0'
FROM category_lookup c 
WHERE c.category = 'Placement Material' AND c.subcategory = 'C & DSA Notes'

UNION ALL

SELECT 
  c.id,
  'Word Power Made Easy by Norman Lewis',
  'https://drive.google.com/file/d/19LpQSN46RN_dt65cogaI8b4-6W9yGoVg/view?usp=sharing',
  'https://lh3.googleusercontent.com/d/19LpQSN46RN_dt65cogaI8b4-6W9yGoVg=s1024?authuser=0'
FROM category_lookup c 
WHERE c.category = 'Placement Material' AND c.subcategory = 'English'
ON CONFLICT DO NOTHING;

-- ===============================================
-- 7. CREATE HELPER FUNCTIONS (OPTIONAL)
-- ===============================================

-- Function to get category statistics
CREATE OR REPLACE FUNCTION get_category_stats()
RETURNS TABLE(
  category TEXT,
  subcategory TEXT,
  resource_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.category::TEXT,
    c.subcategory::TEXT,
    COUNT(r.id) as resource_count
  FROM pdf_categories c
  LEFT JOIN pdf_resources r ON c.id = r.category_id
  GROUP BY c.category, c.subcategory
  ORDER BY c.category, c.subcategory;
END;
$$ LANGUAGE plpgsql;

-- Function to search PDFs by name
CREATE OR REPLACE FUNCTION search_pdfs(search_term TEXT)
RETURNS TABLE(
  id UUID,
  name VARCHAR,
  file_link TEXT,
  thumbnail TEXT,
  category TEXT,
  subcategory TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.name,
    r.file_link,
    r.thumbnail,
    c.category::TEXT,
    c.subcategory::TEXT,
    r.created_at
  FROM pdf_resources r
  JOIN pdf_categories c ON r.category_id = c.id
  WHERE r.name ILIKE '%' || search_term || '%'
  ORDER BY r.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- ===============================================
-- 8. UPDATE TIMESTAMP TRIGGERS
-- ===============================================

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at column
CREATE TRIGGER update_pdf_categories_updated_at
  BEFORE UPDATE ON pdf_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pdf_resources_updated_at
  BEFORE UPDATE ON pdf_resources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===============================================
-- 9. SUCCESS MESSAGE & VERIFICATION
-- ===============================================

-- Display success message
SELECT 
  '🎉 Database setup completed successfully!' as status,
  'Tables created: pdf_categories, pdf_resources' as tables,
  'View created: pdf_library_view' as views,
  'Sample data inserted from your JSON' as data,
  'Ready for your PDF library application!' as ready;

-- Show what was created
SELECT 
  'Categories:' as type,
  COUNT(*) as count
FROM pdf_categories

UNION ALL

SELECT 
  'Resources:' as type,
  COUNT(*) as count
FROM pdf_resources;

-- Verify the data structure matches your JSON
SELECT 
  'Verification - Data matches your JSON structure:' as message,
  c.category,
  c.subcategory,
  COUNT(r.id) as resource_count
FROM pdf_categories c
LEFT JOIN pdf_resources r ON c.id = r.category_id
GROUP BY c.category, c.subcategory
ORDER BY c.category, c.subcategory;