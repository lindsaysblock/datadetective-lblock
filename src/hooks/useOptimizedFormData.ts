
import { useState, useCallback, useRef, useEffect } from 'react';
import { diskIOOptimizer } from '@/utils/performance/diskIOOptimizer';

export const useOptimizedFormData = () => {
  const [step, setStep] = useState(1);
  const [researchQuestion, setResearchQuestion] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [columnMapping, setColumnMapping] = useState<any>({});
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  
  // Optimization refs
  const processingRef = useRef<boolean>(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      diskIOOptimizer.cleanup();
    };
  }, []);

  // Debounced data updates to reduce I/O
  const debouncedSetParsedData = useCallback((data: any[]) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(async () => {
      if (processingRef.current) return;
      
      processingRef.current = true;
      setParsing(true);
      
      try {
        const cacheKey = `parsed_data_${data.length}_${Date.now()}`;
        
        // Use deferred processing for large datasets
        if (data.length > 1000) {
          diskIOOptimizer.deferredWrite(cacheKey, data);
        } else {
          diskIOOptimizer.cacheData(cacheKey, data);
        }
        
        setParsedData(data);
        console.log(`✅ Optimized data update: ${data.length} rows`);
      } catch (error) {
        console.error('❌ Optimized data update failed:', error);
        setParsedData(data); // Fallback
      } finally {
        setParsing(false);
        processingRef.current = false;
      }
    }, 300); // 300ms debounce
  }, []);

  const addFile = useCallback((file: File) => {
    setFiles(prev => {
      const exists = prev.some(f => f.name === file.name && f.size === file.size);
      if (exists) return prev;
      
      // Cache file metadata for quick access
      const cacheKey = `file_meta_${file.name}`;
      diskIOOptimizer.cacheData(cacheKey, {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });
      
      return [...prev, file];
    });
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => {
      const newFiles = prev.filter((_, i) => i !== index);
      
      // Clear related cache when file is removed
      if (newFiles.length === 0) {
        setParsedData([]);
        setColumnMapping({});
        diskIOOptimizer.cleanup();
      }
      
      return newFiles;
    });
  }, []);

  const nextStep = useCallback(() => {
    setStep(prev => Math.min(prev + 1, 4));
  }, []);

  const prevStep = useCallback(() => {
    setStep(prev => Math.max(prev - 1, 1));
  }, []);

  // Optimized file upload with batching
  const handleFileUpload = useCallback(async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    
    try {
      // Batch file processing operations
      const uploadOperations = files.map(file => async () => {
        const cacheKey = `upload_${file.name}_${file.size}`;
        
        // Check if already processed
        const cached = diskIOOptimizer.getCachedData(cacheKey);
        if (cached) {
          return cached;
        }
        
        // Simulate processing with minimal I/O
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const result = {
          id: Math.random().toString(),
          name: file.name,
          size: file.size,
          processed: true
        };
        
        diskIOOptimizer.cacheData(cacheKey, result);
        return result;
      });
      
      const results = await diskIOOptimizer.batchOperation(uploadOperations);
      
      // Generate mock data efficiently
      const mockData = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `Optimized Item ${i + 1}`,
        value: Math.random() * 1000,
        category: ['A', 'B', 'C'][i % 3],
        timestamp: new Date(Date.now() - i * 86400000).toISOString()
      }));
      
      debouncedSetParsedData(mockData);
      
    } catch (error) {
      console.error('Optimized upload failed:', error);
    } finally {
      setUploading(false);
    }
  }, [files, debouncedSetParsedData]);

  const optimizeMemory = useCallback(() => {
    diskIOOptimizer.cleanup();
    console.log('🚀 Memory and I/O optimization applied');
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
    setParsedData: debouncedSetParsedData,
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
