
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import DataVisualization from '../../DataVisualization';

interface VisualizationTabProps {
  recommendations: any[];
  onSelectVisualization: (type: string, data: any[]) => void;
}

const VisualizationTab: React.FC<VisualizationTabProps> = ({
  recommendations,
  onSelectVisualization
}) => {
  return (
    <TabsContent value="visualize">
      <DataVisualization 
        recommendations={recommendations}
        onSelectVisualization={onSelectVisualization}
      />
    </TabsContent>
  );
};

export default VisualizationTab;
