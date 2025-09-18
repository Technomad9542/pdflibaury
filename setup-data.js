import { insertSampleData } from './src/data/sampleData.js';

// Function to insert your data - call this after setting up environment variables
async function setupDatabase() {
  console.log('🚀 Starting database setup...');
  
  try {
    const results = await insertSampleData();
    console.log(`✅ Successfully inserted ${results.length} PDF resources!`);
    console.log('📚 Your PDF library is now ready!');
    
    // List the inserted resources
    console.log('\n📋 Inserted resources:');
    results.forEach((resource, index) => {
      console.log(`${index + 1}. ${resource.name}`);
    });
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    console.log('\n🔧 Make sure you have:');
    console.log('1. Updated your .env file with correct Supabase credentials');
    console.log('2. Created the database tables using setup_database.sql');
    console.log('3. Enabled public read access in Supabase');
  }
}

// Run the setup
setupDatabase();