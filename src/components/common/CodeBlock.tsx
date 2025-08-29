import React from 'react';
import { CodeBlockProps } from '@/types/common';

export const CodeBlock: React.FC<CodeBlockProps> = React.memo(({
  code,
  language = 'typescript',
  showLineNumbers = false,
  className = ''
}) => {
  const lines = code.trim().split('\n');
  
  return (
    <div className={`bg-slate-900/50 rounded-lg overflow-hidden ${className}`.trim()}>
      <pre className="overflow-x-auto p-2.5">
        <code className={`language-${language} text-[11px] text-slate-300 font-mono`}>
          {showLineNumbers ? (
            lines.map((line, index) => (
              <div key={index} className="flex">
                <span className="text-slate-600 mr-3 select-none">{index + 1}</span>
                <span>{line}</span>
              </div>
            ))
          ) : (
            code
          )}
        </code>
      </pre>
    </div>
  );
});

CodeBlock.displayName = 'CodeBlock';
