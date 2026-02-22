import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import * as Diff from 'diff';
import { Language } from '../types';

interface CodePaneProps {
  code: string;
  previousCode: string;
  language: Language;
  showDiff: boolean;
  isGenerating: boolean;
}

export function CodePane({ code, previousCode, language, showDiff, isGenerating }: CodePaneProps) {
  const renderDiff = () => {
    const diff = Diff.diffLines(previousCode, code);
    
    return (
      <div className="font-mono text-sm whitespace-pre-wrap overflow-auto h-full bg-gray-900 text-gray-300 p-4">
        {diff.map((part, index) => {
          const color = part.added ? 'bg-green-900/50 text-green-300' : part.removed ? 'bg-red-900/50 text-red-300' : 'text-gray-400';
          return (
            <span key={index} className={`block ${color}`}>
              {part.value}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 text-sm font-medium text-gray-700 flex justify-between items-center">
        <span>Generated Code</span>
        {isGenerating && (
          <span className="text-xs text-blue-600 animate-pulse">Generating...</span>
        )}
      </div>
      
      <div className="flex-1 overflow-hidden relative">
        {showDiff ? (
          renderDiff()
        ) : (
          <SyntaxHighlighter
            language={language.toLowerCase()}
            style={vscDarkPlus}
            customStyle={{ margin: 0, height: '100%', borderRadius: 0 }}
            showLineNumbers
          >
            {code || '// No code generated yet.'}
          </SyntaxHighlighter>
        )}
        
        {isGenerating && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 backdrop-blur-sm">
            <div className="bg-white p-4 rounded shadow-lg border border-gray-200 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-gray-700 font-medium">Generating Code...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
