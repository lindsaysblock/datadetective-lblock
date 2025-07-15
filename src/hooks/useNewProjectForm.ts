
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface FormData {
  projectName: string;
  researchQuestion: string;
  businessContext: string;
  file: File | null;
  uploadedData: any;
  step: number;
}

const initialFormData: FormData = {
  projectName: '',
  researchQuestion: '',
  businessContext: '',
  file: null,
  uploadedData: null,
  step: 1,
};

export const useNewProjectForm = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

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

  const setContinueCaseData = useCallback((dataset: any) => {
    console.log('🔄 Setting continue case data:', dataset);
    
    try {
      setIsLoading(true);
      setError(null);

      const projectName = dataset.summary?.projectName || dataset.name || 'Continued Investigation';
      const researchQuestion = dataset.summary?.researchQuestion || dataset.summary?.description || '';
      const businessContext = dataset.summary?.businessContext || '';

      // Create a mock file object for the uploaded data
      const mockFile = new File(
        [JSON.stringify(dataset.data || [])], 
        dataset.original_filename || 'dataset.json',
        { type: 'application/json' }
      );

      const newFormData: FormData = {
        projectName,
        researchQuestion,
        businessContext,
        file: mockFile,
        uploadedData: dataset.data || dataset,
        step: 4, // Go directly to analysis summary
      };

      setFormData(newFormData);
      
      console.log('✅ Continue case data set successfully');
      
      toast({
        title: "Investigation Loaded",
        description: `Continuing with "${projectName}"`,
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
  }, [toast]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setError(null);
  }, []);

  return {
    formData,
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
