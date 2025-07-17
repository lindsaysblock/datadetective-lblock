/**
 * Project Form Actions Hook
 * Orchestrates file handling and complex form operations
 */

import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useFileHandling } from './useFileHandling';
import { useContinueCase } from './useContinueCase';
import { FormData } from './useProjectFormData';

export const useProjectFormActions = (
  formData: FormData,
  updateFormData: (updates: Partial<FormData>) => void,
  resetForm: () => void
) => {
  const { toast } = useToast();
  const { addFile, removeFile, processFiles, processingState } = useFileHandling();
  const { reconstructAnalysisState, createMockFilesFromParsedData } = useContinueCase();

  const handleAddFile = useCallback(async (file: File) => {
    const success = await addFile(file, formData.files, (files) => updateFormData({ files }));
    return success;
  }, [addFile, formData.files, updateFormData]);

  const handleRemoveFile = useCallback((index: number) => {
    removeFile(index, formData.files, (files) => updateFormData({ files }));
  }, [removeFile, formData.files, updateFormData]);

  const handleFileUpload = useCallback(async () => {
    console.log('🚀 handleFileUpload called with files:', formData.files.length);

    if (formData.files.length === 0) return;

    try {
      updateFormData({ 
        uploading: processingState.uploading,
        parsing: processingState.parsing 
      });

      const { processedFiles, parsedData } = await processFiles(formData.files);

      updateFormData({
        processedFiles,
        parsedData,
        uploadedData: parsedData,
        uploading: false,
        parsing: false
      });

    } catch (error) {
      updateFormData({ uploading: false, parsing: false });
    }
  }, [formData.files, processFiles, processingState, updateFormData]);

  const setContinueCaseData = useCallback((dataset: any) => {
    console.log('🔄 Setting continue case data:', dataset);
    
    try {
      const reconstructedState = reconstructAnalysisState(dataset);
      const mockFiles = createMockFilesFromParsedData(
        reconstructedState.parsedData, 
        dataset.file_size
      );

      const projectNameToSet = reconstructedState.projectName || dataset.name || 'Untitled Project';

      updateFormData({
        projectName: projectNameToSet,
        researchQuestion: reconstructedState.researchQuestion || '',
        businessContext: reconstructedState.additionalContext || '',
        file: mockFiles[0] || null,
        files: mockFiles,
        uploadedData: reconstructedState.parsedData,
        parsedData: reconstructedState.parsedData,
        step: reconstructedState.step,
        processedFiles: [],
      });

      toast({
        title: "Investigation Loaded",
        description: `Continuing with "${projectNameToSet}"`,
      });

    } catch (error) {
      console.error('❌ Error setting continue case data:', error);
      
      toast({
        title: "Load Error",
        description: "Failed to load the investigation. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast, reconstructAnalysisState, createMockFilesFromParsedData, updateFormData]);

  const onFileChange = useCallback(async (fileOrEvent: File | React.ChangeEvent<HTMLInputElement>) => {
    if ('target' in fileOrEvent && fileOrEvent.target && 'files' in fileOrEvent.target) {
      const files = fileOrEvent.target.files;
      if (files && files.length > 0) {
        for (const file of Array.from(files)) {
          await handleAddFile(file);
        }
      }
    } else if (fileOrEvent && typeof fileOrEvent === 'object' && 'name' in fileOrEvent) {
      await handleAddFile(fileOrEvent as File);
    }
  }, [handleAddFile]);

  return {
    handleAddFile,
    handleRemoveFile,
    handleFileUpload,
    setContinueCaseData,
    onFileChange,
    processingState
  };
};