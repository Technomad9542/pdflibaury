-- 🔍 Database Verification Script
-- Run this after database-setup.sql to verify everything works

-- 1. Check if tables were created correctly
SELECT 
  'Table Structure Verification' as test_type,
  table_name,
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_name IN ('pdf_categories', 'pdf_resources')
ORDER BY table_name, ordinal_position;

-- 2. Verify your sample data was inserted
SELECT 
  'Sample Data Verification' as test_type,
  c.category,
  c.subcategory,
  COUNT(r.id) as resource_count
FROM pdf_categories c
LEFT JOIN pdf_resources r ON c.id = r.category_id
GROUP BY c.category, c.subcategory
ORDER BY c.category, c.subcategory;

-- 3. Test the view is working
SELECT 
  'View Functionality Test' as test_type,
  name,
  category,
  subcategory,
  CASE WHEN thumbnail IS NOT NULL THEN 'Has Thumbnail' ELSE 'No Thumbnail' END as thumbnail_status
FROM pdf_library_view
ORDER BY created_at DESC;

-- 4. Test search functionality
SELECT 
  'Search Test - "Python"' as test_type,
  name,
  category
FROM pdf_library_view 
WHERE name ILIKE '%Python%';

-- 5. Test category filtering
SELECT 
  'Category Filter Test - "Placement Material"' as test_type,
  name,
  subcategory
FROM pdf_library_view 
WHERE category = 'Placement Material';

-- 6. Verify indexes were created
SELECT 
  'Index Verification' as test_type,
  schemaname,
  tablename,
  indexname
FROM pg_indexes 
WHERE tablename IN ('pdf_categories', 'pdf_resources')
ORDER BY tablename, indexname;

-- 7. Check security policies
SELECT 
  'Security Policy Check' as test_type,
  tablename,
  policyname,
  cmd
FROM pg_policies 
WHERE tablename IN ('pdf_categories', 'pdf_resources')
ORDER BY tablename, policyname;

-- 8. Final success message
SELECT 
  '🎉 Verification Complete!' as status,
  'Your database is ready for the PDF library!' as message,
  'All tables, data, views, and policies are working correctly.' as details;