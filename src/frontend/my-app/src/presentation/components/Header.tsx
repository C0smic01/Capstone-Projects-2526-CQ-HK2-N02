import React from 'react';
import { Brain } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <div className={`bg-black/20 backdrop-blur-sm border-b border-cyan-500/20`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg`}>
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-400 bg-clip-text text-transparent">
              C++ Code Analyzer
            </h1>
            <p className="text-cyan-300/70 text-sm">AI Agent với Langchain - 🌊 Ocean Blue</p>
          </div>
        </div>
      </div>
    </div>
  );
};
