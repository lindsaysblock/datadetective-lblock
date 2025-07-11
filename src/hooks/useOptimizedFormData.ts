
import { useState, useCallback, useRef, useEffect } from 'react';
import { optimizedDataProcessor } from '@/utils/performance/optimizedDataProcessor';

export const useOptimizedFormData = () => {
  const [step, setStep] = useState(1);
  const [researchQuestion, setResearchQuestion] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [columnMapping, setColumnMapping] = useState<any>({});
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  
  // Optimization: Use refs to track heavy operations
  const processingRef = useRef<boolean>(false);
  const cacheKeyRef = useRef<string>('');

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      optimizedDataProcessor.clearCache();
    };
  }, []);

  const optimizedSetParsedData = useCallback(async (data: any[]) => {
    if (processingRef.current) return; // Prevent concurrent processing
    
    processingRef.current = true;
    setParsing(true);
    
    try {
      // Generate cache key based on data characteristics
      const cacheKey = `data_${data.length}_${Date.now()}`;
      cacheKeyRef.current = cacheKey;
      
      // Use optimized data processor
      const optimizedData = await optimizedDataProcessor.processDataWithOptimization(data, cacheKey);
      setParsedData(optimizedData);
      
      console.log(`✅ Optimized data processing complete: ${optimizedData.length} rows`);
    } catch (error) {
      console.error('❌ Data processing optimization failed:', error);
      setParsedData(data); // Fallback to original data
    } finally {
      setParsing(false);
      processingRef.current = false;
    }
  }, []);

  const addFile = useCallback((file: File) => {
    setFiles(prev => {
      // Prevent duplicate files
      const exists = prev.some(f => f.name === file.name && f.size === file.size);
      if (exists) return prev;
      
      return [...prev, file];
    });
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    
    // Clear related data when file is removed
    if (files.length === 1) {
      setParsedData([]);
      setColumnMapping({});
      optimizedDataProcessor.clearCache();
    }
  }, [files.length]);

  const nextStep = useCallback(() => {
    setStep(prev => Math.min(prev + 1, 4));
  }, []);

  const prevStep = useCallback(() => {
    setStep(prev => Math.max(prev - 1, 1));
  }, []);

  const handleFileUpload = useCallback(async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    
    try {
      // Simulate file processing with optimization
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock parsed data - in real app this would parse the actual file
      const mockData = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
        value: Math.random() * 1000,
        category: ['A', 'B', 'C'][i % 3],
        timestamp: new Date(Date.now() - i * 86400000).toISOString()
      }));
      
      await optimizedSetParsedData(mockData);
      
    } catch (error) {
      console.error('File upload optimization failed:', error);
    } finally {
      setUploading(false);
    }
  }, [files, optimizedSetParsedData]);

  // Memory optimization method
  const optimizeMemory = useCallback(() => {
    optimizedDataProcessor.optimizeMemoryUsage();
  }, []);

  return {
    step,
    researchQuestion,
    setResearchQuestion,
    additionalContext,
    setAdditionalContext,
    files,
    addFile,
    removeFile,
    parsedData,
    setParsedData: optimizedSetParsedData,
    columnMapping,
    setColumnMapping,
    uploading,
    parsing,
    nextStep,
    prevStep,
    handleFileUpload,
    optimizeMemory
  };
};
