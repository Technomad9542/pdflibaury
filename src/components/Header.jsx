import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Search, Menu, X, Sparkles, Zap, Settings } from 'lucide-react';
import AdminPanel from './AdminPanel';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/', icon: Sparkles },
    { name: 'Library', path: '/library', icon: BookOpen },
    { name: 'Search', path: '/search', icon: Search },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-dark-300/80 backdrop-blur-lg border-b border-primary-500/20'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center space-x-3"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-75"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                PDFusion
              </h1>
              <p className="text-xs text-gray-400 font-medium">Digital Library</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:flex items-center space-x-8"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className="group relative"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </motion.div>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden md:flex items-center space-x-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAdminOpen(true)}
              className="relative group mr-3"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative px-4 py-2 bg-black rounded-lg leading-none flex items-center space-x-2">
                <Settings className="h-4 w-4 text-green-400" />
                <span className="text-white font-medium">Admin</span>
              </div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative px-6 py-2 bg-black rounded-lg leading-none flex items-center space-x-2">
                <Zap className="h-4 w-4 text-purple-400" />
                <span className="text-white font-medium">Explore</span>
              </div>
            </motion.button>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden relative group p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
            </motion.div>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isMenuOpen ? 'auto' : 0,
            opacity: isMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden bg-dark-300/95 backdrop-blur-lg rounded-lg mt-2 border border-primary-500/20"
        >
          <div className="py-4 space-y-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <motion.div
                  key={item.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-6 py-3 transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border-r-2 border-blue-500'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </motion.div>
              );
            })}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: navItems.length * 0.1 }}
              className="px-6 pt-4 border-t border-gray-700/50"
            >
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                <Zap className="h-4 w-4" />
                <span>Explore PDFs</span>
              </button>
            </motion.div>
          </div>
        </motion.div>
      </nav>
      
      {/* Admin Panel */}
      {isAdminOpen && (
        <AdminPanel onClose={() => setIsAdminOpen(false)} />
      )}
    </motion.header>
  );
};

export default Header;