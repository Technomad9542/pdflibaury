import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Upload, Database, BarChart, Save, AlertCircle, X } from 'lucide-react';
import AdminDataService from '../utils/adminDataService.js';

const AdminPanel = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('add');
  const [stats, setStats] = useState({ totalCategories: 0, totalResources: 0 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [bulkJsonData, setBulkJsonData] = useState('');
  
  // Form data for adding new PDF
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    file_link: ''
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
        file_link: ''
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

    try {
      let dataToProcess;
      
      if (bulkJsonData.trim()) {
        // Use user-provided JSON data
        try {
          dataToProcess = JSON.parse(bulkJsonData);
        } catch (parseError) {
          throw new Error('Invalid JSON format. Please check your JSON syntax.');
        }
      } else {
        // Use example data if no JSON provided
        dataToProcess = [
          {
            "category": "Computer Science",
            "subcategory": "Programming",
            "resources": [
              {
                "name": "Advanced JavaScript Concepts",
                "file_link": "https://drive.google.com/file/d/EXAMPLE_FILE_ID1/view?usp=sharing",
                "thumbnail": "https://lh3.googleusercontent.com/d/EXAMPLE_FILE_ID1=s1024?authuser=0"
              },
              {
                "name": "Data Structures and Algorithms",
                "file_link": "https://drive.google.com/file/d/EXAMPLE_FILE_ID2/view?usp=sharing",
                "thumbnail": "https://lh3.googleusercontent.com/d/EXAMPLE_FILE_ID2=s1024?authuser=0"
              }
            ]
          }
        ];
      }

      // Process the data
      const results = [];
      const errors = [];
      
      for (const categoryGroup of dataToProcess) {
        const { category, subcategory, resources } = categoryGroup;
        
        if (!category || !subcategory || !resources || !Array.isArray(resources)) {
          errors.push({ 
            category: category || 'Unknown', 
            error: 'Invalid category structure. Missing category, subcategory, or resources array.' 
          });
          continue;
        }
        
        for (const resource of resources) {
          try {
            const pdfData = {
              name: resource.name,
              category: category,
              subcategory: subcategory,
              file_link: resource.file_link,
              thumbnail: resource.thumbnail
            };
            
            const result = await AdminDataService.addNewPDF(pdfData);
            results.push(result);
          } catch (error) {
            errors.push({ 
              pdf: resource.name || 'Unknown', 
              error: error.message 
            });
          }
        }
      }
      
      let resultMessage = `✅ Bulk add completed: ${results.length} successful`;
      if (errors.length > 0) {
        resultMessage += `, ${errors.length} failed`;
        console.log('Errors:', errors);
      }
      
      setMessage(resultMessage);
      setBulkJsonData(''); // Clear the textarea on success
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
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X className="h-6 w-6" />
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
          <div className="space-y-6">
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
              <h3 className="text-blue-300 font-medium mb-2">JSON Bulk Import</h3>
              <p className="text-blue-200 text-sm mb-3">
                Paste your JSON data in the format provided. Leave empty to use example data.
              </p>
              <details className="mb-3">
                <summary className="text-blue-300 cursor-pointer text-sm hover:text-blue-200">
                  📄 View Expected JSON Format
                </summary>
                <pre className="mt-2 text-xs text-gray-300 bg-black/30 p-3 rounded overflow-x-auto">
{`[
  {
    "category": "Category Name",
    "subcategory": "Subcategory Name",
    "resources": [
      {
        "name": "PDF Title",
        "file_link": "https://drive.google.com/file/d/FILE_ID/view?usp=sharing",
        "thumbnail": "https://lh3.googleusercontent.com/d/FILE_ID=s1024?authuser=0"
      }
    ]
  }
]`}
                </pre>
              </details>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                JSON Data (optional)
              </label>
              <textarea
                value={bulkJsonData}
                onChange={(e) => setBulkJsonData(e.target.value)}
                rows={12}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder={`Paste your JSON data here, e.g.:
[
  {
    "category": "Computer Science",
    "subcategory": "Programming",
    "resources": [
      {
        "name": "Your PDF Title",
        "file_link": "https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing",
        "thumbnail": "https://lh3.googleusercontent.com/d/YOUR_FILE_ID=s1024?authuser=0"
      }
    ]
  }
]`}
              />
            </div>
            
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-300 text-sm">
                ⚠️ <strong>Note:</strong> If no JSON is provided, example data will be used for demonstration.
                Make sure your Google Drive links are publicly accessible.
              </p>
            </div>
            
            <button
              onClick={handleBulkAdd}
              disabled={loading}
              className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Upload className="h-5 w-5" />
              {loading ? 'Processing Bulk Import...' : 'Import PDFs from JSON'}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AdminPanel;