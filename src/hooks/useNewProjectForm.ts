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
  setProjectName?: (value: string) => void;
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
    console.log('Updating form data:', updates);
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

  const setProjectName = useCallback((value: string) => {
    console.log('Setting project name in useNewProjectForm:', value);
    setFormData(prev => {
      const updated = { ...prev, projectName: value };
      console.log('Updated formData after setProjectName:', { projectName: updated.projectName });
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
      
      console.log('📊 Reconstructed state:', {
        projectName: reconstructedState.projectName,
        parsedDataLength: reconstructedState.parsedData?.length || 0,
        originalFileSize: dataset.file_size
      });

      // Create mock files from the parsed data with original file size
      const mockFiles = createMockFilesFromParsedData(
        reconstructedState.parsedData, 
        dataset.file_size
      );

      console.log('📁 Created mock files:', mockFiles.map(f => ({ 
        name: f.name, 
        size: f.size,
        isReconstructed: (f as any).isReconstructed 
      })));

      // CRITICAL FIX: Ensure the project name is properly set and maintained
      const projectNameToSet = reconstructedState.projectName || dataset.name || 'Untitled Project';
      
      console.log('🎯 Setting project name to:', projectNameToSet);

      setFormData(prev => {
        const newFormData = {
          ...prev,
          projectName: projectNameToSet,
          researchQuestion: reconstructedState.researchQuestion,
          businessContext: reconstructedState.additionalContext,
          file: mockFiles[0] || null,
          files: mockFiles,
          uploadedData: reconstructedState.parsedData,
          parsedData: reconstructedState.parsedData,
          step: reconstructedState.step,
        };

        console.log('✅ Final formData being set:', {
          projectName: newFormData.projectName,
          researchQuestion: newFormData.researchQuestion,
          filesCount: mockFiles.length,
          step: newFormData.step
        });

        return newFormData;
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

  // Enhanced formData with methods - this is the key fix
  const enhancedFormData = {
    ...formData,
    setProjectName,
    setResearchQuestion,
    setAdditionalContext,
    nextStep,
    prevStep,
    addFile,
    handleFileUpload,
    removeFile,
    setColumnMapping,
  };

  console.log('useNewProjectForm current state:', {
    projectName: enhancedFormData.projectName,
    researchQuestion: enhancedFormData.researchQuestion,
    step: enhancedFormData.step,
    hasData: !!(enhancedFormData.parsedData && enhancedFormData.parsedData.length > 0)
  });

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
