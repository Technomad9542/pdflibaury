console.log('🚀 Testing PDF Library...');

// Test if the app loads properly
try {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', testApp);
  } else {
    testApp();
  }
} catch (error) {
  console.error('❌ Error during testing:', error);
}

function testApp() {
  console.log('✅ DOM is ready');
  
  // Check if React root exists
  const root = document.getElementById('root');
  if (root) {
    console.log('✅ React root element found');
    
    // Check if app content is rendered after a short delay
    setTimeout(() => {
      if (root.children.length > 0) {
        console.log('✅ App content rendered successfully');
        console.log('🎉 PDF Library is working!');
      } else {
        console.log('⚠️  App root is empty - check for JavaScript errors');
      }
    }, 1000);
  } else {
    console.log('❌ React root element not found');
  }
}