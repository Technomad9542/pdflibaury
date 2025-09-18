import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Upload, Database, BarChart, Save, AlertCircle } from 'lucide-react';
import AdminDataService from '../utils/adminDataService.js';

const AdminPanel = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('add');
  const [stats, setStats] = useState({ totalCategories: 0, totalResources: 0 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Form data for adding new PDF
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    file_link: '',
    description: '',
    pages: '',
    size: ''
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const statsData = await AdminDataService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPDF = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await AdminDataService.addNewPDF(formData);
      setMessage('✅ PDF added successfully!');
      setFormData({
        name: '',
        category: '',
        subcategory: '',
        file_link: '',
        description: '',
        pages: '',
        size: ''
      });
      loadStats();
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAdd = async () => {
    setLoading(true);
    setMessage('');

    // Example bulk data - you can modify this
    const bulkData = [
      {
        name: 'Advanced JavaScript Concepts',
        category: 'Computer Science',
        subcategory: 'Web Development',
        file_link: 'https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing',
        description: 'Deep dive into advanced JavaScript programming concepts'
      },
      {
        name: 'Data Structures and Algorithms',
        category: 'Computer Science',
        subcategory: 'Programming',
        file_link: 'https://drive.google.com/file/d/YOUR_FILE_ID2/view?usp=sharing',
        description: 'Comprehensive guide to DSA for interviews'
      }
    ];

    try {
      const result = await AdminDataService.bulkAddPDFs(bulkData);
      setMessage(`✅ Bulk add completed: ${result.success} successful, ${result.failed} failed`);
      loadStats();
    } catch (error) {
      setMessage(`❌ Bulk add error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-dark-300 border border-white/20 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <AlertCircle className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Database className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-blue-300 font-medium">Total Categories</p>
                <p className="text-2xl font-bold text-white">{stats.totalCategories}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <BarChart className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-green-300 font-medium">Total PDFs</p>
                <p className="text-2xl font-bold text-white">{stats.totalResources}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'add'
                ? 'bg-blue-500 text-white'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <Plus className="h-4 w-4 inline mr-2" />
            Add PDF
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'bulk'
                ? 'bg-blue-500 text-white'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <Upload className="h-4 w-4 inline mr-2" />
            Bulk Add
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-6 p-4 bg-white/10 border border-white/20 rounded-lg">
            <p className="text-white">{message}</p>
          </div>
        )}

        {/* Add PDF Tab */}
        {activeTab === 'add' && (
          <form onSubmit={handleAddPDF} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  PDF Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Advanced React Patterns"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Google Drive Link *
                </label>
                <input
                  type="url"
                  name="file_link"
                  value={formData.file_link}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://drive.google.com/file/d/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Computer Science"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subcategory *
                </label>
                <input
                  type="text"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Web Development"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Pages (optional)
                </label>
                <input
                  type="number"
                  name="pages"
                  value={formData.pages}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 150"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  File Size (optional)
                </label>
                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 5.2 MB"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of the PDF content..."
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              <Save className="h-5 w-5 inline mr-2" />
              {loading ? 'Adding PDF...' : 'Add PDF'}
            </button>
          </form>
        )}

        {/* Bulk Add Tab */}
        {activeTab === 'bulk' && (
          <div className="space-y-4">
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-300">
                <strong>Note:</strong> Modify the bulk data in the code to add multiple PDFs at once.
                This is useful for initial setup or large imports.
              </p>
            </div>
            <button
              onClick={handleBulkAdd}
              disabled={loading}
              className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              <Upload className="h-5 w-5 inline mr-2" />
              {loading ? 'Processing Bulk Add...' : 'Run Bulk Add'}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AdminPanel;