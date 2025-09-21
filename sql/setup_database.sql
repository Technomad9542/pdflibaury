-- Create the PDF categories table
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

-- Create the PDF resources table
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

-- Create indexes for better performance
CREATE INDEX idx_pdf_resources_category_id ON pdf_resources(category_id);
CREATE INDEX idx_pdf_resources_name ON pdf_resources(name);
CREATE INDEX idx_pdf_resources_downloads ON pdf_resources(downloads);
CREATE INDEX idx_pdf_resources_rating ON pdf_resources(rating);
CREATE INDEX idx_pdf_resources_created_at ON pdf_resources(created_at);
CREATE INDEX idx_pdf_categories_category ON pdf_categories(category);
CREATE INDEX idx_pdf_resources_tags ON pdf_resources USING GIN(tags);

-- Enable Row Level Security
ALTER TABLE pdf_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdf_resources ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for pdf_categories" ON pdf_categories
  FOR SELECT USING (true);

CREATE POLICY "Public read access for pdf_resources" ON pdf_resources
  FOR SELECT USING (true);