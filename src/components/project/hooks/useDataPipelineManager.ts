
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { parseFile, type ParsedData } from '@/utils/dataParser';
import { DataConnectors } from '@/utils/dataConnectors';
import { DataValidator } from '@/utils/analysis/dataValidator';

interface DataPipelineState {
  sources: DataSource[];
  processing: boolean;
  errors: string[];
  validationResults: ValidationResult[];
}

interface DataSource {
  id: string;
  type: 'file' | 'paste' | 'database' | 'api';
  status: 'pending' | 'processing' | 'completed' | 'error';
  data?: ParsedData;
  error?: string;
}

interface ValidationResult {
  sourceId: string;
  isValid: boolean;
  errors: string[];
  warnings: string[];
  completeness: number;
}

export const useDataPipelineManager = () => {
  const [state, setState] = useState<DataPipelineState>({
    sources: [],
    processing: false,
    errors: [],
    validationResults: []
  });
  const { toast } = useToast();

  const addFileSource = useCallback(async (file: File): Promise<string> => {
    const sourceId = `file-${Date.now()}-${Math.random()}`;
    
    setState(prev => ({
      ...prev,
      sources: [...prev.sources, {
        id: sourceId,
        type: 'file',
        status: 'processing'
      }]
    }));

    try {
      const parsedData = await parseFile(file);
      const validator = new DataValidator(parsedData);
      const validation = validator.validate();

      setState(prev => ({
        ...prev,
        sources: prev.sources.map(s => 
          s.id === sourceId 
            ? { ...s, status: 'completed', data: parsedData }
            : s
        ),
        validationResults: [...prev.validationResults, {
          sourceId,
          isValid: validation.isValid,
          errors: validation.errors,
          warnings: validation.warnings,
          completeness: validation.completeness
        }]
      }));

      toast({
        title: "File Processed",
        description: `Successfully processed ${file.name}`,
      });

      return sourceId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({
        ...prev,
        sources: prev.sources.map(s => 
          s.id === sourceId 
            ? { ...s, status: 'error', error: errorMessage }
            : s
        ),
        errors: [...prev.errors, errorMessage]
      }));

      toast({
        title: "Processing Failed",
        description: `Failed to process ${file.name}: ${errorMessage}`,
        variant: "destructive",
      });

      throw error;
    }
  }, [toast]);

  const addPastedDataSource = useCallback(async (data: string): Promise<string> => {
    const sourceId = `paste-${Date.now()}-${Math.random()}`;
    
    setState(prev => ({
      ...prev,
      sources: [...prev.sources, {
        id: sourceId,
        type: 'paste',
        status: 'processing'
      }]
    }));

    try {
      const parsedData = await DataConnectors.processPastedData(data);
      const validator = new DataValidator(parsedData);
      const validation = validator.validate();

      setState(prev => ({
        ...prev,
        sources: prev.sources.map(s => 
          s.id === sourceId 
            ? { ...s, status: 'completed', data: parsedData }
            : s
        ),
        validationResults: [...prev.validationResults, {
          sourceId,
          isValid: validation.isValid,
          errors: validation.errors,
          warnings: validation.warnings,
          completeness: validation.completeness
        }]
      }));

      toast({
        title: "Data Processed",
        description: "Successfully processed pasted data",
      });

      return sourceId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({
        ...prev,
        sources: prev.sources.map(s => 
          s.id === sourceId 
            ? { ...s, status: 'error', error: errorMessage }
            : s
        ),
        errors: [...prev.errors, errorMessage]
      }));

      toast({
        title: "Processing Failed",
        description: `Failed to process pasted data: ${errorMessage}`,
        variant: "destructive",
      });

      throw error;
    }
  }, [toast]);

  const addDatabaseSource = useCallback(async (config: any): Promise<string> => {
    const sourceId = `db-${Date.now()}-${Math.random()}`;
    
    setState(prev => ({
      ...prev,
      sources: [...prev.sources, {
        id: sourceId,
        type: 'database',
        status: 'processing'
      }]
    }));

    try {
      const parsedData = await DataConnectors.connectDatabase(config);
      const validator = new DataValidator(parsedData);
      const validation = validator.validate();

      setState(prev => ({
        ...prev,
        sources: prev.sources.map(s => 
          s.id === sourceId 
            ? { ...s, status: 'completed', data: parsedData }
            : s
        ),
        validationResults: [...prev.validationResults, {
          sourceId,
          isValid: validation.isValid,
          errors: validation.errors,
          warnings: validation.warnings,
          completeness: validation.completeness
        }]
      }));

      toast({
        title: "Database Connected",
        description: "Successfully connected to database",
      });

      return sourceId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({
        ...prev,
        sources: prev.sources.map(s => 
          s.id === sourceId 
            ? { ...s, status: 'error', error: errorMessage }
            : s
        ),
        errors: [...prev.errors, errorMessage]
      }));

      toast({
        title: "Connection Failed",
        description: `Failed to connect to database: ${errorMessage}`,
        variant: "destructive",
      });

      throw error;
    }
  }, [toast]);

  const removeSource = useCallback((sourceId: string) => {
    setState(prev => ({
      ...prev,
      sources: prev.sources.filter(s => s.id !== sourceId),
      validationResults: prev.validationResults.filter(v => v.sourceId !== sourceId)
    }));
  }, []);

  const getCompletedSources = useCallback(() => {
    return state.sources.filter(s => s.status === 'completed' && s.data);
  }, [state.sources]);

  const getAllParsedData = useCallback((): ParsedData[] => {
    return state.sources
      .filter(s => s.status === 'completed' && s.data)
      .map(s => s.data!)
      .filter(Boolean);
  }, [state.sources]);

  const hasValidData = useCallback(() => {
    return state.validationResults.some(v => v.isValid);
  }, [state.validationResults]);

  return {
    state,
    addFileSource,
    addPastedDataSource,
    addDatabaseSource,
    removeSource,
    getCompletedSources,
    getAllParsedData,
    hasValidData
  };
};
