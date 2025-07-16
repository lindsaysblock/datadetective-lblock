
/**
 * Manage Tab Component
 * Refactored to meet coding standards with proper constants and semantic theming
 */

import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Settings, Shield, FileText } from 'lucide-react';
import DataManagementPanel from '../../DataManagementPanel';
import DataGovernancePanel from '../../DataGovernancePanel';
import ProjectNotes from '../../ProjectNotes';
import { type ParsedData } from '../../../utils/dataParser';
import { SPACING } from '@/constants/ui';

interface ManageTabProps {
  data: ParsedData;
  onDataUpdate: (newData: ParsedData) => void;
}

const ManageTab: React.FC<ManageTabProps> = ({ data, onDataUpdate }) => {
  const currentDatasetId = 'current-session'; // In a real app, this would be the actual dataset ID

  return (
    <TabsContent value="manage" className={`space-y-${SPACING.LG}`}>
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-${SPACING.LG}`}>
        <div className={`space-y-${SPACING.LG}`}>
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-${SPACING.SM}`}>
                <Database className="w-5 h-5" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataManagementPanel data={data} onDataUpdate={onDataUpdate} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-${SPACING.SM}`}>
                <Shield className="w-5 h-5" />
                Data Governance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataGovernancePanel />
            </CardContent>
          </Card>
        </div>

        <div className={`space-y-${SPACING.LG}`}>
          <ProjectNotes datasetId={currentDatasetId} />
        </div>
      </div>
    </TabsContent>
  );
};

export default ManageTab;
