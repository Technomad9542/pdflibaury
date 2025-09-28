import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { BookOpen, Menu, X, Settings, User, ChevronDown } from 'lucide-react';
import AdminPanel from './AdminPanel';
import useAuth from '../hooks/useAuth';
import AdminDataService from '../utils/adminDataService';
import { usePDFViewer } from '../contexts/PDFViewerContext';

const Header = ({ currentPage, navigateTo }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [isAdminCheckLoading, setIsAdminCheckLoading] = useState(false);
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const { isPDFViewerOpen } = usePDFViewer();

  // Check if we should hide navbar on current page
  const shouldHideNavbar = currentPage === 'dsa/resources';

  // Check if user is admin when user state changes
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user?.email) {
        setIsAdminCheckLoading(true);
        try {
          const isAdmin = await AdminDataService.isUserAdmin(user.email);
          setIsAdminUser(isAdmin);
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdminUser(false);
        } finally {
          setIsAdminCheckLoading(false);
        }
      } else {
        setIsAdminUser(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.relative')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Only show Home button when not logged in
  const navItems = user 
    ? [
        { name: 'Home', path: 'home', icon: BookOpen },
        { name: 'Library', path: 'library', icon: BookOpen, protected: true },
        { name: 'Cheat Sheets', path: 'cheatsheets', icon: BookOpen, protected: true },
        { name: 'DSA', path: 'dsa', icon: BookOpen, protected: true },
      ]
    : [
        { name: 'Home', path: 'home', icon: BookOpen }
      ];

  // Don't render navbar on DSA resources page or when PDF viewer is open
  if (shouldHideNavbar || isPDFViewerOpen) {
    return null;
  }

  // Handle navigation
  const handleNavigation = (path) => {
    if ((path === 'cheatsheets' || path === 'dsa') && !user) {
      signInWithGoogle();
      return;
    }
    navigateTo(path);
    setIsMenuOpen(false);
  };

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
        <div className="flex items-center justify-between h-16 tablet:h-20">
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
              <h1 className="text-xl tablet:text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
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
            className="hidden tablet:flex items-center space-x-4"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.path;
              
              // For protected routes, show a button that triggers login if not authenticated
              if (item.protected && !user) {
                return (
                  <motion.button
                    key={item.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={signInWithGoogle}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 text-gray-300 hover:text-white hover:bg-white/5`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </motion.button>
                );
              }
              
              // For regular routes or when user is authenticated
              return (
                <motion.button
                  key={item.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigation(item.path)}
                  className="group relative"
                >
                  <div
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden tablet:flex items-center space-x-2"
          >
            {/* User Authentication Section */}
            {user ? (
              // User is logged in - show user dropdown menu
              <div className="relative">
                <div 
                  className="flex items-center space-x-2 bg-white/5 backdrop-blur-lg rounded-lg px-3 py-2 cursor-pointer hover:bg-white/10 transition-colors"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <User className="h-4 w-4 text-blue-400" />
                  <span className="text-white text-sm font-medium">
                    {user.user_metadata?.name || user.email?.split('@')[0] || 'User'}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </div>
                
                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-dark-300/95 backdrop-blur-lg rounded-lg border border-primary-500/20 shadow-lg z-50"
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                  >
                    <div className="py-2">
                      <button
                        onClick={() => {
                          signOut();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-colors flex items-center space-x-2"
                      >
                        <Settings className="h-4 w-4 text-red-400" />
                        <span>Logout</span>
                      </button>
                      
                      {/* Admin Button - Only show if user is admin */}
                      {user && isAdminUser && !isAdminCheckLoading && (
                        <button
                          onClick={() => {
                            setIsAdminOpen(true);
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-colors border-t border-gray-700/50 mt-2 flex items-center space-x-2"
                        >
                          <Settings className="h-4 w-4 text-green-400" />
                          <span>Admin Panel</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : loading ? (
              // Loading state
              <div className="px-4 py-2 text-white">Loading...</div>
            ) : (
              // User is not logged in - show login button
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={signInWithGoogle}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative px-4 py-1.5 bg-black rounded-lg leading-none flex items-center space-x-1.5">
                  <User className="h-4 w-4 text-purple-400" />
                  <span className="text-white text-sm font-medium">Login</span>
                </div>
              </motion.button>
            )}
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="tablet:hidden relative group p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
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
          className="tablet:hidden overflow-hidden bg-dark-300/95 backdrop-blur-lg rounded-lg mt-2 border border-primary-500/20"
        >
          <div className="py-4 space-y-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = currentPage === item.path;
              
              // For protected routes when not logged in
              if (item.protected && !user) {
                return (
                  <motion.div
                    key={item.name}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <button
                      onClick={() => {
                        signInWithGoogle();
                        setIsMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-2 transition-all duration-200 text-left ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border-r-2 border-blue-500'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                    </button>
                  </motion.div>
                );
              }
              
              // For regular routes or when user is authenticated
              return (
                <motion.div
                  key={item.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center space-x-3 px-4 py-2 transition-all duration-200 text-left ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border-r-2 border-blue-500'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                </motion.div>
              );
            })}
            
            {/* Mobile Auth Section */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: navItems.length * 0.1 }}
              className="px-4 pt-3 border-t border-gray-700/50"
            >
              {user ? (
                // User is logged in - show user info, logout button, and admin button separately
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-lg rounded-lg px-3 py-2">
                    <User className="h-4 w-4 text-blue-400" />
                    <span className="text-white text-sm font-medium">
                      {user.user_metadata?.name || user.email?.split('@')[0] || 'User'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg text-sm font-medium text-white hover:from-red-700 hover:to-orange-700 transition-all duration-200"
                  >
                    <span>Logout</span>
                  </button>
                  
                  {/* Mobile Admin Button - Only show if user is admin */}
                  {user && isAdminUser && !isAdminCheckLoading && (
                    <button
                      onClick={() => {
                        setIsAdminOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg text-sm font-medium text-white hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Admin Panel</span>
                    </button>
                  )}
                </div>
              ) : loading ? (
                // Loading state
                <div className="w-full flex items-center justify-center px-4 py-3 text-white">
                  Loading...
                </div>
              ) : (
                // User is not logged in - show login button
                <button
                  onClick={() => {
                    signInWithGoogle();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-sm font-medium text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </button>
              )}
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