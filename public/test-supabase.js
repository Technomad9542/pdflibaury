// Test Supabase Connection
// Run this in your browser console to test the connection

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test the data service
    const { PDFDataService } = await import('./src/utils/pdfDataService.js');
    
    console.log('📊 Fetching stats...');
    const stats = await PDFDataService.getStats();
    console.log('✅ Stats:', stats);
    
    console.log('📚 Fetching resources...');
    const resources = await PDFDataService.getAllResources();
    console.log('✅ Resources found:', resources.length);
    
    console.log('🏷️ Fetching categories...');
    const categories = await PDFDataService.getAllCategories();
    console.log('✅ Categories found:', categories.length);
    
    if (resources.length > 0) {
      console.log('🎉 Supabase connection working perfectly!');
      console.log('📄 Sample resource:', resources[0]);
    } else {
      console.log('⚠️  No resources found. Run the setup SQL script first.');
    }
    
    return { success: true, stats, resources, categories };
    
  } catch (error) {
    console.error('❌ Supabase connection error:', error);
    console.log('🔧 Check your .env file and database setup');
    return { success: false, error: error.message };
  }
}

// Auto-run the test
testSupabaseConnection();