import React from 'react';

interface DesignPaneProps {
  value: string;
  onChange: (value: string) => void;
}

export function DesignPane({ value, onChange }: DesignPaneProps) {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center px-4 py-2 bg-gray-50 border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-700">Design Input</h2>
      </div>
      <div className="flex-1 relative group">
        <textarea
          className="absolute inset-0 w-full h-full p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500/50 transition-all bg-white"
          placeholder="Describe your code design here..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
        />
      </div>
    </div>
  );
}
