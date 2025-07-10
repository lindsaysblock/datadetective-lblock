
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import AuditLogsPanel from '../../AuditLogsPanel';
import DataGovernancePanel from '../../DataGovernancePanel';

const AuditTab: React.FC = () => {
  return (
    <TabsContent value="audit">
      <div className="space-y-6">
        <AuditLogsPanel />
        <DataGovernancePanel />
      </div>
    </TabsContent>
  );
};

export default AuditTab;
