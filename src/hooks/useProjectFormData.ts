/**
 * Project Form Data Hook
 * Manages core form data state and basic setters
 */

import { useState, useCallback } from 'react';
import { FORM_STEPS } from '@/constants/ui';
import { ProcessedFileData } from './useFileProcessing';

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

export const useProjectFormData = () => {
  // Initialize with potential localStorage data
  const [formData, setFormData] = useState<FormData>(() => {
    try {
      const saved = localStorage.getItem('dataDetective_projectForm');
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('🔄 Restoring form data from localStorage:', parsed);
        return {
          ...initialFormData,
          projectName: parsed.researchQuestion || '', // Temporary fix
          researchQuestion: parsed.researchQuestion || '',
          businessContext: parsed.additionalContext || '',
          parsedData: parsed.parsedData || [],
          step: parsed.currentStep || FORM_STEPS.RESEARCH_QUESTION
        };
      }
    } catch (error) {
      console.error('Failed to restore form data:', error);
    }
    return initialFormData;
  });

  const updateFormData = useCallback((updates: Partial<FormData>) => {
    console.log('📝 updateFormData called with:', updates);
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

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

  const resetForm = useCallback(() => {
    console.log('Resetting form data');
    setFormData(initialFormData);
  }, []);

  return {
    formData,
    updateFormData,
    setProjectName,
    setResearchQuestion,
    setAdditionalContext,
    setColumnMapping,
    resetForm,
    initialFormData
  };
};