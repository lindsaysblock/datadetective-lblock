
import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { parseFile, type ParsedData } from '@/utils/dataParser';
import { DataValidator } from '@/utils/analysis/dataValidator';
import { diskIOOptimizer } from '@/utils/performance/diskIOOptimizer';
import { optimizedDataProcessor } from '@/utils/performance/optimizedDataProcessor';

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
  const processingRef = useRef(false);

  const processFile = useCallback(async (file: File): Promise<ParsedData> => {
    if (processingRef.current) {
      throw new Error('Pipeline already processing');
    }

    console.log('🚀 Processing file with optimized I/O pipeline:', file.name);
    
    processingRef.current = true;
    setState(prev => ({ ...prev, isProcessing: true, error: null, progress: 0 }));

    try {
      const cacheKey = `pipeline_${file.name}_${file.size}_${file.lastModified}`;
      
      // Check if already processed
      const cached = diskIOOptimizer.getCachedData<ParsedData>(cacheKey);
      if (cached) {
        console.log('⚡ Using cached pipeline result');
        setState(prev => ({ ...prev, progress: 100, isProcessing: false }));
        
        toast({
          title: "File Loaded from Cache",
          description: `Instantly loaded ${file.name}`,
        });
        
        return cached;
      }

      // Parse with optimized I/O
      setState(prev => ({ ...prev, progress: 25 }));
      const parsedData = await optimizedDataProcessor.parseFileOptimized(file);
      
      // Quick validation without heavy I/O
      setState(prev => ({ ...prev, progress: 75 }));
      const validator = new DataValidator(parsedData);
      const validation = validator.validate();
      
      if (!validation.isValid && validation.errors.length > 0) {
        console.warn('⚠️ Validation issues (non-blocking):', validation.errors);
      }
      
      // Cache result for future use
      diskIOOptimizer.cacheData(cacheKey, parsedData);
      
      setState(prev => ({ ...prev, progress: 100, isProcessing: false }));
      
      toast({
        title: "File Processed Successfully",
        description: `Processed ${file.name} with optimized I/O`,
      });

      return parsedData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Optimized processing failed';
      console.error('❌ Optimized pipeline error:', error);
      
      setState(prev => ({ ...prev, isProcessing: false, error: errorMessage }));
      
      toast({
        title: "Processing Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      processingRef.current = false;
    }
  }, [toast]);

  const reset = useCallback(() => {
    setState({ isProcessing: false, error: null, progress: 0 });
    processingRef.current = false;
  }, []);

  const clearCache = useCallback(() => {
    diskIOOptimizer.cleanup();
    optimizedDataProcessor.clearCache();
  }, []);

  return {
    ...state,
    processFile,
    reset,
    clearCache
  };
};
