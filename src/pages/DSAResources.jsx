import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, ChevronDown, Menu, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkSlug from 'remark-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import './DSAResources.css';

const DSAResources = () => {
  const navigate = useNavigate();
  const [markdown, setMarkdown] = useState('');
  const [headings, setHeadings] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});
  const [activeHeading, setActiveHeading] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Fetch the markdown file from the correct path in public folder
    fetch('/src/ds-res/das-resource.md')
      .then(response => response.text())
      .then(text => {
        setMarkdown(text);
        // Extract headings for the sidebar
        extractHeadings(text);
      })
      .catch(error => {
        console.error('Error loading markdown file:', error);
      });
  }, []);

  const extractHeadings = (text) => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings = [];
    let match;

    while ((match = headingRegex.exec(text)) !== null) {
      const level = match[1].length;
      // Remove markdown formatting like **bold** and *italic*
      const title = match[2]
        .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove bold
        .replace(/\*(.*?)\*/g, '$1')      // Remove italic
        .replace(/\[(.*?)\]\(.*?\)/g, '$1'); // Remove links but keep text
      
      // Generate a clean ID for the heading
      const id = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')  // Remove special characters
        .replace(/\s+/g, '-')      // Replace spaces with hyphens
        .replace(/-+/g, '-');      // Replace multiple hyphens with single

      headings.push({
        id,
        title,
        level
      });
    }

    setHeadings(headings);
    
    // Expand all top-level sections by default
    const initialExpanded = {};
    headings.forEach(heading => {
      if (heading.level <= 2) {
        initialExpanded[heading.id] = true;
      }
    });
    setExpandedSections(initialExpanded);
  };

  // Group headings by their parent sections for collapsible sidebar
  const groupedHeadings = useMemo(() => {
    const groups = [];
    let currentGroup = null;

    headings.forEach(heading => {
      if (heading.level === 1) {
        // New top-level section
        currentGroup = {
          ...heading,
          children: []
        };
        groups.push(currentGroup);
      } else if (currentGroup && heading.level > 1) {
        // Add as child to current group
        currentGroup.children.push(heading);
      }
    });

    return groups;
  }, [headings]);

  const toggleSection = (id) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleHeadingClick = (id) => {
    setActiveHeading(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      
      // Update active heading after scroll
      setTimeout(() => {
        setActiveHeading(id);
        setIsMobileMenuOpen(false); // Close mobile menu when clicking a link
      }, 100);
    }
  };

  // Handle scroll to highlight active section in sidebar
  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let currentHeading = '';
      
      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
          currentHeading = heading.id;
          break;
        }
      }
      
      if (currentHeading && currentHeading !== activeHeading) {
        setActiveHeading(currentHeading);
      }
    };

    const markdownContainer = document.querySelector('.dsa-resources-markdown');
    if (markdownContainer) {
      markdownContainer.addEventListener('scroll', handleScroll);
      return () => markdownContainer.removeEventListener('scroll', handleScroll);
    }
  }, [activeHeading]);

  return (
    <div className="dsa-resources-page">
      <div className="dsa-resources-container">
        {/* Header - Simplified */}
        <div className="dsa-resources-header">
          <div className="dsa-resources-title-container">
            <div className="dsa-resources-header-controls">
              {/* Mobile menu button */}
              <button
                className="dsa-resources-mobile-menu-button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              {/* Back button */}
              <button
                onClick={() => navigate('/dsa')}
                className="dsa-resources-back-button"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to DSA
              </button>
            </div>
          </div>
        </div>

        <div className="dsa-resources-content-wrapper">
          <div className="dsa-resources-content">
            {/* Mobile Table of Contents Menu */}
            {isMobileMenuOpen && (
              <div className="dsa-resources-mobile-toc-overlay">
                <div className="dsa-resources-mobile-toc-menu">
                  <div className="dsa-resources-mobile-toc-header">
                    <h2 className="dsa-resources-sidebar-title">Table of Contents</h2>
                    <button
                      className="dsa-resources-mobile-toc-close"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <div className="dsa-resources-toc-container">
                    <ul className="dsa-resources-toc">
                      {groupedHeadings.map((section) => (
                        <li key={section.id} className="dsa-resources-toc-section">
                          <div className="dsa-resources-toc-section-header">
                            <button
                              onClick={() => handleHeadingClick(section.id)}
                              className={`dsa-resources-toc-link level-1 ${activeHeading === section.id ? 'active' : ''}`}
                            >
                              {section.title}
                            </button>
                            {section.children.length > 0 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSection(section.id);
                                }}
                                className="dsa-resources-collapse-toggle"
                              >
                                {expandedSections[section.id] ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </button>
                            )}
                          </div>
                          
                          {section.children.length > 0 && expandedSections[section.id] && (
                            <ul className="dsa-resources-toc-subitems">
                              {section.children.map((heading) => (
                                <li 
                                  key={heading.id} 
                                  className={`dsa-resources-toc-item level-${heading.level}`}
                                  style={{ paddingLeft: `${(heading.level - 2) * 15}px` }}
                                >
                                  <button
                                    onClick={() => handleHeadingClick(heading.id)}
                                    className={`dsa-resources-toc-link level-${heading.level} ${activeHeading === heading.id ? 'active' : ''}`}
                                  >
                                    {heading.title}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Desktop Sidebar Table of Contents */}
            <div className="dsa-resources-sidebar">
              <div className="dsa-resources-sidebar-header">
                <h2 className="dsa-resources-sidebar-title">Table of Contents</h2>
              </div>
              <div className="dsa-resources-toc-container">
                <ul className="dsa-resources-toc">
                  {groupedHeadings.map((section) => (
                    <li key={section.id} className="dsa-resources-toc-section">
                      <div className="dsa-resources-toc-section-header">
                        <button
                          onClick={() => handleHeadingClick(section.id)}
                          className={`dsa-resources-toc-link level-1 ${activeHeading === section.id ? 'active' : ''}`}
                        >
                          {section.title}
                        </button>
                        {section.children.length > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSection(section.id);
                            }}
                            className="dsa-resources-collapse-toggle"
                          >
                            {expandedSections[section.id] ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>
                      
                      {section.children.length > 0 && expandedSections[section.id] && (
                        <ul className="dsa-resources-toc-subitems">
                          {section.children.map((heading) => (
                            <li 
                              key={heading.id} 
                              className={`dsa-resources-toc-item level-${heading.level}`}
                              style={{ paddingLeft: `${(heading.level - 2) * 15}px` }}
                            >
                              <button
                                onClick={() => handleHeadingClick(heading.id)}
                                className={`dsa-resources-toc-link level-${heading.level} ${activeHeading === heading.id ? 'active' : ''}`}
                              >
                                {heading.title}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Main Content */}
            <div className="dsa-resources-main">
              <div className="dsa-resources-markdown">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkSlug]}
                  rehypePlugins={[rehypeAutolinkHeadings]}
                  components={{
                    h1: ({ node, ...props }) => <h1 className="dsa-resources-heading-1" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="dsa-resources-heading-2" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="dsa-resources-heading-3" {...props} />,
                    h4: ({ node, ...props }) => <h4 className="dsa-resources-heading-4" {...props} />,
                    h5: ({ node, ...props }) => <h5 className="dsa-resources-heading-5" {...props} />,
                    h6: ({ node, ...props }) => <h6 className="dsa-resources-heading-6" {...props} />,
                    p: ({ node, ...props }) => <p className="dsa-resources-paragraph" {...props} />,
                    a: ({ node, ...props }) => <a className="dsa-resources-link" {...props} />,
                    ul: ({ node, ...props }) => <ul className="dsa-resources-list" {...props} />,
                    ol: ({ node, ...props }) => <ol className="dsa-resources-list ordered" {...props} />,
                    li: ({ node, ...props }) => <li className="dsa-resources-list-item" {...props} />,
                    blockquote: ({ node, ...props }) => <blockquote className="dsa-resources-blockquote" {...props} />,
                    code: ({ node, ...props }) => <code className="dsa-resources-code" {...props} />,
                    pre: ({ node, ...props }) => <pre className="dsa-resources-pre" {...props} />,
                    table: ({ node, ...props }) => <table className="dsa-resources-table" {...props} />,
                    th: ({ node, ...props }) => <th className="dsa-resources-table-header" {...props} />,
                    td: ({ node, ...props }) => <td className="dsa-resources-table-cell" {...props} />,
                  }}
                >
                  {markdown}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSAResources;