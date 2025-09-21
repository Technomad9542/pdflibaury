import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Search, Menu, X, Settings, User } from 'lucide-react';
import AdminPanel from './AdminPanel';
import useAuth from '../hooks/useAuth';
import AdminDataService from '../utils/adminDataService';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [isAdminCheckLoading, setIsAdminCheckLoading] = useState(false);
  const location = useLocation();
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const navigate = useNavigate();

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

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/', icon: BookOpen },
    { name: 'Library', path: '/library', icon: BookOpen, protected: true },
    { name: 'Search', path: '/search', icon: Search, protected: true },
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
                    <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                      Login Required
                    </span>
                  </motion.button>
                );
              }
              
              // For regular routes or when user is authenticated
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
                    {item.protected && (
                      <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                        Protected
                      </span>
                    )}
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
            {/* User Authentication Section */}
            {user ? (
              // User is logged in - show user info and logout button
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-lg rounded-lg px-3 py-2">
                  <User className="h-5 w-5 text-blue-400" />
                  <span className="text-white text-sm font-medium">
                    {user.user_metadata?.name || user.email?.split('@')[0] || 'User'}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={signOut}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                  <div className="relative px-4 py-2 bg-black rounded-lg leading-none flex items-center space-x-2">
                    <span className="text-white font-medium">Logout</span>
                  </div>
                </motion.button>
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
                <div className="relative px-6 py-2 bg-black rounded-lg leading-none flex items-center space-x-2">
                  <User className="h-4 w-4 text-purple-400" />
                  <span className="text-white font-medium">Login with Google</span>
                </div>
              </motion.button>
            )}

            {/* Admin Button - Only show if user is admin */}
            {user && isAdminUser && !isAdminCheckLoading && (
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
                      className={`w-full flex items-center space-x-3 px-6 py-3 transition-all duration-200 text-left ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border-r-2 border-blue-500'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                      <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                        Login Required
                      </span>
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
                    {item.protected && (
                      <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                        Protected
                      </span>
                    )}
                  </Link>
                </motion.div>
              );
            })}
            
            {/* Mobile Auth Section */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: navItems.length * 0.1 }}
              className="px-6 pt-4 border-t border-gray-700/50"
            >
              {user ? (
                // User is logged in - show user info and logout button
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-lg rounded-lg px-3 py-2">
                    <User className="h-5 w-5 text-blue-400" />
                    <span className="text-white text-sm font-medium">
                      {user.user_metadata?.name || user.email?.split('@')[0] || 'User'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg font-medium text-white hover:from-red-700 hover:to-orange-700 transition-all duration-200"
                  >
                    <span>Logout</span>
                  </button>
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
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  <User className="h-4 w-4" />
                  <span>Login with Google</span>
                </button>
              )}
              
              {/* Mobile Admin Button - Only show if user is admin */}
              {user && isAdminUser && !isAdminCheckLoading && (
                <button
                  onClick={() => {
                    setIsAdminOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-medium text-white hover:from-green-700 hover:to-emerald-700 transition-all duration-200 mt-3"
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin Panel</span>
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