
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface LoadingCardProps {
  count?: number;
  className?: string;
}

const LoadingCard: React.FC<LoadingCardProps> = ({ count = 6, className = "" }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LoadingCard;
