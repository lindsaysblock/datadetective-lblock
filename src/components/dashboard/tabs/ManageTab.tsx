
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import DataManagementPanel from '../../DataManagementPanel';
import { type ParsedData } from '../../../utils/dataParser';

interface ManageTabProps {
  data: ParsedData;
  onDataUpdate: (newData: ParsedData) => void;
}

const ManageTab: React.FC<ManageTabProps> = ({ data, onDataUpdate }) => {
  return (
    <TabsContent value="manage">
      <DataManagementPanel 
        data={data}
        onDataUpdate={onDataUpdate}
      />
    </TabsContent>
  );
};

export default ManageTab;
