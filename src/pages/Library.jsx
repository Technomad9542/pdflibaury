import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, Star, ChevronLeft, ChevronRight, Grid, List, Info, BookOpen } from 'lucide-react';
import PDFDataService from '../utils/pdfDataService.js';
import PDFViewer from '../components/PDFViewer.jsx';
import { isSupabaseConfigured } from '../utils/supabase.js';

const Library = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [allPdfs, setAllPdfs] = useState([]);
  const [categories, setCategories] = useState(['all']);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false);
  
  const itemsPerPage = 12;

  // Fetch data from Supabase on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch all resources
      const resources = await PDFDataService.getAllResources({ sortBy });
      setAllPdfs(resources);

      // Fetch categories
      const categoryData = await PDFDataService.getAllCategories();
      const uniqueCategories = ['all', ...new Set(categoryData.map(cat => cat.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refetch data when filters change
  useEffect(() => {
    if (!isLoading) {
      fetchFilteredData();
    }
  }, [searchTerm, selectedCategory, sortBy]);

  const fetchFilteredData = async () => {
    try {
      const filters = {
        search: searchTerm,
        category: selectedCategory,
        sortBy
      };
      const resources = await PDFDataService.getAllResources(filters);
      setAllPdfs(resources);
    } catch (error) {
      console.error('Error fetching filtered data:', error);
    }
  };

  const handleViewPDF = (pdf) => {
    setSelectedPDF(pdf);
    setIsPDFViewerOpen(true);
  };

  const handleClosePDFViewer = () => {
    setIsPDFViewerOpen(false);
    setSelectedPDF(null);
  };

  const handlePDFResourceChange = (newResource) => {
    setSelectedPDF(newResource);
  };
  // The filtering is already handled by PDFDataService, so we just use the data directly
  const filteredPdfs = allPdfs;
  const sortedPdfs = [...filteredPdfs];

  // Pagination
  const totalPages = Math.ceil(sortedPdfs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPdfs = sortedPdfs.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-400 via-dark-300 to-dark-200 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              PDF Library
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore our vast collection of educational resources and find the perfect PDF for your learning journey.
          </p>
        </motion.div>

        {/* Demo Mode Notification */}
        {!isSupabaseConfigured() && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg backdrop-blur-lg"
          >
            <div className="flex items-center gap-3 text-blue-300">
              <Info className="h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-medium">Demo Mode Active</p>
                <p className="text-sm text-blue-200">
                  You're viewing sample data. To use your own PDFs, configure Supabase in your .env file.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search PDFs by title, author, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-4 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-dark-300 text-white">
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>

              {/* Sort Filter */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              >
                <option value="newest" className="bg-dark-300 text-white">Newest First</option>
                <option value="title" className="bg-dark-300 text-white">Alphabetical</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all duration-300 ${
                  viewMode === 'list'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-gray-400">
            Showing {currentPdfs.length} of {sortedPdfs.length} results
          </div>
        </motion.div>

        {/* PDF Grid/List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
            : "space-y-4 mb-12"
          }
        >
          {currentPdfs.map((pdf, index) => (
            <motion.div
              key={pdf.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300"
            >
              {viewMode === 'grid' ? (
                <>
                  {/* Thumbnail */}
                  <div className="aspect-[3/4] bg-gradient-to-br from-blue-500/20 to-purple-600/20 relative overflow-hidden">
                    {pdf.thumbnail ? (
                      <img 
                        src={pdf.thumbnail} 
                        alt={pdf.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/50">
                        <BookOpen className="h-16 w-16" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    <div className="absolute bottom-4 left-4 right-4 z-20">
                      <div className="text-white text-sm font-medium">
                        {pdf.category}
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                      {pdf.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">{pdf.category} • {pdf.subcategory}</p>
                    
                    {/* Creation Date */}
                    <div className="text-xs text-gray-400 mb-4">
                      <span>Added: {new Date(pdf.created_at).toLocaleDateString()}</span>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleViewPDF(pdf)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const downloadLink = `https://drive.google.com/uc?export=download&id=${pdf.file_link.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1]}`;
                          window.open(downloadLink, '_blank');
                        }}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                      >
                        <Download className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </>
              ) : (
                /* List View */
                <div className="flex gap-6 p-6">
                  <div className="w-24 h-32 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex-shrink-0 overflow-hidden">
                    {pdf.thumbnail ? (
                      <img 
                        src={pdf.thumbnail} 
                        alt={pdf.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/50">
                        <BookOpen className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        {pdf.name}
                      </h3>
                      <div className="text-gray-400 text-sm">
                        {pdf.category}
                      </div>
                    </div>
                    
                    <p className="text-gray-400 mb-2">{pdf.category} • {pdf.subcategory}</p>
                    
                    <div className="text-sm text-gray-400 mb-3">
                      <span>Added: {new Date(pdf.created_at).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-gray-500">
                        {/* Space for future metadata */}
                      </div>
                      
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleViewPDF(pdf)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            const downloadLink = `https://drive.google.com/uc?export=download&id=${pdf.file_link.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1]}`;
                            window.open(downloadLink, '_blank');
                          }}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                        >
                          <Download className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center items-center gap-2"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              const isCurrentPage = page === currentPage;
              const isNearCurrentPage = Math.abs(page - currentPage) <= 2;
              const isFirstOrLast = page === 1 || page === totalPages;
              
              if (!isNearCurrentPage && !isFirstOrLast) {
                if (page === currentPage - 3 || page === currentPage + 3) {
                  return <span key={page} className="text-gray-400">...</span>;
                }
                return null;
              }
              
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isCurrentPage
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center text-white">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg">Loading PDFs...</p>
          </div>
        </div>
      )}

      {/* No Results State */}
      {!isLoading && sortedPdfs.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center text-white">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No PDFs Found</h3>
            <p className="text-gray-400">Try adjusting your search terms or filters</p>
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      <PDFViewer
        isOpen={isPDFViewerOpen}
        onClose={handleClosePDFViewer}
        pdfResource={selectedPDF}
        onResourceChange={handlePDFResourceChange}
      />
    </div>
  );
};

export default Library;