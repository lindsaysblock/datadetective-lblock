
/**
 * File Processing Hook
 * Handles file upload, parsing, and processing operations
 * Refactored for consistency and maintainability
 */

import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { parseFile, type ParsedData } from '@/utils/dataParser';
import { TIMEOUTS } from '@/constants/ui';

export interface FileProcessingState {
  uploading: boolean;
  parsing: boolean;
  progress: number;
  error: string | null;
}

export interface ProcessedFileData {
  id: string;
  name: string;
  originalFile: File;
  parsedData: ParsedData;
  processedAt: Date;
}

export const useFileProcessing = () => {
  const [state, setState] = useState<FileProcessingState>({
    uploading: false,
    parsing: false,
    progress: 0,
    error: null
  });
  
  const [processedFiles, setProcessedFiles] = useState<ProcessedFileData[]>([]);
  const { toast } = useToast();

  const processFiles = useCallback(async (files: File[]): Promise<ProcessedFileData[]> => {
    console.log('🔄 Starting file processing for', files.length, 'files');
    
    setState(prev => ({ ...prev, uploading: true, parsing: true, progress: 0, error: null }));
    
    try {
      const results: ProcessedFileData[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`📁 Processing file ${i + 1}/${files.length}:`, file.name);
        
        // Update progress
        const progress = ((i + 0.5) / files.length) * 100;
        setState(prev => ({ ...prev, progress }));
        
        // Parse the file
        const parsedData = await parseFile(file);
        console.log('✅ File parsed successfully:', {
          fileName: file.name,
          rows: parsedData.rowCount,
          columns: parsedData.columns.length
        });
        
        const processedFile: ProcessedFileData = {
          id: `${file.name}-${Date.now()}-${i}`,
          name: file.name,
          originalFile: file,
          parsedData,
          processedAt: new Date()
        };
        
        results.push(processedFile);
        
        // Final progress update for this file
        const finalProgress = ((i + 1) / files.length) * 100;
        setState(prev => ({ ...prev, progress: finalProgress }));
        
        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      setProcessedFiles(prev => [...prev, ...results]);
      
      setState(prev => ({ 
        ...prev, 
        uploading: false, 
        parsing: false, 
        progress: 100,
        error: null 
      }));
      
      toast({
        title: "Files Processed Successfully!",
        description: `Processed ${results.length} file(s) with ${results.reduce((sum, f) => sum + f.parsedData.rowCount, 0)} total rows.`,
      });
      
      console.log('🎉 All files processed successfully:', results.length);
      return results;
      
    } catch (error) {
      console.error('❌ File processing failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      setState(prev => ({ 
        ...prev, 
        uploading: false, 
        parsing: false, 
        progress: 0,
        error: errorMessage 
      }));
      
      toast({
        title: "File Processing Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    }
  }, [toast]);

  const removeProcessedFile = useCallback((fileId: string) => {
    setProcessedFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  const clearAll = useCallback(() => {
    setProcessedFiles([]);
    setState({
      uploading: false,
      parsing: false,
      progress: 0,
      error: null
    });
  }, []);

  const resetState = useCallback(() => {
    setState({
      uploading: false,
      parsing: false,
      progress: 0,
      error: null
    });
  }, []);

  return {
    state,
    processedFiles,
    processFiles,
    removeProcessedFile,
    clearAll,
    resetState
  };
};
