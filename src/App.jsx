import { MemoryRouter } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import Library from './pages/Library';
import Welcome from './pages/Welcome';
import CheatSheets from './pages/CheatSheets';
import MarkdownCheatSheet from './pages/MarkdownCheatSheet';
import DSA from './pages/DSA';
import DSACompanyWise from './pages/DSACompanyWise';
// Import the new DSAResources component instead of the old one
import DSAResources from './pages/DSAResources';
import ProtectedRoute from './components/ProtectedRoute';
import { PDFViewerProvider } from './contexts/PDFViewerContext';
import MouseSpotlight from './components/MouseSpotlight'; // Import the MouseSpotlight component
import './App.css';

function App() {
  // State to hold the current virtual page key
  const [currentPage, setCurrentPage] = useState('home');
  // State to hold parameters for pages that need them (like cheat sheet ID)
  const [pageParams, setPageParams] = useState({});
  
  // Initialize state from localStorage on mount
  useEffect(() => {
    const savedPage = localStorage.getItem('currentPage');
    const savedParams = localStorage.getItem('pageParams');
    if (savedPage) {
      setCurrentPage(savedPage);
    }
    if (savedParams) {
      setPageParams(JSON.parse(savedParams));
    }
  }, []);

  // Update localStorage when currentPage or pageParams changes
  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
    localStorage.setItem('pageParams', JSON.stringify(pageParams));
  }, [currentPage, pageParams]);

  // Function to navigate to a different page
  const navigateTo = (page, params = {}) => {
    setCurrentPage(page);
    setPageParams(params);
  };

  // Get the component to render based on currentPage
  const getCurrentPageComponent = () => {
    switch (currentPage) {
      case 'home':
        return <Home navigateTo={navigateTo} />;
      case 'welcome':
        return (
          <ProtectedRoute>
            <Welcome />
          </ProtectedRoute>
        );
      case 'library':
        return (
          <ProtectedRoute>
            <Library />
          </ProtectedRoute>
        );
      case 'search':
        return (
          <ProtectedRoute>
            <Library />
          </ProtectedRoute>
        );
      case 'cheatsheets':
        return (
          <ProtectedRoute>
            <CheatSheets navigateTo={navigateTo} />
          </ProtectedRoute>
        );
      case 'cheatsheet':
        return (
          <ProtectedRoute>
            <MarkdownCheatSheet 
              currentPage={currentPage} 
              navigateTo={navigateTo} 
              cheatSheetId={pageParams.id} 
            />
          </ProtectedRoute>
        );
      case 'dsa':
        return (
          <ProtectedRoute>
            <DSA navigateTo={navigateTo} />
          </ProtectedRoute>
        );
      case 'dsa/company':
        return (
          <ProtectedRoute>
            <DSACompanyWise navigateTo={navigateTo} />
          </ProtectedRoute>
        );
      case 'dsa/resources':
        return (
          <ProtectedRoute>
            <DSAResources navigateTo={navigateTo} />
          </ProtectedRoute>
        );
      default:
        return <Home navigateTo={navigateTo} />;
    }
  };

  return (
    <MemoryRouter>
      <PDFViewerProvider>
        <div className="App relative">
          {/* Animated Background - Always visible */}
          <div className="fixed inset-0 bg-gradient-to-br from-dark-500 via-dark-400 to-dark-300 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
          </div>

          {/* Mouse Spotlight Effect - Positioned behind content but above background */}
          <MouseSpotlight />
          
          {/* Floating Particles - Always visible */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden -z-5">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
                initial={{
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                  y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                }}
                animate={{
                  y: [null, -50, null],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 4 + 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut"
                }}
                style={{
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 100 + '%',
                }}
              />
            ))}
          </div>

          {/* Pass currentPage and navigateTo function to Header */}
          <Header currentPage={currentPage} navigateTo={navigateTo} />
          
          <main className="relative z-0">
            {getCurrentPageComponent()}
          </main>
        </div>
      </PDFViewerProvider>
    </MemoryRouter>
  );
}

export default App;