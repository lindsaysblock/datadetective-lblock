
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useContinueCase } from './useContinueCase';
import { useFileProcessing, type ProcessedFileData } from './useFileProcessing';

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
  step: 1,
  processedFiles: [],
};

export const useNewProjectForm = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { reconstructAnalysisState, createMockFilesFromParsedData } = useContinueCase();
  const fileProcessing = useFileProcessing();

  const updateFormData = useCallback((updates: Partial<FormData>) => {
    console.log('📝 updateFormData called with:', updates);
    setFormData(prev => {
      const updated = { ...prev, ...updates };
      console.log('📝 Form data after update:', {
        projectName: updated.projectName,
        step: updated.step,
        hasData: !!(updated.parsedData && updated.parsedData.length > 0),
        processedFilesCount: updated.processedFiles?.length || 0
      });
      return updated;
    });
  }, []);

  const nextStep = useCallback(() => {
    setFormData(prev => ({ ...prev, step: prev.step + 1 }));
  }, []);

  const prevStep = useCallback(() => {
    setFormData(prev => ({ ...prev, step: Math.max(1, prev.step - 1) }));
  }, []);

  const goToStep = useCallback((step: number) => {
    setFormData(prev => ({ ...prev, step }));
  }, []);

  const setProjectName = useCallback((value: string) => {
    console.log('🎯 setProjectName called with:', value);
    setFormData(prev => {
      const updated = { ...prev, projectName: value };
      console.log('🎯 Project name set in state:', updated.projectName);
      return updated;
    });
  }, []);

  const setResearchQuestion = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, researchQuestion: value }));
  }, []);

  const setAdditionalContext = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, businessContext: value }));
  }, []);

  const addFile = useCallback((file: File) => {
    setFormData(prev => ({ ...prev, files: [...prev.files, file] }));
  }, []);

  const removeFile = useCallback((index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      files: prev.files.filter((_, i) => i !== index) 
    }));
  }, []);

  const setColumnMapping = useCallback((mapping: Record<string, string>) => {
    setFormData(prev => ({ ...prev, columnMapping: mapping }));
  }, []);

  const handleFileUpload = useCallback(async () => {
    console.log('🚀 handleFileUpload called with files:', formData.files.length);
    
    if (formData.files.length === 0) {
      console.log('⚠️ No files to process');
      return;
    }

    try {
      // Update state to show processing
      setFormData(prev => ({ 
        ...prev, 
        uploading: fileProcessing.state.uploading,
        parsing: fileProcessing.state.parsing 
      }));

      // Process files using the file processing hook
      const processedFiles = await fileProcessing.processFiles(formData.files);
      
      // Convert processed files to parsedData format
      const parsedData = processedFiles.map(pf => ({
        id: pf.id,
        name: pf.name,
        rows: pf.parsedData.rows,
        summary: pf.parsedData.summary,
        columns: pf.parsedData.columns,
        rowCount: pf.parsedData.rowCount
      }));

      // Update form data with processed results
      setFormData(prev => ({ 
        ...prev,
        processedFiles,
        parsedData,
        uploadedData: parsedData,
        uploading: false,
        parsing: false
      }));

      console.log('✅ File upload completed successfully:', {
        processedCount: processedFiles.length,
        totalRows: parsedData.reduce((sum, pd) => sum + (pd.rowCount || 0), 0)
      });

    } catch (error) {
      console.error('❌ File upload failed:', error);
      setFormData(prev => ({ 
        ...prev, 
        uploading: false, 
        parsing: false 
      }));
      
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive",
      });
    }
  }, [formData.files, fileProcessing, toast]);

  const setContinueCaseData = useCallback((dataset: any) => {
    console.log('🔄 Setting continue case data:', dataset);
    
    try {
      setIsLoading(true);
      setError(null);

      const reconstructedState = reconstructAnalysisState(dataset);
      
      console.log('📊 Reconstructed state:', {
        projectName: reconstructedState.projectName,
        parsedDataLength: reconstructedState.parsedData?.length || 0,
        originalFileSize: dataset.file_size
      });

      const mockFiles = createMockFilesFromParsedData(
        reconstructedState.parsedData, 
        dataset.file_size
      );

      console.log('📁 Created mock files:', mockFiles.map(f => ({ 
        name: f.name, 
        size: f.size,
        isReconstructed: (f as any).isReconstructed 
      })));

      const projectNameToSet = reconstructedState.projectName || dataset.name || dataset.summary?.projectName || 'Untitled Project';
      
      console.log('🎯 CRITICAL: Final project name to set:', projectNameToSet);

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

      console.log('✅ CONTINUE CASE DATA SET - Project Name:', projectNameToSet);
      
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
    fileProcessing.clearAll();
  }, [fileProcessing]);

  return {
    formData: {
      ...formData,
      uploading: fileProcessing.state.uploading,
      parsing: fileProcessing.state.parsing,
      // Add missing form action functions
      setProjectName,
      setResearchQuestion,
      setAdditionalContext,
      nextStep,
      prevStep,
      goToStep,
      onFileChange: addFile,
      handleFileUpload,
      removeFile,
      setColumnMapping,
    },
    isLoading,
    error,
    fileProcessing,
    actions: {
      updateFormData,
      nextStep,
      prevStep,
      goToStep,
      setProjectName,
      setResearchQuestion,
      setAdditionalContext,
      addFile,
      removeFile,
      setColumnMapping,
      handleFileUpload,
      setContinueCaseData,
      resetForm,
    }
  };
};
