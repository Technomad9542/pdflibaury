import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Building, BookOpen } from 'lucide-react';

const DSA = ({ navigateTo }) => {
  const [activeTab, setActiveTab] = useState('company');

  const options = [
    {
      id: 'company',
      icon: Building,
      title: 'Company-wise Questions',
      description: 'Practice coding questions asked by top tech companies',
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'resources',
      icon: BookOpen,
      title: 'Learning Resources',
      description: 'Comprehensive DSA study materials and guides',
      color: 'from-green-500 to-teal-600'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden pt-20">
      {/* Removed duplicate animated background to allow global background to show through */}

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Data Structures & Algorithms
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Master DSA with company-specific questions and comprehensive learning resources
          </p>
        </motion.div>

        {/* Options Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
        >
          {options.map((option, index) => {
            const Icon = option.icon;
            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`group relative bg-gradient-to-br ${option.color} rounded-2xl overflow-hidden cursor-pointer`}
                onClick={() => {
                  if (option.id === 'company') {
                    navigateTo('dsa/company');
                  } else {
                    navigateTo('dsa/resources');
                  }
                }}
              >
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
                <div className="relative p-8 h-full flex flex-col">
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">{option.title}</h3>
                  <p className="text-gray-200 mb-6 flex-grow">{option.description}</p>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-between w-full px-6 py-3 rounded-lg font-medium bg-white text-black hover:bg-gray-100 transition-all duration-300"
                  >
                    <span>Explore</span>
                    <ArrowRight className="h-5 w-5" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default DSA;