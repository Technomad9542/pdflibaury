# Supabase Database Schema

This document outlines the database schema required for the PDF Library application.

## Tables

### 1. pdf_categories

Stores PDF categories and subcategories.

```sql
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
```

### 2. pdf_resources

Stores individual PDF resources with their metadata.

```sql
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
  tags TEXT[], -- Array of tags
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Indexes

```sql
-- Indexes for better query performance
CREATE INDEX idx_pdf_resources_category_id ON pdf_resources(category_id);
CREATE INDEX idx_pdf_resources_name ON pdf_resources(name);
CREATE INDEX idx_pdf_resources_downloads ON pdf_resources(downloads);
CREATE INDEX idx_pdf_resources_rating ON pdf_resources(rating);
CREATE INDEX idx_pdf_resources_created_at ON pdf_resources(created_at);
CREATE INDEX idx_pdf_categories_category ON pdf_categories(category);
CREATE INDEX idx_pdf_resources_tags ON pdf_resources USING GIN(tags);
```

## Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE pdf_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdf_resources ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY \"Public read access for pdf_categories\" ON pdf_categories
  FOR SELECT USING (true);

CREATE POLICY \"Public read access for pdf_resources\" ON pdf_resources
  FOR SELECT USING (true);
```

## Setup Instructions

1. **Create a new Supabase project** at https://supabase.com
2. **Go to the SQL Editor** in your Supabase dashboard
3. **Execute the above SQL commands** to create the tables and indexes
4. **Update your .env file** with your Supabase URL and anon key:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Data Structure Example

Your JSON data will be transformed to fit this schema:

```json
// Original JSON structure
{
  \"category\": \"Placement Material\",
  \"subcategory\": \"C & DSA Notes\",
  \"resources\": [
    {
      \"name\": \"100 Python Interview Questions\",
      \"file_link\": \"https://drive.google.com/file/d/...\",
      \"thumbnail\": \"https://lh3.googleusercontent.com/...\"
    }
  ]
}

// Will become:
// pdf_categories table:
// id: uuid, category: \"Placement Material\", subcategory: \"C & DSA Notes\"
//
// pdf_resources table:
// id: uuid, category_id: uuid (foreign key), name: \"100 Python Interview Questions\", 
// file_link: \"https://drive.google.com/...\", thumbnail: \"https://lh3.googleusercontent.com/...\"
```

## Features Supported

- ✅ Hierarchical categorization (category → subcategory)
- ✅ Full-text search on name and description
- ✅ Tag-based filtering
- ✅ Sorting by popularity, rating, date, name
- ✅ Download tracking
- ✅ Rating system
- ✅ Pagination support
- ✅ Google Drive link integration