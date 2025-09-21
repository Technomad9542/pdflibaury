import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Tag, Calendar, User, FolderOpen, ChevronDown, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import cheatSheets from '../cheatsheets';

const CheatSheets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCheatSheets, setFilteredCheatSheets] = useState([]);
  const [groupedCheatSheets, setGroupedCheatSheets] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Group cheat sheets by category
    const grouped = {};
    cheatSheets.forEach(sheet => {
      const category = sheet.categories[0] || 'General';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(sheet);
    });
    
    // Define priority categories that should appear first
    const priorityCategories = ['Programming', 'Python', 'Database'];
    
    // Sort categories - priority categories first, then alphabetically
    const sortedGrouped = {};
    
    // Add priority categories first
    priorityCategories.forEach(category => {
      if (grouped[category]) {
        sortedGrouped[category] = grouped[category];
      }
    });
    
    // Add remaining categories alphabetically
    Object.keys(grouped)
      .sort()
      .forEach(key => {
        if (!priorityCategories.includes(key)) {
          sortedGrouped[key] = grouped[key];
        }
      });
    
    setGroupedCheatSheets(sortedGrouped);
    
    // Filter cheat sheets based on search term and category
    let filtered = cheatSheets;
    
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(sheet => 
        sheet.categories[0] === selectedCategory || sheet.categories.includes(selectedCategory)
      );
    }
    
    if (searchTerm) {
      filtered = filtered.filter(sheet => 
        sheet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sheet.intro.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sheet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        sheet.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredCheatSheets(filtered);
  }, [searchTerm, selectedCategory]);

  const handleCheatSheetClick = (id) => {
    navigate(`/cheatsheet/${id}`);
  };

  // If there's a search term or specific category, show filtered results, otherwise show grouped by category
  const displayGrouped = searchTerm === '' && selectedCategory === 'All Categories';
  const displaySheets = displayGrouped ? 
    Object.entries(groupedCheatSheets).flatMap(([category, sheets]) => 
      sheets.map(sheet => ({ ...sheet, category }))
    ) : 
    filteredCheatSheets;

  // Get all categories for dropdown - priority categories first, then alphabetically
  const priorityCategories = ['Programming', 'Python', 'Database'];
  const otherCategories = Object.keys(groupedCheatSheets)
    .filter(cat => !priorityCategories.includes(cat) && cat !== 'All Categories')
    .sort();
  
  const allCategories = ['All Categories', ...priorityCategories, ...otherCategories];

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowCategoryDropdown(false);
    // Scroll to top when category changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clear category filter
  const clearCategoryFilter = () => {
    setSelectedCategory('All Categories');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-400 via-dark-300 to-dark-200 relative overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-blue-500/10 rounded-full"
              style={{
                width: Math.random() * 8 + 'px',
                height: Math.random() * 8 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Cheat Sheets
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Quick reference guides for developers and learners. Find the most important commands and concepts in one place.
          </p>
        </motion.div>

        {/* Controls Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search cheat sheets..."
                className="block w-full pl-10 pr-3 py-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Category Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="flex items-center justify-between w-full md:w-64 px-4 py-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className="truncate">{selectedCategory}</span>
                <ChevronDown className={`h-5 w-5 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showCategoryDropdown && (
                <div className="absolute z-20 mt-1 w-full md:w-64 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg overflow-hidden">
                  <div className="max-h-60 overflow-y-auto">
                    {allCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategorySelect(category)}
                        className={`block w-full text-left px-4 py-3 text-white hover:bg-white/10 transition-colors ${
                          selectedCategory === category ? 'bg-white/20' : ''
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Active Filters */}
          {selectedCategory !== 'All Categories' && (
            <div className="mt-4 flex flex-wrap gap-2">
              <div className="flex items-center bg-blue-500/20 text-blue-300 rounded-full px-3 py-1 text-sm">
                <span>Category: {selectedCategory}</span>
                <button 
                  onClick={clearCategoryFilter}
                  className="ml-2 hover:bg-blue-500/30 rounded-full p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{cheatSheets.length}</p>
                <p className="text-gray-400">Total Sheets</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
                <Tag className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {new Set(cheatSheets.flatMap(sheet => sheet.tags)).size}
                </p>
                <p className="text-gray-400">Unique Tags</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
                <FolderOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {Object.keys(groupedCheatSheets).length}
                </p>
                <p className="text-gray-400">Categories</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Category Sections or Search Results */}
        {displayGrouped ? (
          Object.entries(groupedCheatSheets).map(([category, sheets], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + categoryIndex * 0.1 }}
              className="mb-16"
            >
              <div className="flex items-center mb-6">
                <FolderOpen className="h-6 w-6 text-blue-400 mr-2" />
                <h2 className="text-2xl font-bold text-white">{category}</h2>
                <span className="ml-3 px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                  {sheets.length} sheets
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {sheets.map((sheet, index) => (
                  <motion.div
                    key={sheet.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.05 }}
                    whileHover={{ y: -5 }}
                    className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 cursor-pointer"
                    onClick={() => handleCheatSheetClick(sheet.id)}
                  >
                    <div className={`${sheet.background} h-2 w-full`}></div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                          {sheet.title}
                        </h3>
                        <BookOpen className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors flex-shrink-0 ml-2" />
                      </div>
                      
                      <p className="text-gray-300 mb-4 text-sm line-clamp-2">
                        {sheet.intro}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {sheet.tags.slice(0, 2).map((tag, tagIndex) => (
                          <span 
                            key={tagIndex} 
                            className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                        {sheet.tags.length > 2 && (
                          <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">
                            +{sheet.tags.length - 2}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>Updated</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))
        ) : (
          /* Search Results or Filtered by Category */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center mb-6">
              <BookOpen className="h-6 w-6 text-blue-400 mr-2" />
              <h2 className="text-2xl font-bold text-white">
                {selectedCategory !== 'All Categories' ? selectedCategory : 'Search Results'}
              </h2>
              <span className="ml-3 px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                {filteredCheatSheets.length} sheets
              </span>
            </div>
            
            {filteredCheatSheets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {filteredCheatSheets.map((sheet, index) => (
                  <motion.div
                    key={sheet.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.05 }}
                    whileHover={{ y: -5 }}
                    className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 cursor-pointer"
                    onClick={() => handleCheatSheetClick(sheet.id)}
                  >
                    <div className={`${sheet.background} h-2 w-full`}></div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                          {sheet.title}
                        </h3>
                        <BookOpen className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors flex-shrink-0 ml-2" />
                      </div>
                      
                      <p className="text-gray-300 mb-4 text-sm line-clamp-2">
                        {sheet.intro}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {sheet.tags.slice(0, 2).map((tag, tagIndex) => (
                          <span 
                            key={tagIndex} 
                            className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                        {sheet.tags.length > 2 && (
                          <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">
                            +{sheet.tags.length - 2}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>Updated</span>
                        </div>
                        <div className="flex items-center">
                          <Tag className="h-3 w-3 mr-1" />
                          <span className="truncate max-w-[80px]">{sheet.categories[0]}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-300">No cheat sheets found matching your search.</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CheatSheets;