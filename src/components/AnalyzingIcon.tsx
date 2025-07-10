
import React from 'react';
import { Brain, Sparkles } from 'lucide-react';

interface AnalyzingIconProps {
  isAnalyzing: boolean;
}

const AnalyzingIcon: React.FC<AnalyzingIconProps> = ({ isAnalyzing }) => {
  if (!isAnalyzing) return null;

  return (
    <div className="flex items-center justify-center py-8">
      <div className="relative">
        {/* Outer pulsing ring */}
        <div className="absolute inset-0 w-20 h-20 bg-blue-200 rounded-full animate-ping opacity-75"></div>
        
        {/* Middle rotating ring */}
        <div className="absolute inset-2 w-16 h-16 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
        
        {/* Inner brain icon with sparkles */}
        <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
          <Brain className="w-8 h-8 text-white animate-pulse" />
          <Sparkles className="w-4 h-4 text-yellow-300 absolute top-2 right-2 animate-bounce" />
        </div>
      </div>
      
      <div className="ml-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Analyzing your data
          </span>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1">Finding patterns and insights...</p>
      </div>
    </div>
  );
};

export default AnalyzingIcon;
