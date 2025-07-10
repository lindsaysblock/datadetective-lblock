
import React from 'react';
import { BarChart3, Search, Sparkles } from 'lucide-react';

interface DataDetectiveLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  animated?: boolean;
}

const DataDetectiveLogo: React.FC<DataDetectiveLogoProps> = ({ 
  size = 'md', 
  showText = true,
  animated = false 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl'
  };

  return (
    <div className="flex items-center gap-3">
      {/* Logo Icon */}
      <div className={`relative ${sizeClasses[size]} ${animated ? 'animate-pulse' : ''}`}>
        {/* Main background circle with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-full shadow-lg">
          {/* Inner glow effect */}
          <div className="absolute inset-1 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-80"></div>
        </div>
        
        {/* Magnifying glass body */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Search className="w-1/2 h-1/2 text-white z-10 drop-shadow-sm" strokeWidth={2.5} />
        </div>
        
        {/* Chart bars behind the magnifying glass */}
        <div className="absolute inset-0 flex items-center justify-center opacity-60">
          <BarChart3 className="w-2/3 h-2/3 text-white transform translate-x-1 translate-y-1" strokeWidth={1.5} />
        </div>
        
        {/* Sparkles for detective magic */}
        <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300 animate-pulse" />
        
        {/* Detective hat accent */}
        <div className="absolute -top-1 left-1/4 w-2 h-1 bg-gray-800 rounded-sm transform -rotate-12 shadow-sm"></div>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSizes[size]} font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight`}>
            Data Detective
          </h1>
          {size !== 'sm' && (
            <p className="text-xs text-muted-foreground font-medium tracking-wide">
              🔍 Turn data mysteries into clear insights
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DataDetectiveLogo;
