import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, Star, ChevronLeft, ChevronRight, Grid, List } from 'lucide-react';

const Library = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  const itemsPerPage = 12;

  // Sample PDF data - in a real app, this would come from an API
  const allPdfs = [
    {
      id: 1,
      title: 'Introduction to Machine Learning',
      author: 'Dr. Andrew Ng',
      category: 'Computer Science',
      pages: 245,
      size: '12.5 MB',
      rating: 4.8,
      downloads: 15420,
      description: 'Comprehensive guide to machine learning fundamentals and applications.',
      tags: ['AI', 'ML', 'Python', 'Data Science']
    },
    {
      id: 2,
      title: 'Advanced Calculus and Analysis',
      author: 'Prof. Sarah Johnson',
      category: 'Mathematics',
      pages: 387,
      size: '18.2 MB',
      rating: 4.6,
      downloads: 8930,
      description: 'Deep dive into advanced calculus concepts and mathematical analysis.',
      tags: ['Calculus', 'Analysis', 'Mathematics']
    },
    {
      id: 3,
      title: 'Quantum Physics Fundamentals',
      author: 'Dr. Michael Chen',
      category: 'Physics',
      pages: 456,
      size: '22.1 MB',
      rating: 4.9,
      downloads: 12150,
      description: 'Essential concepts in quantum mechanics and modern physics.',
      tags: ['Quantum', 'Physics', 'Theory']
    },
    {
      id: 4,
      title: 'Software Engineering Principles',
      author: 'Jane Smith',
      category: 'Computer Science',
      pages: 324,
      size: '15.8 MB',
      rating: 4.7,
      downloads: 9876,
      description: 'Best practices and principles for modern software development.',
      tags: ['Software', 'Engineering', 'Programming']
    },
    {
      id: 5,
      title: 'Business Strategy and Innovation',
      author: 'Prof. David Wilson',
      category: 'Business',
      pages: 298,
      size: '11.3 MB',
      rating: 4.5,
      downloads: 7654,
      description: 'Strategic approaches to business innovation and growth.',
      tags: ['Strategy', 'Innovation', 'Business']
    },
    {
      id: 6,
      title: 'Modern Literature Analysis',
      author: 'Dr. Emily Brown',
      category: 'Literature',
      pages: 412,
      size: '16.7 MB',
      rating: 4.4,
      downloads: 5432,
      description: 'Critical analysis of contemporary literary works and themes.',
      tags: ['Literature', 'Analysis', 'Modern']
    },
    {
      id: 7,
      title: 'Data Structures and Algorithms',
      author: 'Prof. Robert Taylor',
      category: 'Computer Science',
      pages: 567,
      size: '25.4 MB',
      rating: 4.9,
      downloads: 18750,
      description: 'Comprehensive guide to fundamental data structures and algorithmic thinking.',
      tags: ['Algorithms', 'Data Structures', 'Programming']
    },
    {
      id: 8,
      title: 'Linear Algebra Essentials',
      author: 'Dr. Maria Garcia',
      category: 'Mathematics',
      pages: 234,
      size: '13.2 MB',
      rating: 4.6,
      downloads: 11250,
      description: 'Essential concepts in linear algebra with practical applications.',
      tags: ['Linear Algebra', 'Mathematics', 'Vectors']
    },
    {
      id: 9,
      title: 'Digital Marketing Strategies',
      author: 'Sarah Adams',
      category: 'Business',
      pages: 289,
      size: '14.5 MB',
      rating: 4.3,
      downloads: 6789,
      description: 'Modern digital marketing techniques and social media strategies.',
      tags: ['Marketing', 'Digital', 'Social Media']
    },
    {
      id: 10,
      title: 'Environmental Science and Sustainability',
      author: 'Dr. Lisa Wang',
      category: 'Environmental Science',
      pages: 356,
      size: '16.9 MB',
      rating: 4.8,
      downloads: 10567,
      description: 'Understanding environmental challenges and sustainable solutions.',
      tags: ['Environment', 'Sustainability', 'Science']
    }
  ];

  const categories = [
    'all',
    'Computer Science',
    'Mathematics',
    'Physics',
    'Engineering',
    'Business',
    'Literature',
    'Environmental Science'
  ];

  // Filter and search PDFs
  const filteredPdfs = allPdfs.filter(pdf => {
    const matchesSearch = pdf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pdf.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pdf.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || pdf.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort PDFs
  const sortedPdfs = [...filteredPdfs].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.id - a.id;
      case 'popular':
        return b.downloads - a.downloads;
      case 'rating':
        return b.rating - a.rating;
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

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
                <option value="popular" className="bg-dark-300 text-white">Most Popular</option>
                <option value="rating" className="bg-dark-300 text-white">Highest Rated</option>
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    <div className="absolute bottom-4 left-4 right-4 z-20">
                      <div className="flex items-center text-yellow-400 mb-2">
                        <Star className="h-4 w-4 fill-current mr-1" />
                        <span className="text-sm font-medium">{pdf.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                      {pdf.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">{pdf.author}</p>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{pdf.description}</p>
                    
                    {/* Metadata */}
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                      <span>{pdf.pages} pages</span>
                      <span>{pdf.size}</span>
                      <span>{pdf.downloads.toLocaleString()} downloads</span>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {pdf.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </>
              ) : (
                /* List View */
                <div className="flex gap-6 p-6">
                  <div className="w-24 h-32 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex-shrink-0" />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        {pdf.title}
                      </h3>
                      <div className="flex items-center text-yellow-400">
                        <Star className="h-4 w-4 fill-current mr-1" />
                        <span className="text-sm font-medium">{pdf.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-400 mb-2">{pdf.author}</p>
                    <p className="text-gray-300 mb-3">{pdf.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <span>{pdf.category}</span>
                      <span>{pdf.pages} pages</span>
                      <span>{pdf.size}</span>
                      <span>{pdf.downloads.toLocaleString()} downloads</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {pdf.tags.slice(0, 4).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                        >
                          <Eye className="h-4 w-4" />
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
    </div>
  );
};

export default Library;