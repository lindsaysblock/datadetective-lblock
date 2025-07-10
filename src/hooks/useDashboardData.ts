
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { type ParsedData } from '../utils/dataParser';

export const useDashboardData = (initialData: ParsedData, onDataUpdate?: (newData: ParsedData) => void) => {
  const [currentData, setCurrentData] = useState(initialData);
  const { toast } = useToast();

  const handleDataUpdate = (newData: ParsedData) => {
    setCurrentData(newData);
    if (onDataUpdate) {
      onDataUpdate(newData);
    }
    toast({
      title: "Data Updated",
      description: "Your dataset has been updated successfully.",
    });
  };

  return {
    currentData,
    handleDataUpdate
  };
};
