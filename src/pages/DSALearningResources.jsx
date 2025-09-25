import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, FileText, Users, Zap, BarChart } from 'lucide-react';

const DSALearningResources = () => {
  const navigate = useNavigate();

  const resources = [
    {
      id: 1,
      title: 'Arrays & Strings',
      topics: 25,
      level: 'Beginner',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-700',
      description: 'Master the fundamentals of arrays and strings, including common operations and manipulations.'
    },
    {
      id: 2,
      title: 'Linked Lists',
      topics: 18,
      level: 'Intermediate',
      icon: FileText,
      color: 'from-green-500 to-teal-600',
      description: 'Understand linked list structures, operations, and common interview problems.'
    },
    {
      id: 3,
      title: 'Trees & Graphs',
      topics: 32,
      level: 'Advanced',
      icon: Users,
      color: 'from-purple-500 to-indigo-700',
      description: 'Deep dive into tree and graph data structures, traversal algorithms, and complex problems.'
    },
    {
      id: 4,
      title: 'Dynamic Programming',
      topics: 22,
      level: 'Advanced',
      icon: Zap,
      color: 'from-orange-500 to-red-600',
      description: 'Learn dynamic programming techniques and solve optimization problems efficiently.'
    },
    {
      id: 5,
      title: 'Sorting & Searching',
      topics: 15,
      level: 'Intermediate',
      icon: BarChart,
      color: 'from-yellow-500 to-orange-600',
      description: 'Explore various sorting and searching algorithms and their time/space complexities.'
    },
    {
      id: 6,
      title: 'Hashing',
      topics: 12,
      level: 'Intermediate',
      icon: BookOpen,
      color: 'from-cyan-500 to-blue-600',
      description: 'Master hash tables, collision resolution techniques, and their applications.'
    }
  ];

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'bg-green-500/20 text-green-400';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'Advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-400 via-dark-300 to-dark-200 relative overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-green-500/10 rounded-full"
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
            className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to DSA
          </button>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-400 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                DSA Learning Resources
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive study materials to master Data Structures & Algorithms
            </p>
          </div>
        </motion.div>

        {/* Resources Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative bg-gradient-to-br from-dark-200/50 to-dark-100/50 rounded-2xl overflow-hidden backdrop-blur-lg border border-white/10 cursor-pointer"
              >
                <div className="relative p-6 h-full">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${resource.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{resource.title}</h3>
                  <p className="text-gray-400 mb-4">{resource.description}</p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 text-sm">{resource.topics} topics</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(resource.level)}`}>
                        {resource.level}
                      </span>
                    </div>
                    <ArrowLeft className="h-5 w-5 text-gray-400 rotate-180" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Study Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 bg-dark-200/50 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden"
        >
          <div className="p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white">Recommended Study Plan</h2>
            <p className="text-gray-400">Follow this structured approach to master DSA</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Foundation (2-3 weeks)</h3>
                  <p className="text-gray-400">Start with Arrays, Strings, and basic problem-solving techniques</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Intermediate (3-4 weeks)</h3>
                  <p className="text-gray-400">Move to Linked Lists, Stacks, Queues, and Hashing</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Advanced (4-6 weeks)</h3>
                  <p className="text-gray-400">Master Trees, Graphs, Dynamic Programming, and Greedy Algorithms</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Practice & Review (Ongoing)</h3>
                  <p className="text-gray-400">Solve company-wise questions and participate in coding contests</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DSALearningResources;