import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Copy, Check } from 'lucide-react';

const MarkdownCheatSheet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cheatSheet, setCheatSheet] = useState(null);
  const [sections, setSections] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    const loadCheatSheet = async () => {
      try {
        // Load the markdown file directly
        const response = await fetch(`/src/markdown-cheatsheets/${id}.md`);
        if (!response.ok) {
          navigate('/cheatsheets');
          return;
        }
        
        const text = await response.text();
        
        // Parse frontmatter and content
        const frontmatterRegex = /^---\n([\s\S]*?)\n---\n/;
        const match = text.match(frontmatterRegex);
        
        let contentText = text;
        const metadata = { id: id };
        
        if (match) {
          const frontmatter = match[1];
          contentText = text.substring(match[0].length);
          
          // Parse frontmatter
          const frontmatterLines = frontmatter.split('\n');
          let currentKey = '';
          
          frontmatterLines.forEach(line => {
            if (line.includes(':') && !line.startsWith('  -')) {
              const [key, ...valueParts] = line.split(':');
              currentKey = key.trim();
              const value = valueParts.join(':').trim();
              if (value) {
                if (currentKey === 'tags') {
                  metadata[currentKey] = value.split(' -').filter(tag => tag.trim()).map(tag => `-${tag.trim()}`);
                } else if (currentKey === 'categories') {
                  metadata[currentKey] = [value];
                } else {
                  metadata[currentKey] = value;
                }
              }
            } else if (line.startsWith('  -') && currentKey === 'tags') {
              const value = line.substring(3).trim();
              if (!metadata[currentKey]) metadata[currentKey] = [];
              metadata[currentKey].push(`-${value}`);
            } else if (line.startsWith('  -') && currentKey === 'categories') {
              const value = line.substring(3).trim();
              if (!metadata[currentKey]) metadata[currentKey] = [];
              metadata[currentKey].push(value);
            }
          });
        }
        
        // Set default title if not in frontmatter
        if (!metadata.title) {
          metadata.title = id.replace(/-/g, ' ');
        }
        
        setCheatSheet(metadata);
        
        // Parse content into sections
        parseContent(contentText);
      } catch (error) {
        console.error('Error loading cheat sheet:', error);
        navigate('/cheatsheets');
      }
    };
    
    loadCheatSheet();
  }, [id, navigate]);

  const parseContent = (content) => {
    // Split content into sections by ##
    const sectionMatches = content.split(/(^##\s.*)/gm).filter(s => s.trim() !== '');
    
    const parsedSections = [];
    let currentSection = null;
    
    sectionMatches.forEach((part, index) => {
      if (part.startsWith('## ')) {
        // This is a section header
        if (currentSection) {
          parsedSections.push(currentSection);
        }
        currentSection = {
          title: part.substring(3).trim(),
          subsections: []
        };
      } else if (currentSection) {
        // This is section content, split by ###
        const subSections = part.split(/(^###\s.*)/gm).filter(s => s.trim() !== '');
        let currentSubSection = null;
        
        subSections.forEach((subPart, subIndex) => {
          if (subPart.startsWith('### ')) {
            // This is a subsection header
            if (currentSubSection) {
              currentSection.subsections.push(currentSubSection);
            }
            currentSubSection = {
              title: subPart.substring(4).trim(),
              content: ''
            };
          } else if (currentSubSection) {
            // This is subsection content
            currentSubSection.content += subPart;
          }
        });
        
        // Don't forget the last subsection
        if (currentSubSection) {
          currentSection.subsections.push(currentSubSection);
        }
      }
    });
    
    // Don't forget the last section
    if (currentSection) {
      parsedSections.push(currentSection);
    }
    
    setSections(parsedSections);
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(index);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const renderContent = (content) => {
    // Split content into parts (code blocks and regular text)
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // This is a code block
        const lines = part.split('\n');
        const language = lines[0].replace('```', '').trim();
        const code = lines.slice(1, -1).join('\n');
        const codeIndex = `${index}`;
        
        return (
          <div key={index} className="relative">
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
        // This is regular text, check for lists and tables
        const lines = part.split('\n').filter(line => line.trim() !== '');
        const renderedLines = [];
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          
          // Check for lists
          if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
            const listItems = [];
            let j = i;
            
            // Collect all consecutive list items
            while (j < lines.length && (lines[j].trim().startsWith('- ') || lines[j].trim().startsWith('* '))) {
              const itemContent = lines[j].substring(2).trim();
              listItems.push(itemContent);
              j++;
            }
            
            renderedLines.push(
              <ul key={`list-${i}`} className="my-2 list-disc pl-5 space-y-1">
                {listItems.map((item, itemIndex) => (
                  <li key={itemIndex} className="pl-2 dark:text-slate-400">
                    {renderInlineMarkdown(item)}
                  </li>
                ))}
              </ul>
            );
            
            i = j - 1; // Skip processed lines
          } 
          // Check for tables
          else if (line.includes('|') && i + 1 < lines.length && lines[i + 1].includes('|') && lines[i + 1].includes('---')) {
            const headerRow = line;
            const separatorRow = lines[i + 1];
            const dataRows = [];
            
            let j = i + 2;
            while (j < lines.length && lines[j].includes('|')) {
              dataRows.push(lines[j]);
              j++;
            }
            
            const headers = headerRow.split('|').filter(cell => cell.trim() !== '');
            
            renderedLines.push(
              <div key={`table-${i}`} className="overflow-x-auto">
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
                            <td key={cellIndex} className="px-4 py-2 text-sm border-b border-gray-200 dark:border-slate-700 dark:text-slate-400">
                              {renderInlineMarkdown(cell.trim())}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
            
            i = j - 1; // Skip processed lines
          } 
          // Regular paragraph
          else if (line.trim() !== '') {
            renderedLines.push(
              <p key={i} className="bg-gray-50 w-full px-4 py-3 m-0 dark:bg-slate-900/30 dark:text-slate-400">
                {renderInlineMarkdown(line)}
              </p>
            );
          }
        }
        
        return renderedLines;
      }
      return null;
    });
  };

  const renderInlineMarkdown = (text) => {
    // Handle links [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = text.split(linkRegex);
    
    return parts.map((part, index) => {
      // Even indices are text, odd indices are link text/url pairs
      if (index % 3 === 1) {
        // This is link text
        return (
          <a 
            key={index} 
            href={parts[index + 1]} 
            className="text-indigo-600 hover:underline dark:text-slate-300"
            target="_blank" 
            rel="noopener noreferrer"
          >
            {part}
          </a>
        );
      } else if (index % 3 === 2) {
        // This is URL, skip as it's already used
        return null;
      } else {
        // This is regular text
        return part;
      }
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
            
            {cheatSheet.intro && (
              <div className="lg:w-3/5 mx-auto intro leading-relaxed text-slate-600 dark:text-slate-400">
                {cheatSheet.intro.replace('|', '').trim()}
              </div>
            )}
            
            {cheatSheet.tags && (
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
            )}
          </div>
        </motion.div>
        
        {/* Content - Using exact styling from reference project */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mdLayout w-full max-w-7xl mx-auto"
          style={{ color: '#345' }}
        >
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="h2-wrap mb-12">
              <h2 className="text-3xl font-light mb-6 text-indigo-600 dark:text-slate-300">
                {section.title}
              </h2>
              
              {/* Responsive grid for subsections - matches reference project styling */}
              <div className="h3-wrap-list grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {section.subsections.map((subsection, subsectionIndex) => (
                  <div key={subsectionIndex} className="h3-wrap bg-white pt-6 mb-4 rounded-lg shadow flex flex-col relative overflow-hidden dark:bg-slate-800 dark:text-slate-300">
                    <h3 className="bg-gradient-to-r from-indigo-500 to-purple-600 shadow text-white px-3 py-1 tracking-wider text-xs absolute right-0 top-0 rounded-bl-lg z-10 dark:bg-opacity-70 dark:text-slate-200">
                      {subsection.title}
                    </h3>
                    
                    <div className="section flex flex-col h-full w-full z-0">
                      {renderContent(subsection.content)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default MarkdownCheatSheet;