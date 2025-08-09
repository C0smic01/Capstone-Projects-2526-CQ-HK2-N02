import React from 'react';
import { Brain } from 'lucide-react';
import type { Theme, ThemeColors } from '../../assets/theme';

interface HeaderProps {
  theme: Theme;
  themeColors: ThemeColors;
}

export const Header: React.FC<HeaderProps> = ({ theme, themeColors }) => {
  return (
    <div className={`bg-black/20 backdrop-blur-sm border-b ${themeColors.classes.border}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 ${themeColors.classes.button} rounded-lg`}>
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold bg-gradient-to-r from-${theme.primary}-400 to-${theme.primary}-400 bg-clip-text text-transparent`}>
                C++ Code Analyzer
              </h1>
              <p className={`${themeColors.classes.text}/70 text-sm`}>AI Agent với Langchain - {theme.icon} {theme.name}</p>
            </div>
          </div>
        </div>
      </div>
  );
};
