/**
 * File Handling Hook
 * Centralized file management operations
 * Refactored for consistency and maintainability
 */

import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { validateFile } from '@/utils/fileValidation';
import { validateFileIntegrity } from '@/utils/fileIntegrityCheck';
import { useFileProcessing } from './useFileProcessing';
import { TIMEOUTS } from '@/constants/ui';

export const useFileHandling = () => {
  const { toast } = useToast();
  const fileProcessing = useFileProcessing();

  const addFile = useCallback(async (file: File, currentFiles: File[], setFiles: (files: File[]) => void) => {
    console.log('📁 Adding file:', { name: file.name, type: file.type, size: file.size });
    
    // Basic file validation first
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
    
    // Check file integrity and detect corruption
    try {
      const integrityCheck = await validateFileIntegrity(file);
      if (!integrityCheck.isValid) {
        console.error('❌ File integrity check failed:', integrityCheck.error);
        toast({
          title: "File Corruption Detected",
          description: integrityCheck.error || "File appears to be corrupted",
          variant: "destructive",
        });
        return false;
      }

      // Show warnings if any
      if (integrityCheck.warnings && integrityCheck.warnings.length > 0) {
        console.warn('⚠️ File integrity warnings:', integrityCheck.warnings);
        toast({
          title: "File Warning",
          description: integrityCheck.warnings.join(', '),
          variant: "default",
        });
      }
    } catch (error) {
      console.error('❌ File integrity check error:', error);
      toast({
        title: "File Check Failed",
        description: "Could not verify file integrity",
        variant: "destructive",
      });
      return false;
    }
    
    console.log('✅ File validation and integrity check passed, adding to files array');
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