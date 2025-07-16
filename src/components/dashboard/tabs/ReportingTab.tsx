
/**
 * Reporting Tab Component
 * Refactored to meet coding standards with proper documentation
 */

import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import VisualizationReporting from '../../VisualizationReporting';

const ReportingTab: React.FC = () => {
  return (
    <TabsContent value="reporting">
      <VisualizationReporting />
    </TabsContent>
  );
};

export default ReportingTab;
