
/**
 * New Project Form Hook
 * Refactored to meet coding standards: reduced complexity, better separation of concerns
 */

import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useContinueCase } from './useContinueCase';
import { useFormValidation } from './useFormValidation';
import { useFileHandling } from './useFileHandling';
import { ProcessedFileData } from './useFileProcessing';
import { FORM_STEPS } from '@/constants/ui';

export interface FormData {
  projectName: string;
  researchQuestion: string;
  businessContext: string;
  file: File | null;
  files: File[];
  uploadedData: any;
  parsedData: any[];
  columnMapping: Record<string, string>;
  analysisResults: any;
  analysisCompleted: boolean;
  isProcessingAnalysis: boolean;
  uploading: boolean;
  parsing: boolean;
  step: number;
  processedFiles: ProcessedFileData[];
}

const initialFormData: FormData = {
  projectName: '',
  researchQuestion: '',
  businessContext: '',
  file: null,
  files: [],
  uploadedData: null,
  parsedData: [],
  columnMapping: {},
  analysisResults: null,
  analysisCompleted: false,
  isProcessingAnalysis: false,
  uploading: false,
  parsing: false,
  step: FORM_STEPS.RESEARCH_QUESTION,
  processedFiles: [],
};

export const useNewProjectForm = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hooks
  const { toast } = useToast();
  const validationSchema = {
    projectName: { required: true, minLength: 3 },
    researchQuestion: { required: true, minLength: 10 }
  };
  const { validateForm } = useFormValidation(validationSchema);
  const { addFile, removeFile, processFiles, processingState } = useFileHandling();
  const { reconstructAnalysisState, createMockFilesFromParsedData } = useContinueCase();

  // Form data updates
  const updateFormData = useCallback((updates: Partial<FormData>) => {
    console.log('📝 updateFormData called with:', updates);
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  // Navigation
  const nextStep = useCallback(() => {
    setFormData(prev => ({ ...prev, step: prev.step + 1 }));
  }, []);

  const prevStep = useCallback(() => {
    setFormData(prev => ({ ...prev, step: Math.max(1, prev.step - 1) }));
  }, []);

  const goToStep = useCallback((step: number) => {
    setFormData(prev => ({ ...prev, step }));
  }, []);

  // Field setters
  const setProjectName = useCallback((value: string) => {
    console.log('🎯 setProjectName called with:', value);
    updateFormData({ projectName: value });
  }, [updateFormData]);

  const setResearchQuestion = useCallback((value: string) => {
    updateFormData({ researchQuestion: value });
  }, [updateFormData]);

  const setAdditionalContext = useCallback((value: string) => {
    updateFormData({ businessContext: value });
  }, [updateFormData]);

  const setColumnMapping = useCallback((mapping: Record<string, string>) => {
    updateFormData({ columnMapping: mapping });
  }, [updateFormData]);

  // File operations
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
      // Error handling is done in useFileHandling
    }
  }, [formData.files, processFiles, processingState, updateFormData]);

  // Continue case handling
  const setContinueCaseData = useCallback((dataset: any) => {
    console.log('🔄 Setting continue case data:', dataset);
    
    try {
      setIsLoading(true);
      setError(null);

      const reconstructedState = reconstructAnalysisState(dataset);
      const mockFiles = createMockFilesFromParsedData(
        reconstructedState.parsedData, 
        dataset.file_size
      );

      const projectNameToSet = reconstructedState.projectName || dataset.name || 'Untitled Project';

      setFormData({
        ...initialFormData,
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
      setError('Failed to load investigation data');
      
      toast({
        title: "Load Error",
        description: "Failed to load the investigation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, reconstructAnalysisState, createMockFilesFromParsedData]);

  const resetForm = useCallback(() => {
    console.log('Resetting form data');
    setFormData(initialFormData);
    setError(null);
  }, []);

  return {
    formData: {
      ...formData,
      uploading: processingState.uploading,
      parsing: processingState.parsing,
    },
    isLoading,
    error,
    actions: {
      updateFormData,
      nextStep,
      prevStep,
      goToStep,
      setProjectName,
      setResearchQuestion,
      setAdditionalContext,
      addFile: handleAddFile,
      removeFile: handleRemoveFile,
      setColumnMapping,
      onFileChange: async (fileOrEvent: File | React.ChangeEvent<HTMLInputElement>) => {
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
      },
      handleFileUpload,
      setContinueCaseData,
      resetForm,
      validateFormData: (projectName: string) => validateForm({ projectName, researchQuestion: formData.researchQuestion }),
    }
  };
};
