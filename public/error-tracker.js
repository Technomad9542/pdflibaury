// Error tracker script
console.log('🔍 Starting error detection...');

// Capture all console errors
const originalError = console.error;
console.error = function(...args) {
  console.log('❌ ERROR DETECTED:', ...args);
  originalError.apply(console, args);
};

// Capture unhandled errors
window.addEventListener('error', (e) => {
  console.log('❌ UNHANDLED ERROR:', e.error);
  console.log('📄 File:', e.filename);
  console.log('📍 Line:', e.lineno, 'Column:', e.colno);
});

// Capture unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
  console.log('❌ UNHANDLED PROMISE REJECTION:', e.reason);
});

console.log('✅ Error tracking active');