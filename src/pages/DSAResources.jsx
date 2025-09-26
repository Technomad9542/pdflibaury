import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, ChevronDown, Menu, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkSlug from 'remark-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import TOCSection from '../components/TOCSection';
import './DSAResources.css';

const DSAResources = () => {
  const navigate = useNavigate();
  const [markdown, setMarkdown] = useState('');
  const [headings, setHeadings] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});
  const [activeHeading, setActiveHeading] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [visibleHeadings, setVisibleHeadings] = useState([]); // For lazy loading TOC items

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
    
    // Set initial visible headings for lazy loading
    setVisibleHeadings(headings.slice(0, 20)); // Load first 20 headings initially
  };

  // Lazy load more headings as user scrolls through TOC
  const loadMoreHeadings = () => {
    if (visibleHeadings.length < headings.length) {
      const nextIndex = visibleHeadings.length;
      const nextHeadings = headings.slice(nextIndex, nextIndex + 10);
      setVisibleHeadings(prev => [...prev, ...nextHeadings]);
    }
  };

  // Group headings by their parent sections for collapsible sidebar
  const groupedHeadings = useMemo(() => {
    const groups = [];
    let currentGroup = null;

    visibleHeadings.forEach(heading => {
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
  }, [visibleHeadings]);

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

  // Lazy load markdown content in chunks
  const [markdownChunks, setMarkdownChunks] = useState([]);
  const [loadedChunks, setLoadedChunks] = useState(0);

  useEffect(() => {
    if (markdown) {
      // Split markdown into chunks for lazy loading
      const chunkSize = 5000; // characters per chunk
      const chunks = [];
      for (let i = 0; i < markdown.length; i += chunkSize) {
        chunks.push(markdown.slice(i, i + chunkSize));
      }
      setMarkdownChunks(chunks);
      setLoadedChunks(Math.min(3, chunks.length)); // Load first 3 chunks initially
    }
  }, [markdown]);

  // Load more chunks as user scrolls
  const loadMoreChunks = () => {
    if (loadedChunks < markdownChunks.length) {
      setLoadedChunks(prev => Math.min(prev + 2, markdownChunks.length));
    }
  };

  // Handle scroll for lazy loading more content
  useEffect(() => {
    const handleMarkdownScroll = () => {
      const markdownContainer = document.querySelector('.dsa-resources-markdown');
      if (markdownContainer) {
        const { scrollTop, scrollHeight, clientHeight } = markdownContainer;
        const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
        
        // Load more content when user scrolls 70% of the way down
        if (scrollPercentage > 70) {
          loadMoreChunks();
          loadMoreHeadings();
        }
      }
    };

    const markdownContainer = document.querySelector('.dsa-resources-markdown');
    if (markdownContainer) {
      markdownContainer.addEventListener('scroll', handleMarkdownScroll);
      return () => markdownContainer.removeEventListener('scroll', handleMarkdownScroll);
    }
  }, [loadedChunks, markdownChunks.length]);

  return (
    <div className="dsa-resources-page">
      <div className="dsa-resources-container">
        {/* Header - Simplified */}
        <div className="dsa-resources-header">
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

        <div className="dsa-resources-content-wrapper">
          <div className="dsa-resources-content">
            {/* Mobile/Tablet TOC Drawer */}
            <div className={`dsa-resources-mobile-toc-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
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
                    <TOCSection
                      key={section.id}
                      section={section}
                      activeHeading={activeHeading}
                      expandedSections={expandedSections}
                      handleHeadingClick={handleHeadingClick}
                      toggleSection={toggleSection}
                    />
                  ))}
                </ul>
              </div>
            </div>

            {/* Desktop Sidebar Table of Contents */}
            <div className="dsa-resources-sidebar">
              <div className="dsa-resources-sidebar-header">
                <h2 className="dsa-resources-sidebar-title">Table of Contents</h2>
              </div>
              <div className="dsa-resources-toc-container">
                <ul className="dsa-resources-toc">
                  {groupedHeadings.map((section) => (
                    <TOCSection
                      key={section.id}
                      section={section}
                      activeHeading={activeHeading}
                      expandedSections={expandedSections}
                      handleHeadingClick={handleHeadingClick}
                      toggleSection={toggleSection}
                    />
                  ))}
                </ul>
              </div>
            </div>

            {/* Main Content */}
            <div className="dsa-resources-main">
              <div className="dsa-resources-markdown">
                {markdownChunks.slice(0, loadedChunks).map((chunk, index) => (
                  <ReactMarkdown
                    key={index}
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
                    {chunk}
                  </ReactMarkdown>
                ))}
                
                {/* Loading indicator for more content */}
                {loadedChunks < markdownChunks.length && (
                  <div className="loading-more-content">
                    <p>Loading more content...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSAResources;