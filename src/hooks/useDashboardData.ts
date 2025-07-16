
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { type ParsedData } from '@/utils/dataParser';

export const useDashboardData = (initialData?: ParsedData) => {
  const [currentData, setCurrentData] = useState(initialData);
  const { toast } = useToast();

  const handleDataUpdate = (newData: ParsedData) => {
    setCurrentData(newData);
    toast({
      title: "Data Updated",
      description: "Your dataset has been updated successfully.",
    });
  };

  // Generate some mock processed data if no data is provided
  const MOCK_ROW_COUNT = 3;
  const MOCK_COLUMN_COUNT = 2;
  const MOCK_FILE_SIZE = 1024;
  
  const processedData: ParsedData = currentData || {
    columns: [
      { name: 'id', type: 'number' as const, samples: [1, 2, 3] },
      { name: 'name', type: 'string' as const, samples: ['Sample 1', 'Sample 2', 'Sample 3'] },
    ],
    rows: [
      { id: 1, name: 'Sample 1' },
      { id: 2, name: 'Sample 2' },
      { id: 3, name: 'Sample 3' },
    ],
    rowCount: MOCK_ROW_COUNT,
    fileSize: MOCK_FILE_SIZE,
    summary: {
      totalRows: MOCK_ROW_COUNT,
      totalColumns: MOCK_COLUMN_COUNT,
    }
  };

  const findings = [];
  const recommendations = [];
  const hypotheses = [];

  return {
    processedData,
    findings,
    recommendations,
    hypotheses,
    handleDataUpdate
  };
};
