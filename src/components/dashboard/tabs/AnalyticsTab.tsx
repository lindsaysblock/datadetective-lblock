
/**
 * Analytics Tab Component
 * Refactored to meet coding standards with proper documentation
 */

import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import AdvancedAnalytics from '../../AdvancedAnalytics';

const AnalyticsTab: React.FC = () => {
  return (
    <TabsContent value="analytics">
      <AdvancedAnalytics />
    </TabsContent>
  );
};

export default AnalyticsTab;
