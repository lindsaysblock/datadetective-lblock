
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
    console.log('📝 updateFormData called with:', updates);
    setFormData(prev => {
      const updated = { ...prev, ...updates };
      console.log('📝 Form data after update:', {
        projectName: updated.projectName,
        step: updated.step,
        hasData: !!(updated.parsedData && updated.parsedData.length > 0)
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

  const handleFileUpload = useCallback(() => {
    console.log('File upload triggered');
  }, []);

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

      // Extract the project name correctly with multiple fallbacks
      const projectNameToSet = reconstructedState.projectName || dataset.name || dataset.summary?.projectName || 'Untitled Project';
      
      console.log('🎯 CRITICAL: Final project name to set:', projectNameToSet);

      // Use setFormData with a function to ensure we get the latest state
      setFormData(prevFormData => {
        const newFormData = {
          ...prevFormData,
          projectName: projectNameToSet,
          researchQuestion: reconstructedState.researchQuestion || '',
          businessContext: reconstructedState.additionalContext || '',
          file: mockFiles[0] || null,
          files: mockFiles,
          uploadedData: reconstructedState.parsedData,
          parsedData: reconstructedState.parsedData,
          step: reconstructedState.step,
        };
        
        console.log('✅ NEW FORM DATA SET:', {
          projectName: newFormData.projectName,
          step: newFormData.step,
          filesCount: newFormData.files.length,
          parsedDataCount: newFormData.parsedData.length
        });
        
        return newFormData;
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
  }, []);

  // Enhanced form data with methods - create this with current formData values
  const enhancedFormData = {
    ...formData, // Use current formData state directly
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

  console.log('🔍 useNewProjectForm returning enhanced data:', {
    projectName: enhancedFormData.projectName,
    projectNameLength: enhancedFormData.projectName?.length || 0,
    researchQuestion: enhancedFormData.researchQuestion,
    step: enhancedFormData.step,
    hasSetProjectName: !!enhancedFormData.setProjectName,
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
