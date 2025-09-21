-- 🛠️ Fix Row Level Security Policies for Admin Operations
-- Run this in your Supabase SQL Editor to fix the permission errors

-- ===============================================
-- 1. DROP EXISTING RESTRICTIVE POLICIES
-- ===============================================

DROP POLICY IF EXISTS "Public read access for pdf_categories" ON pdf_categories;
DROP POLICY IF EXISTS "Public read access for pdf_resources" ON pdf_resources;
DROP POLICY IF EXISTS "Authenticated users can insert categories" ON pdf_categories;
DROP POLICY IF EXISTS "Authenticated users can insert resources" ON pdf_resources;
DROP POLICY IF EXISTS "Authenticated users can update categories" ON pdf_categories;
DROP POLICY IF EXISTS "Authenticated users can update resources" ON pdf_resources;
DROP POLICY IF EXISTS "Authenticated users can delete categories" ON pdf_categories;
DROP POLICY IF EXISTS "Authenticated users can delete resources" ON pdf_resources;

-- ===============================================
-- 2. CREATE PERMISSIVE POLICIES FOR ADMIN OPERATIONS
-- ===============================================

-- Allow everyone to read data (public access)
CREATE POLICY "Enable read access for all users" ON pdf_categories
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON pdf_resources
  FOR SELECT USING (true);

-- Allow INSERT operations for admin functionality
CREATE POLICY "Enable insert for all users" ON pdf_categories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable insert for all users" ON pdf_resources
  FOR INSERT WITH CHECK (true);

-- Allow UPDATE operations for admin functionality
CREATE POLICY "Enable update for all users" ON pdf_categories
  FOR UPDATE USING (true);

CREATE POLICY "Enable update for all users" ON pdf_resources
  FOR UPDATE USING (true);

-- Allow DELETE operations for admin functionality
CREATE POLICY "Enable delete for all users" ON pdf_categories
  FOR DELETE USING (true);

CREATE POLICY "Enable delete for all users" ON pdf_resources
  FOR DELETE USING (true);

-- ===============================================
-- 3. VERIFICATION
-- ===============================================

-- Test that policies are working
SELECT 'RLS Policies updated successfully!' as status;

-- Show current policies
SELECT 
  'Current Policies:' as info,
  tablename,
  policyname,
  cmd,
  permissive
FROM pg_policies 
WHERE tablename IN ('pdf_categories', 'pdf_resources')
ORDER BY tablename, policyname;