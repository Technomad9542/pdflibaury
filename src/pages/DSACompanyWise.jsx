import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building, BarChart, Clock, Zap, Search } from 'lucide-react';

const DSACompanyWise = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [questionSearchTerm, setQuestionSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsCurrentPage, setQuestionsCurrentPage] = useState(1);
  const companiesPerPage = 9;
  const questionsPerPage = 10;

  // Load company data from the JSON file
  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load data from the public directory (in Vite, public files are served at root)
        const response = await fetch('/src/DSA-comapny-wise-questions/questions-data.json');
        
        if (!response.ok) {
          throw new Error(`Failed to load data: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Extract company names and question counts
        const companyList = data.map(item => ({
          name: item.company,
          questionCount: item["leetcode data"].length,
          data: item["leetcode data"] // Store the actual question data
        })).sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
        
        setCompanies(companyList);
        setLoading(false);
      } catch (error) {
        console.error('Error loading company data:', error);
        setError(`Failed to load company data: ${error.message}`);
        setLoading(false);
      }
    };

    loadCompanyData();
  }, []);

  // Filter companies based on search term
  const filteredCompanies = useMemo(() => {
    return companies.filter(company => 
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [companies, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);
  const startIndex = (currentPage - 1) * companiesPerPage;
  const paginatedCompanies = filteredCompanies.slice(startIndex, startIndex + companiesPerPage);

  // Filter questions based on search term
  const filteredQuestions = useMemo(() => {
    if (!questionSearchTerm) return questions;
    return questions.filter(question => 
      question.Title.toLowerCase().includes(questionSearchTerm.toLowerCase()) ||
      question.Difficulty.toLowerCase().includes(questionSearchTerm.toLowerCase())
    );
  }, [questions, questionSearchTerm]);

  // Pagination logic for questions
  const questionsTotalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const questionsStartIndex = (questionsCurrentPage - 1) * questionsPerPage;
  const paginatedQuestions = filteredQuestions.slice(questionsStartIndex, questionsStartIndex + questionsPerPage);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
    setQuestionsCurrentPage(1);
  }, [searchTerm, questionSearchTerm]);

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    // Use the actual question data from the company object
    setQuestions(company.data || []);
    // Reset question search and pagination when selecting a new company
    setQuestionSearchTerm('');
    setQuestionsCurrentPage(1);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/20 text-green-400';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'Hard': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getFrequencyPercentage = (frequencyStr) => {
    if (frequencyStr && frequencyStr.includes('%')) {
      return parseFloat(frequencyStr.replace('%', ''));
    }
    return 0;
  };

  const getFrequencyColor = (frequencyStr) => {
    const percentage = getFrequencyPercentage(frequencyStr);
    if (percentage >= 75) return 'bg-red-500/20 text-red-400';
    if (percentage >= 50) return 'bg-orange-500/20 text-orange-400';
    if (percentage >= 25) return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-gray-500/20 text-gray-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-400 via-dark-300 to-dark-200 relative overflow-hidden pt-20">
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <h1 className="text-2xl text-white">Loading DSA Company Data...</h1>
            <p className="text-gray-400 mt-2">Please wait while we fetch the latest questions</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-400 via-dark-300 to-dark-200 relative overflow-hidden pt-20">
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl text-red-400 mb-2">Error Loading Data</h1>
            <p className="text-gray-300 max-w-2xl mx-auto mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Retry Loading
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-400 via-dark-300 to-dark-200 relative overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
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

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/dsa')}
            className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to DSA
          </button>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Company-wise DSA Questions
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Practice coding interview questions asked by top tech companies
            </p>
          </div>
        </motion.div>

        {!selectedCompany ? (
          // Company Selection View
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Select a Company</h2>
              <p className="text-gray-400 mb-6">Choose a company to view their frequently asked DSA questions</p>
              
              {/* Search Bar */}
              <div className="max-w-md mx-auto relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search companies..."
                  className="w-full pl-10 pr-4 py-3 bg-dark-200/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <p className="text-gray-500">
                {filteredCompanies.length} of {companies.length} companies available
              </p>
            </div>
            
            {/* Companies Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedCompanies.map((company, index) => (
                <motion.div
                  key={company.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group relative bg-gradient-to-br from-dark-200/50 to-dark-100/50 rounded-2xl overflow-hidden backdrop-blur-lg border border-white/10 cursor-pointer transition-all duration-300 hover:border-blue-500/50"
                  onClick={() => handleCompanySelect(company)}
                >
                  <div className="relative p-6 h-full">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Building className="h-6 w-6 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2">{company.name}</h3>
                    <p className="text-gray-400 mb-4">{company.questionCount} questions</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-blue-400 text-sm font-medium">View Questions</span>
                      <ArrowLeft className="h-5 w-5 text-gray-400 rotate-180 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === 1 
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                      : 'bg-dark-200/50 text-white hover:bg-dark-200'
                  }`}
                >
                  Previous
                </button>
                
                <div className="flex space-x-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    // Only show first, last, current, and nearby pages
                    if (page === 1 || page === totalPages || 
                        (page >= currentPage - 1 && page <= currentPage + 1)) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg ${
                            currentPage === page
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                              : 'bg-dark-200/50 text-white hover:bg-dark-200'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="w-10 h-10 flex items-center justify-center text-gray-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === totalPages 
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                      : 'bg-dark-200/50 text-white hover:bg-dark-200'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          // Questions View
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedCompany.name} DSA Questions</h2>
                <p className="text-gray-400">{filteredQuestions.length} of {questions.length} questions available</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search Bar for Questions */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search questions..."
                    className="pl-10 pr-4 py-2 bg-dark-200/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    value={questionSearchTerm}
                    onChange={(e) => setQuestionSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => setSelectedCompany(null)}
                  className="px-4 py-2 bg-dark-200/50 text-gray-300 hover:text-white rounded-lg transition-colors whitespace-nowrap flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Change Company
                </button>
              </div>
            </div>
            
            <div className="bg-dark-200/50 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-xl font-bold text-white">Coding Questions</h3>
                <p className="text-gray-400">Practice these frequently asked questions</p>
              </div>
              
              {filteredQuestions.length === 0 ? (
                <div className="p-12 text-center">
                  {questionSearchTerm ? (
                    <p className="text-gray-400">No questions match your search criteria.</p>
                  ) : (
                    <p className="text-gray-400">No questions available for this company.</p>
                  )}
                </div>
              ) : (
                <>
                  <div className="divide-y divide-white/10">
                    {paginatedQuestions.map((question, index) => (
                      <motion.div
                        key={questionsStartIndex + index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="p-6 hover:bg-white/5 transition-colors"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <h4 className="text-lg font-semibold text-white">{question.Title}</h4>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getFrequencyColor(question["Frequency %"])}`}>
                                {question["Frequency %"]} Frequency
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(question.Difficulty)}`}>
                                {question.Difficulty}
                              </span>
                              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400">
                                Acceptance: {question["Acceptance %"]}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <div className="text-left sm:text-right">
                              <p className="text-gray-400 text-sm">LeetCode</p>
                              <p className="text-white font-medium text-sm">Problem #{questionsStartIndex + index + 1}</p>
                            </div>
                            <a 
                              href={question.URL} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap flex items-center"
                            >
                              <Zap className="h-4 w-4 mr-1" />
                              Solve Problem
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Questions Pagination */}
                  {questionsTotalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2 mt-8 p-6 border-t border-white/10">
                      <button
                        onClick={() => setQuestionsCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={questionsCurrentPage === 1}
                        className={`px-4 py-2 rounded-lg ${
                          questionsCurrentPage === 1 
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                            : 'bg-dark-200/50 text-white hover:bg-dark-200'
                        }`}
                      >
                        Previous
                      </button>
                      
                      <div className="flex space-x-1">
                        {[...Array(questionsTotalPages)].map((_, i) => {
                          const page = i + 1;
                          // Only show first, last, current, and nearby pages
                          if (page === 1 || page === questionsTotalPages || 
                              (page >= questionsCurrentPage - 1 && page <= questionsCurrentPage + 1)) {
                            return (
                              <button
                                key={page}
                                onClick={() => setQuestionsCurrentPage(page)}
                                className={`w-10 h-10 rounded-lg ${
                                  questionsCurrentPage === page
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                    : 'bg-dark-200/50 text-white hover:bg-dark-200'
                                }`}
                              >
                                {page}
                              </button>
                            );
                          } else if (page === questionsCurrentPage - 2 || page === questionsCurrentPage + 2) {
                            return (
                              <span key={page} className="w-10 h-10 flex items-center justify-center text-gray-500">
                                ...
                              </span>
                            );
                          }
                          return null;
                        })}
                      </div>
                      
                      <button
                        onClick={() => setQuestionsCurrentPage(prev => Math.min(prev + 1, questionsTotalPages))}
                        disabled={questionsCurrentPage === questionsTotalPages}
                        className={`px-4 py-2 rounded-lg ${
                          questionsCurrentPage === questionsTotalPages 
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                            : 'bg-dark-200/50 text-white hover:bg-dark-200'
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DSACompanyWise;