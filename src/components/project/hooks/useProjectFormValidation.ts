
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useProjectFormValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const validateResearchQuestion = (question: string): boolean => {
    if (!question.trim()) {
      setErrors(prev => ({ ...prev, researchQuestion: 'Research question is required' }));
      return false;
    }
    if (question.length < 10) {
      setErrors(prev => ({ ...prev, researchQuestion: 'Research question should be at least 10 characters' }));
      return false;
    }
    setErrors(prev => ({ ...prev, researchQuestion: '' }));
    return true;
  };

  const validateDataFiles = (files: File[], parsedData: any[]): boolean => {
    if (files.length === 0 && parsedData.length === 0) {
      setErrors(prev => ({ ...prev, data: 'At least one data source is required' }));
      toast({
        title: "Validation Error",
        description: "Please upload files, paste data, or connect to a data source.",
        variant: "destructive",
      });
      return false;
    }
    setErrors(prev => ({ ...prev, data: '' }));
    return true;
  };

  const clearErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validateResearchQuestion,
    validateDataFiles,
    clearErrors
  };
};
