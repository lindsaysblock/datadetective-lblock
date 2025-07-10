
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import QADashboard from '../../QADashboard';

const QATab: React.FC = () => {
  return (
    <TabsContent value="qa">
      <QADashboard />
    </TabsContent>
  );
};

export default QATab;
