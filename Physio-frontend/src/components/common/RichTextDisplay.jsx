import React from 'react';
import DOMPurify from 'dompurify';

const RichTextDisplay = ({ content, className = '', style = {} }) => {
  // More comprehensive DOMPurify configuration
  const sanitizedContent = DOMPurify.sanitize(content || '', {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'span', 'div',
      'a', 'font'
    ],
    ALLOWED_ATTR: [
      'style', 'class', 'href', 'target', 'rel',
      'color', 'face', 'size'
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    // Allow all style properties
    ALLOWED_CSS: true,
    // Keep relative URLs
    KEEP_CONTENT: true,
    // Allow data attributes
    ALLOW_DATA_ATTR: true
  });

  // Debug: log the original and sanitized content (remove in production)
  if (process.env.NODE_ENV === 'development' && content && content.includes('color')) {
    console.log('Original content:', content);
    console.log('Sanitized content:', sanitizedContent);
  }

  if (!content || !content.trim()) {
    return (
      <div className={`text-gray-400 italic ${className}`} style={style}>
        No content available
      </div>
    );
  }

  return (
    <div 
      className={`rich-text-content ${className}`}
      style={style}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default RichTextDisplay; 