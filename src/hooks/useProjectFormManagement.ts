
import { useState, useCallback, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { parseFile, type ParsedData } from '@/utils/dataParser';

interface ProjectFormState {
  step: number;
  researchQuestion: string;
  additionalContext: string;
  files: File[];
  parsedData: ParsedData[];
  columnMapping: Record<string, string>;
  uploading: boolean;
  parsing: boolean;
  currentProjectName: string;
}

export const useProjectFormManagement = () => {
  const [formState, setFormState] = useState<ProjectFormState>({
    step: 1,
    researchQuestion: '',
    additionalContext: '',
    files: [],
    parsedData: [],
    columnMapping: {},
    uploading: false,
    parsing: false,
    currentProjectName: ''
  });

  const { toast } = useToast();

  const updateFormState = useCallback((updates: Partial<ProjectFormState>) => {
    setFormState(prev => ({ ...prev, ...updates }));
  }, []);

  const addFile = useCallback((file: File) => {
    console.log('Adding file:', file.name);
    setFormState(prev => {
      const exists = prev.files.some(f => f.name === file.name && f.size === file.size);
      if (exists) {
        toast({
          title: "File already added",
          description: `${file.name} is already in your project.`,
        });
        return prev;
      }
      return { ...prev, files: [...prev.files, file] };
    });
  }, [toast]);

  const removeFile = useCallback((index: number) => {
    console.log('Removing file at index:', index);
    
    setFormState(prev => {
      if (index < 0 || index >= prev.files.length) {
        console.error('Invalid file index:', index);
        return prev;
      }

      const newFiles = prev.files.filter((_, i) => i !== index);
      const newParsedData = prev.parsedData.filter((_, i) => i !== index);
      
      return {
        ...prev,
        files: newFiles,
        parsedData: newParsedData
      };
    });

    toast({
      title: "File Removed",
      description: "The selected file has been removed from your project.",
    });
  }, [toast]);

  const processFiles = useCallback(async () => {
    if (formState.files.length === 0) {
      console.log('No files to process');
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload.",
        variant: "destructive",
      });
      return;
    }

    console.log('Starting file processing for files:', formState.files.map(f => f.name));
    updateFormState({ uploading: true, parsing: true });

    try {
      const parsedResults: ParsedData[] = [];
      
      for (let i = 0; i < formState.files.length; i++) {
        const file = formState.files[i];
        console.log(`Processing file ${i + 1}/${formState.files.length}:`, file.name);
        
        try {
          const parsed = await parseFile(file);
          console.log('File parsed successfully:', {
            fileName: file.name,
            rows: parsed.rows?.length || 0,
            columns: parsed.columns?.length || 0
          });
          parsedResults.push(parsed);
        } catch (fileError) {
          console.error(`Error parsing file ${file.name}:`, fileError);
          toast({
            title: `Failed to parse ${file.name}`,
            description: fileError instanceof Error ? fileError.message : 'Unknown parsing error',
            variant: "destructive",
          });
        }
      }
      
      if (parsedResults.length > 0) {
        updateFormState({ parsedData: parsedResults });
        console.log('All files processed successfully:', {
          totalFiles: parsedResults.length,
          totalRows: parsedResults.reduce((sum, data) => sum + (data.rows?.length || 0), 0)
        });
        
        toast({
          title: "Files Processed Successfully!",
          description: `Processed ${parsedResults.length} file(s) with ${parsedResults.reduce((total, data) => total + (data.summary?.totalRows || 0), 0)} total rows.`,
        });
      } else {
        throw new Error('No files were successfully processed');
      }
      
    } catch (error: any) {
      console.error('File processing error:', error);
      toast({
        title: "Processing Failed",
        description: error.message || 'Failed to process the files.',
        variant: "destructive",
      });
    } finally {
      updateFormState({ uploading: false, parsing: false });
    }
  }, [formState.files, toast, updateFormState]);

  const navigationActions = useMemo(() => ({
    nextStep: () => {
      console.log('Moving to next step from:', formState.step);
      updateFormState({ step: Math.min(formState.step + 1, 4) });
    },
    prevStep: () => {
      console.log('Moving to previous step from:', formState.step);
      updateFormState({ step: Math.max(formState.step - 1, 1) });
    },
    goToStep: (step: number) => {
      console.log('Moving to specific step:', step);
      updateFormState({ step: Math.max(1, Math.min(step, 4)) });
    }
  }), [formState.step, updateFormState]);

  const resetForm = useCallback(() => {
    console.log('Resetting form');
    setFormState({
      step: 1,
      researchQuestion: '',
      additionalContext: '',
      files: [],
      parsedData: [],
      columnMapping: {},
      uploading: false,
      parsing: false,
      currentProjectName: ''
    });
  }, []);

  const isValidStep = useMemo(() => {
    switch (formState.step) {
      case 1:
        return formState.researchQuestion.trim().length > 0;
      case 2:
        return formState.parsedData.length > 0;
      case 3:
        return true; // Additional context is optional
      case 4:
        return formState.researchQuestion.trim().length > 0 && formState.parsedData.length > 0;
      default:
        return false;
    }
  }, [formState.step, formState.researchQuestion, formState.parsedData.length]);

  return {
    formState,
    updateFormState,
    addFile,
    removeFile,
    processFiles,
    navigationActions,
    resetForm,
    isValidStep
  };
};
