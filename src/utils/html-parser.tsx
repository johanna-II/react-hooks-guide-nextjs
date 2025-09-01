import React from 'react';

/**
 * Parse HTML string and convert to React elements
 * Only allows safe tags: strong, em, span, br
 */
export function parseHTMLToReact(html: string): React.ReactNode {
  // Simple regex-based HTML parser for specific tags
  const allowedTags = ['strong', 'em', 'span', 'br'];
  
  // Convert HTML entities back to actual characters
  const decodeEntities = (text: string): string => {
    const entities: Record<string, string> = {
      '&lt;': '<',
      '&gt;': '>',
      '&amp;': '&',
      '&quot;': '"',
      '&#39;': "'",
      '&nbsp;': ' '
    };
    
    return text.replace(/&[a-z]+;|&#\d+;/gi, (match) => entities[match] || match);
  };
  
  // Decode entities first
  const decodedHtml = decodeEntities(html);
  
  // Parse HTML into React elements
  const parseNode = (text: string, key: number = 0): React.ReactNode => {
    // Find the first HTML tag
    const tagRegex = /<(\/?)(\w+)([^>]*)>/;
    const match = text.match(tagRegex);
    
    if (!match) {
      // No more tags, return plain text
      return text;
    }
    
    const [fullMatch, isClosing, tagName, attributes] = match;
    const tagIndex = text.indexOf(fullMatch);
    
    // Get text before the tag
    const beforeText = text.slice(0, tagIndex);
    
    // Check if this is an allowed tag
    if (!allowedTags.includes(tagName.toLowerCase())) {
      // Skip this tag and continue parsing
      return parseNode(text.replace(fullMatch, ''), key);
    }
    
    if (isClosing) {
      // This shouldn't happen with proper HTML, skip it
      return parseNode(text.replace(fullMatch, ''), key);
    }
    
    // Find the closing tag
    const closingTag = `</${tagName}>`;
    const closingIndex = text.indexOf(closingTag, tagIndex + fullMatch.length);
    
    if (closingIndex === -1) {
      // No closing tag found, treat as self-closing or skip
      if (tagName === 'br') {
        return (
          <React.Fragment key={key}>
            {beforeText}
            <br />
            {parseNode(text.slice(tagIndex + fullMatch.length), key + 1)}
          </React.Fragment>
        );
      }
      // Skip malformed tag
      return parseNode(text.replace(fullMatch, ''), key);
    }
    
    // Extract content between tags
    const contentStart = tagIndex + fullMatch.length;
    const content = text.slice(contentStart, closingIndex);
    const afterText = text.slice(closingIndex + closingTag.length);
    
    // Parse attributes (simple class extraction)
    let className = '';
    const classMatch = attributes.match(/class=["']([^"']+)["']/);
    if (classMatch) {
      className = classMatch[1];
    }
    
    // Create the element
    const TagComponent = tagName as keyof React.JSX.IntrinsicElements;
    
    return (
      <React.Fragment key={key}>
        {beforeText}
        {React.createElement(
          tagName,
          { className: className || undefined, key: `tag-${key}` },
          parseNode(content, key + 1)
        )}
        {parseNode(afterText, key + 2)}
      </React.Fragment>
    );
  };
  
  const result = parseNode(decodedHtml);
  
  // If result is a string (no HTML tags found), return it as-is
  if (typeof result === 'string') {
    return result;
  }
  
  // Wrap in Fragment if needed
  return <>{result}</>;
}

/**
 * Custom hook to use translated text with HTML
 */
export function useHTMLTranslation() {
  return (text: string): React.ReactNode => {
    return parseHTMLToReact(text);
  };
}

/**
 * Component wrapper for HTML translations
 */
export function HTMLText({ children }: { children: string }) {
  return <>{parseHTMLToReact(children)}</>;
}
