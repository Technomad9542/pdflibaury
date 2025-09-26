import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Home from './pages/Home';
import Library from './pages/Library';
import Welcome from './pages/Welcome';
import CheatSheets from './pages/CheatSheets';
import CheatSheet from './pages/CheatSheet';
import MarkdownCheatSheet from './pages/MarkdownCheatSheet';
import DSA from './pages/DSA';
import DSACompanyWise from './pages/DSACompanyWise';
// Import the new DSAResources component instead of the old one
import DSAResources from './pages/DSAResources';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App relative">
        {/* Animated Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-dark-500 via-dark-400 to-dark-300 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
        </div>

        {/* Floating Particles */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
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

        <Header />
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/welcome" element={
              <ProtectedRoute>
                <Welcome />
              </ProtectedRoute>
            } />
            <Route path="/library" element={
              <ProtectedRoute>
                <Library />
              </ProtectedRoute>
            } />
            <Route path="/search" element={
              <ProtectedRoute>
                <Library />
              </ProtectedRoute>
            } />
            <Route path="/cheatsheets" element={
              <ProtectedRoute>
                <CheatSheets />
              </ProtectedRoute>
            } />
            <Route path="/cheatsheet/:id" element={
              <ProtectedRoute>
                <MarkdownCheatSheet />
              </ProtectedRoute>
            } />
            <Route path="/dsa" element={
              <ProtectedRoute>
                <DSA />
              </ProtectedRoute>
            } />
            <Route path="/dsa/company" element={
              <ProtectedRoute>
                <DSACompanyWise />
              </ProtectedRoute>
            } />
            {/* Use the new DSAResources component instead of DSALearningResources */}
            <Route path="/dsa/resources" element={
              <ProtectedRoute>
                <DSAResources />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;