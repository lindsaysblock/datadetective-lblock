
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useContinueCase } from './useContinueCase';

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
  // Methods
  setResearchQuestion?: (value: string) => void;
  setAdditionalContext?: (value: string) => void;
  nextStep?: () => void;
  prevStep?: () => void;
  addFile?: (file: File) => void;
  handleFileUpload?: () => void;
  removeFile?: (index: number) => void;
  setColumnMapping?: (mapping: Record<string, string>) => void;
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
};

export const useNewProjectForm = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { reconstructAnalysisState, createMockFilesFromParsedData } = useContinueCase();

  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
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

  const handleFileUpload = useCallback(() => {
    // File upload logic would go here
    console.log('File upload triggered');
  }, []);

  const setContinueCaseData = useCallback((dataset: any) => {
    console.log('🔄 Setting continue case data:', dataset);
    
    try {
      setIsLoading(true);
      setError(null);

      // Use the reconstructAnalysisState to get the proper data structure
      const reconstructedState = reconstructAnalysisState(dataset);
      
      // Create mock files from the parsed data with original file size
      const mockFiles = createMockFilesFromParsedData(
        reconstructedState.parsedData, 
        dataset.file_size
      );

      const newFormData: FormData = {
        ...initialFormData,
        projectName: reconstructedState.projectName,
        researchQuestion: reconstructedState.researchQuestion,
        businessContext: reconstructedState.additionalContext,
        file: mockFiles[0] || null,
        files: mockFiles,
        uploadedData: reconstructedState.parsedData,
        parsedData: reconstructedState.parsedData,
        step: reconstructedState.step,
        // Include methods
        setResearchQuestion,
        setAdditionalContext,
        nextStep,
        prevStep,
        addFile,
        handleFileUpload,
        removeFile,
        setColumnMapping,
      };

      setFormData(newFormData);
      
      console.log('✅ Continue case data set successfully:', {
        projectName: reconstructedState.projectName,
        researchQuestion: reconstructedState.researchQuestion,
        filesCount: mockFiles.length,
        filesSizes: mockFiles.map(f => ({ name: f.name, size: f.size })),
        step: reconstructedState.step
      });
      
      toast({
        title: "Investigation Loaded",
        description: `Continuing with "${reconstructedState.projectName}"`,
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
  }, [toast, reconstructAnalysisState, createMockFilesFromParsedData, setResearchQuestion, setAdditionalContext, nextStep, prevStep, addFile, handleFileUpload, removeFile, setColumnMapping]);

  const resetForm = useCallback(() => {
    setFormData({
      ...initialFormData,
      // Include methods
      setResearchQuestion,
      setAdditionalContext,
      nextStep,
      prevStep,
      addFile,
      handleFileUpload,
      removeFile,
      setColumnMapping,
    });
    setError(null);
  }, [setResearchQuestion, setAdditionalContext, nextStep, prevStep, addFile, handleFileUpload, removeFile, setColumnMapping]);

  // Enhance formData with methods
  const enhancedFormData = {
    ...formData,
    setResearchQuestion,
    setAdditionalContext,
    nextStep,
    prevStep,
    addFile,
    handleFileUpload,
    removeFile,
    setColumnMapping,
  };

  return {
    formData: enhancedFormData,
    isLoading,
    error,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    setContinueCaseData,
    resetForm,
  };
};
