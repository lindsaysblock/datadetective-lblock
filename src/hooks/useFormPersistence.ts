
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface FormData {
  researchQuestion: string;
  additionalContext: string;
  files: {
    name: string;
    size: number;
    type: string;
    lastModified: number;
  }[];
  parsedData: any[];
  currentStep: number;
  lastSaved: string;
}

const FORM_STORAGE_KEY = 'newProject_formData';
const STORAGE_VERSION = '1.0';

export const useFormPersistence = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const saveFormData = useCallback((data: Partial<FormData>) => {
    try {
      const existingData = getFormData();
      const updatedData: FormData = {
        ...existingData,
        ...data,
        lastSaved: new Date().toISOString()
      };

      const storageData = {
        version: STORAGE_VERSION,
        data: updatedData,
        timestamp: Date.now()
      };

      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(storageData));
      console.log('Form data saved to localStorage:', updatedData);
    } catch (error) {
      console.error('Failed to save form data:', error);
      toast({
        title: "Save Warning",
        description: "Unable to save form progress locally.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const getFormData = useCallback((): FormData => {
    try {
      const stored = localStorage.getItem(FORM_STORAGE_KEY);
      if (!stored) {
        return getDefaultFormData();
      }

      const parsedStorage = JSON.parse(stored);
      
      // Version check for future compatibility
      if (parsedStorage.version !== STORAGE_VERSION) {
        console.log('Storage version mismatch, clearing data');
        clearFormData();
        return getDefaultFormData();
      }

      // Age check - clear data older than 7 days
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      if (parsedStorage.timestamp < sevenDaysAgo) {
        console.log('Stored data too old, clearing');
        clearFormData();
        return getDefaultFormData();
      }

      return parsedStorage.data || getDefaultFormData();
    } catch (error) {
      console.error('Failed to load form data:', error);
      clearFormData();
      return getDefaultFormData();
    }
  }, []);

  const clearFormData = useCallback(() => {
    try {
      localStorage.removeItem(FORM_STORAGE_KEY);
      console.log('Form data cleared from localStorage');
    } catch (error) {
      console.error('Failed to clear form data:', error);
    }
  }, []);

  const getDefaultFormData = (): FormData => ({
    researchQuestion: '',
    additionalContext: '',
    files: [],
    parsedData: [],
    currentStep: 1,
    lastSaved: ''
  });

  const hasStoredData = useCallback((): boolean => {
    try {
      const stored = localStorage.getItem(FORM_STORAGE_KEY);
      if (!stored) return false;

      const parsedStorage = JSON.parse(stored);
      const data = parsedStorage.data;
      
      return !!(data?.researchQuestion || data?.additionalContext || data?.files?.length > 0);
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return {
    saveFormData,
    getFormData,
    clearFormData,
    hasStoredData,
    isLoading
  };
};
