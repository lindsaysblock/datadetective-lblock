
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { parseFile, type ParsedData } from '@/utils/dataParser';
import { DataValidator } from '@/utils/analysis/dataValidator';
import { ParsedDataFile } from '@/types/data';

interface DataPipelineState {
  isProcessing: boolean;
  error: string | null;
  parsedData: ParsedDataFile[];
  validationResults: any[];
}

export const useDataPipeline = () => {
  const [state, setState] = useState<DataPipelineState>({
    isProcessing: false,
    error: null,
    parsedData: [],
    validationResults: []
  });
  const { toast } = useToast();

  const processFiles = useCallback(async (files: File[]): Promise<ParsedDataFile[]> => {
    console.log('🔄 Processing files through data pipeline:', files.length);
    
    setState(prev => ({ ...prev, isProcessing: true, error: null }));

    try {
      const results: ParsedDataFile[] = [];
      
      for (const file of files) {
        console.log('📁 Processing file:', file.name);
        
        const parsedData = await parseFile(file);
        
        // Convert to ParsedDataFile format
        const dataFile: ParsedDataFile = {
          id: `file-${Date.now()}-${Math.random()}`,
          name: file.name,
          rows: parsedData.rowCount,
          columns: parsedData.columns.length,
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

        // Validate the data
        try {
          const validator = new DataValidator(parsedData);
          const validation = validator.validate();
          
          if (!validation.isValid && validation.errors.length > 0) {
            console.warn('⚠️ Data validation issues:', validation.errors);
          }
          
          setState(prev => ({
            ...prev,
            validationResults: [...prev.validationResults, {
              fileId: dataFile.id,
              validation
            }]
          }));
        } catch (validationError) {
          console.warn('⚠️ Validation failed, proceeding anyway:', validationError);
        }

        results.push(dataFile);
        console.log('✅ File processed successfully:', dataFile.name);
      }

      setState(prev => ({
        ...prev,
        isProcessing: false,
        parsedData: results,
        error: null
      }));

      toast({
        title: "Files Processed Successfully",
        description: `Processed ${results.length} file(s) with ${results.reduce((total, file) => total + file.rows, 0)} total rows.`,
      });

      return results;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'File processing failed';
      console.error('❌ Data pipeline error:', error);
      
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: errorMessage
      }));

      toast({
        title: "Processing Failed",
        description: errorMessage,
        variant: "destructive",
      });

      throw error;
    }
  }, [toast]);

  const clearPipeline = useCallback(() => {
    setState({
      isProcessing: false,
      error: null,
      parsedData: [],
      validationResults: []
    });
  }, []);

  return {
    ...state,
    processFiles,
    clearPipeline
  };
};
