import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Copy, Check, BookOpen } from 'lucide-react';
import cheatSheets from '../cheatsheets';

const CheatSheet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cheatSheet, setCheatSheet] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    const sheet = cheatSheets.find(sheet => sheet.id === id);
    if (sheet) {
      setCheatSheet(sheet);
    } else {
      navigate('/cheatsheets');
    }
  }, [id, navigate]);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(index);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const processMarkdownContent = (content) => {
    // Handle links [text](url)
    content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-indigo-600 hover:underline dark:text-slate-300" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Handle bold **text**
    content = content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Handle italic *text*
    content = content.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    
    // Handle line breaks
    content = content.replace(/\n/g, '<br>');
    
    return content;
  };

  const renderListItems = (listContent) => {
    const items = listContent.split('\n').filter(item => item.trim() !== '' && (item.startsWith('- ') || item.startsWith('* ')));
    return (
      <ul className="my-2 list-disc pl-5 space-y-1">
        {items.map((item, index) => {
          const cleanItem = item.substring(2).trim();
          const processedItem = processMarkdownContent(cleanItem);
          return (
            <li key={index} className="pl-2">
              <span 
                className="dark:text-slate-400" 
                dangerouslySetInnerHTML={{ __html: processedItem }} 
              />
            </li>
          );
        })}
      </ul>
    );
  };

  const formatContent = (content) => {
    // Split content into sections by ##
    const sections = content.split('## ').filter(section => section.trim() !== '');
    
    return sections.map((section, index) => {
      const lines = section.split('\n');
      const title = lines[0];
      const body = lines.slice(1).join('\n');
      
      // Split body into subsections by ###
      const subSections = body.split('### ').filter(sub => sub.trim() !== '');
      
      // Determine grid columns based on number of subsections
      let gridClass = "grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6";
      if (subSections.length === 1) {
        gridClass = "grid grid-cols-1 gap-6";
      } else if (subSections.length === 2) {
        gridClass = "grid grid-cols-1 md:grid-cols-2 gap-6";
      } else if (subSections.length === 3) {
        gridClass = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";
      } else if (subSections.length === 4) {
        gridClass = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6";
      }
      
      return (
        <div key={index} className="h2-wrap mb-12">
          <h2 className="text-3xl font-light mb-6 text-indigo-600 dark:text-slate-300">
            {title}
          </h2>
          
          {/* Responsive grid for subsections - matches reference project styling */}
          <div className={`h3-wrap-list ${gridClass}`}>
            {subSections.map((subSection, subIndex) => {
              const subLines = subSection.split('\n');
              const subTitle = subLines[0];
              const subBody = subLines.slice(1).join('\n');
              
              // Extract code blocks and other content
              const contentParts = subBody.split(/(```[\s\S]*?```)/g);
              
              return (
                <div key={subIndex} className="h3-wrap bg-white pt-6 mb-4 rounded-lg shadow flex flex-col relative overflow-hidden dark:bg-slate-800 dark:text-slate-300">
                  <h3 className="bg-gradient-to-r from-indigo-500 to-purple-600 shadow text-white px-3 py-1 tracking-wider text-xs absolute right-0 top-0 rounded-bl-lg z-10 dark:bg-opacity-70 dark:text-slate-200">
                    {subTitle.replace(/{.*}/, '').trim()}
                  </h3>
                  
                  <div className="section flex flex-col h-full w-full z-0">
                    {contentParts.map((part, partIndex) => {
                      if (part.startsWith('```') && part.endsWith('```')) {
                        // This is a code block
                        const codeLines = part.split('\n');
                        const language = codeLines[0].replace('```', '').trim();
                        const code = codeLines.slice(1, -1).join('\n');
                        const codeIndex = `${index}-${subIndex}-${partIndex}`;
                        
                        return (
                          <div key={partIndex} className="relative">
                            <pre className="bg-gray-800 text-gray-100 p-4 rounded-b-lg overflow-x-auto">
                              <code className="font-mono text-sm">{code}</code>
                            </pre>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(code, codeIndex);
                              }}
                              className="absolute top-2 right-2 p-1 bg-gray-700 hover:bg-gray-600 rounded text-white"
                            >
                              {copiedCode === codeIndex ? (
                                <Check className="h-4 w-4 text-green-400" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        );
                      } else if (part.trim() !== '') {
                        // Check if this is a list
                        const listItems = part.split('\n').filter(line => line.trim().startsWith('- ') || line.trim().startsWith('* '));
                        if (listItems.length > 0) {
                          return (
                            <div key={partIndex} className="bg-gray-50 w-full px-4 py-3 m-0 dark:bg-slate-900/30 dark:text-slate-400">
                              {renderListItems(part)}
                            </div>
                          );
                        }
                        
                        // Handle table formatting
                        if (part.includes('|') && part.includes('---')) {
                          const rows = part.split('\n').filter(row => row.trim() !== '' && !row.includes('---'));
                          const headerRow = rows[0];
                          const dataRows = rows.slice(1);
                          
                          if (headerRow) {
                            const headers = headerRow.split('|').filter(cell => cell.trim() !== '');
                            
                            return (
                              <div key={partIndex} className="overflow-x-auto">
                                <table className="min-w-full bg-gray-50 dark:bg-slate-900/30 mdLayout">
                                  <thead>
                                    <tr className="bg-gray-100 dark:bg-slate-700">
                                      {headers.map((header, headerIndex) => (
                                        <th key={headerIndex} className="px-4 py-2 text-sm font-medium text-left border-b border-gray-200 dark:border-slate-700">
                                          {header.trim()}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {dataRows.map((row, rowIndex) => {
                                      const cells = row.split('|').filter(cell => cell.trim() !== '');
                                      return (
                                        <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-gray-50 dark:bg-slate-900/30"}>
                                          {cells.map((cell, cellIndex) => (
                                            <td key={cellIndex} className="px-4 py-2 text-sm border-b border-gray-200 dark:border-slate-700">
                                              <span 
                                                className="dark:text-slate-400" 
                                                dangerouslySetInnerHTML={{ __html: processMarkdownContent(cell.trim()) }} 
                                              />
                                            </td>
                                          ))}
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            );
                          }
                        }
                        
                        // Handle regular paragraphs
                        const processedPart = processMarkdownContent(part.trim());
                        
                        return (
                          <p key={partIndex} className="bg-gray-50 w-full px-4 py-3 m-0 dark:bg-slate-900/30 dark:text-slate-400" 
                             dangerouslySetInnerHTML={{ __html: processedPart }} />
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  };

  if (!cheatSheet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-400 via-dark-300 to-dark-200 flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col w-full mx-auto items-center text-center my-8"
        >
          <div className="max-w-4xl w-full">
            <button
              onClick={() => navigate('/cheatsheets')}
              className="flex items-center text-gray-300 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Cheat Sheets
            </button>
            
            <h1 className="text-4xl md:text-5xl mb-4">
              <span className="text-slate-700 dark:text-slate-300 font-light">{cheatSheet.title}</span>
              <span className="text-slate-400 dark:text-slate-500 font-extralight hidden md:inline ml-2">cheatsheet</span>
            </h1>
            
            <div className="lg:w-3/5 mx-auto intro leading-relaxed text-slate-600 dark:text-slate-400">
              {cheatSheet.intro.replace('|', '').trim()}
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {cheatSheet.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mdLayout w-full max-w-7xl mx-auto"
          style={{ color: '#345' }}
        >
          {formatContent(cheatSheet.content)}
        </motion.div>
      </div>
    </div>
  );
};

export default CheatSheet;