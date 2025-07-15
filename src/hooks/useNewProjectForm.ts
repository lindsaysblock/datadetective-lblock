
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { parseFile } from '@/utils/dataParser';
import { ParsedDataFile } from '@/types/data';

interface NewProjectFormState {
  step: number;
  researchQuestion: string;
  additionalContext: string;
  files: File[];
  uploading: boolean;
  parsing: boolean;
  parsedData: ParsedDataFile[];
  columnMapping: any;
  analysisResults: any;
  analysisCompleted: boolean;
  isProcessingAnalysis: boolean;
  currentProjectName: string;
}

export const useNewProjectForm = () => {
  const [formState, setFormState] = useState<NewProjectFormState>({
    step: 1,
    researchQuestion: '',
    additionalContext: '',
    files: [],
    uploading: false,
    parsing: false,
    parsedData: [],
    columnMapping: { valueColumns: [], categoryColumns: [] },
    analysisResults: null,
    analysisCompleted: false,
    isProcessingAnalysis: false,
    currentProjectName: ''
  });

  const { toast } = useToast();

  const setStep = useCallback((step: number) => {
    console.log('📍 Setting step to:', step);
    setFormState(prev => ({ ...prev, step }));
  }, []);

  const setResearchQuestion = useCallback((question: string) => {
    console.log('❓ Setting research question:', question.slice(0, 50) + '...');
    setFormState(prev => ({ ...prev, researchQuestion: question }));
  }, []);

  const setAdditionalContext = useCallback((context: string) => {
    console.log('📝 Setting additional context, length:', context.length);
    setFormState(prev => ({ ...prev, additionalContext: context }));
  }, []);

  const setFiles = useCallback((files: File[]) => {
    console.log('📂 Setting files:', files.map(f => f.name));
    setFormState(prev => ({ ...prev, files }));
  }, []);

  const setParsedData = useCallback((data: ParsedDataFile[]) => {
    console.log('📊 Setting parsed data, files:', data.length);
    setFormState(prev => ({ ...prev, parsedData: data }));
  }, []);

  const setColumnMapping = useCallback((mapping: any) => {
    console.log('🗂️ Setting column mapping:', mapping);
    setFormState(prev => ({ ...prev, columnMapping: mapping }));
  }, []);

  const addFile = useCallback((file: File) => {
    console.log('➕ Adding file:', file.name, 'Size:', file.size);
    setFormState(prev => ({ 
      ...prev, 
      files: [...prev.files, file] 
    }));
  }, []);

  const removeFile = useCallback((index: number) => {
    console.log('➖ Removing file at index:', index);
    setFormState(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
      parsedData: prev.parsedData.filter((_, i) => i !== index)
    }));
  }, []);

  const handleFileUpload = useCallback(async () => {
    if (formState.files.length === 0) {
      console.log('⚠️ No files to upload');
      return;
    }

    console.log('🔄 Starting file upload for files:', formState.files.map(f => f.name));
    setFormState(prev => ({ ...prev, uploading: true, parsing: true }));

    try {
      const parsedResults: ParsedDataFile[] = [];

      for (const file of formState.files) {
        console.log('📁 Processing file:', file.name);
        
        // Check if it's a synthetic file (empty) from continue case
        if (file.size === 0 && file.name) {
          console.log('📝 Detected synthetic file, creating mock data');
          const mockDataFile: ParsedDataFile = {
            id: `mock-${Date.now()}-${Math.random()}`,
            name: file.name,
            rows: 100,
            columns: 5,
            rowCount: 100,
            preview: [
              ['ID', 'Name', 'Date', 'Value', 'Category'],
              ['1', 'Sample A', '2024-01-01', '100', 'Type1'],
              ['2', 'Sample B', '2024-01-02', '150', 'Type2'],
              ['3', 'Sample C', '2024-01-03', '200', 'Type1']
            ],
            data: [],
            columnInfo: [
              { name: 'ID', type: 'number' },
              { name: 'Name', type: 'string' },
              { name: 'Date', type: 'date' },
              { name: 'Value', type: 'number' },
              { name: 'Category', type: 'string' }
            ],
            summary: {
              totalRows: 100,
              totalColumns: 5,
              possibleUserIdColumns: ['ID'],
              possibleEventColumns: ['Name'],
              possibleTimestampColumns: ['Date']
            }
          };
          
          parsedResults.push(mockDataFile);
          console.log('✅ Created mock data for:', file.name);
          continue;
        }

        try {
          const parsedData = await parseFile(file);
          
          const dataFile: ParsedDataFile = {
            id: `file-${Date.now()}-${Math.random()}`,
            name: file.name,
            rows: parsedData.rowCount,
            columns: parsedData.columns.length,
            rowCount: parsedData.rowCount,
            preview: parsedData.rows.slice(0, 5),
            data: parsedData.rows,
            columnInfo: parsedData.columns,
            summary: {
              totalRows: parsedData.rowCount,
              totalColumns: parsedData.columns.length,
              possibleUserIdColumns: parsedData.summary?.possibleUserIdColumns || [],
              possibleEventColumns: parsedData.summary?.possibleEventColumns || [],
              possibleTimestampColumns: parsedData.summary?.possibleTimestampColumns || []
            }
          };

          parsedResults.push(dataFile);
          console.log('✅ File processed successfully:', file.name);
        } catch (error) {
          console.error('❌ Error processing file:', file.name, error);
          toast({
            title: "File Processing Error",
            description: `Failed to process ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            variant: "destructive",
          });
        }
      }

      setFormState(prev => ({
        ...prev,
        uploading: false,
        parsing: false,
        parsedData: parsedResults
      }));

      toast({
        title: "Upload Successful",
        description: `Successfully processed ${parsedResults.length} file(s)`,
      });

      console.log('✅ All files processed successfully, total:', parsedResults.length);
    } catch (error) {
      console.error('❌ File upload failed:', error);
      setFormState(prev => ({ ...prev, uploading: false, parsing: false }));
      toast({
        title: "Upload Failed",
        description: "There was an error processing your files.",
        variant: "destructive",
      });
    }
  }, [formState.files, toast]);

  const nextStep = useCallback(() => {
    const newStep = Math.min(formState.step + 1, 4);
    console.log('⏭️ Moving to next step:', newStep);
    setFormState(prev => ({ ...prev, step: newStep }));
  }, [formState.step]);

  const prevStep = useCallback(() => {
    const newStep = Math.max(formState.step - 1, 1);
    console.log('⏮️ Moving to previous step:', newStep);
    setFormState(prev => ({ ...prev, step: newStep }));
  }, [formState.step]);

  const resetForm = useCallback(() => {
    console.log('🔄 Resetting form');
    setFormState({
      step: 1,
      researchQuestion: '',
      additionalContext: '',
      files: [],
      uploading: false,
      parsing: false,
      parsedData: [],
      columnMapping: { valueColumns: [], categoryColumns: [] },
      analysisResults: null,
      analysisCompleted: false,
      isProcessingAnalysis: false,
      currentProjectName: ''
    });
  }, []);

  return {
    ...formState,
    setStep,
    setResearchQuestion,
    setAdditionalContext,
    setFiles,
    setParsedData,
    setColumnMapping,
    addFile,
    removeFile,
    handleFileUpload,
    nextStep,
    prevStep,
    resetForm
  };
};
