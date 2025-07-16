/**
 * File Handling Hook
 * Extracted file operations to reduce complexity
 */

import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { validateFile } from '@/utils/fileValidation';
import { useFileProcessing } from './useFileProcessing';
import { TIMEOUTS } from '@/constants/ui';

export const useFileHandling = () => {
  const { toast } = useToast();
  const fileProcessing = useFileProcessing();

  const addFile = useCallback((file: File, currentFiles: File[], setFiles: (files: File[]) => void) => {
    console.log('📁 Adding file:', { name: file.name, type: file.type, size: file.size });
    
    // Validate file before adding
    const validation = validateFile(file);
    if (!validation.isValid) {
      console.error('❌ File validation failed:', validation.error);
      toast({
        title: "Invalid File",
        description: validation.error,
        variant: "destructive",
      });
      return false;
    }
    
    console.log('✅ File validation passed, adding to files array');
    setFiles([...currentFiles, file]);
    return true;
  }, [toast]);

  const removeFile = useCallback((index: number, currentFiles: File[], setFiles: (files: File[]) => void) => {
    setFiles(currentFiles.filter((_, i) => i !== index));
  }, []);

  const processFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) {
      console.log('⚠️ No files to process');
      return { processedFiles: [], parsedData: [] };
    }

    try {
      console.log('🚀 Processing files:', files.length);
      
      // Process files using the file processing hook
      const processedFiles = await fileProcessing.processFiles(files);
      
      // Convert processed files to parsedData format
      const parsedData = processedFiles.map(pf => ({
        id: pf.id,
        name: pf.name,
        rows: pf.parsedData.rows,
        summary: pf.parsedData.summary,
        columns: pf.parsedData.columns,
        rowCount: pf.parsedData.rowCount
      }));

      console.log('✅ File processing completed successfully:', {
        processedCount: processedFiles.length,
        totalRows: parsedData.reduce((sum, pd) => sum + (pd.rowCount || 0), 0)
      });

      return { processedFiles, parsedData };

    } catch (error) {
      console.error('❌ File processing failed:', error);
      
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive",
      });
      
      throw error;
    }
  }, [fileProcessing, toast]);

  return {
    addFile,
    removeFile,
    processFiles,
    processingState: fileProcessing.state,
  };
};