
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  action 
}) => {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <Icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">{title}</h3>
        <p className="text-gray-500 mb-4">{description}</p>
        {action && action}
      </CardContent>
    </Card>
  );
};

export default EmptyState;
