
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { parseFile, type ParsedData } from '@/utils/dataParser';
import { DataValidator } from '@/utils/analysis/dataValidator';

interface OptimizedPipelineState {
  isProcessing: boolean;
  error: string | null;
  progress: number;
}

export const useOptimizedDataPipeline = () => {
  const [state, setState] = useState<OptimizedPipelineState>({
    isProcessing: false,
    error: null,
    progress: 0
  });
  const { toast } = useToast();

  const processFile = useCallback(async (file: File): Promise<ParsedData> => {
    console.log('🔄 Processing file through optimized pipeline:', file.name);
    
    setState(prev => ({ ...prev, isProcessing: true, error: null, progress: 0 }));

    try {
      // Parse file
      setState(prev => ({ ...prev, progress: 25 }));
      const parsedData = await parseFile(file);
      
      // Validate data
      setState(prev => ({ ...prev, progress: 50 }));
      const validator = new DataValidator(parsedData);
      const validation = validator.validate();
      
      if (!validation.isValid && validation.errors.length > 0) {
        console.warn('⚠️ Data validation issues:', validation.errors);
      }
      
      setState(prev => ({ ...prev, progress: 75 }));
      
      // Final processing
      setState(prev => ({ ...prev, progress: 100, isProcessing: false }));
      
      toast({
        title: "File Processed Successfully",
        description: `Processed ${file.name} with ${parsedData.rowCount} rows`,
      });

      return parsedData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'File processing failed';
      console.error('❌ Optimized pipeline error:', error);
      
      setState(prev => ({ ...prev, isProcessing: false, error: errorMessage }));
      
      toast({
        title: "Processing Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    }
  }, [toast]);

  const reset = useCallback(() => {
    setState({ isProcessing: false, error: null, progress: 0 });
  }, []);

  return {
    ...state,
    processFile,
    reset
  };
};
