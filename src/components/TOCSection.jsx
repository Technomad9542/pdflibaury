import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

const TOCSection = ({ section, activeHeading, expandedSections, handleHeadingClick, toggleSection }) => {
  return (
    <li className="dsa-resources-toc-section">
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
  );
};

export default TOCSection;