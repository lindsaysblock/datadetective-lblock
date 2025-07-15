
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ParsedDataFile } from '@/types/data';

interface EnhancedDatasetMetadata {
  projectName: string;
  researchQuestion: string;
  additionalContext: string;
  uploadedAt: string;
  fileCount: number;
  totalRows: number;
  totalColumns: number;
  analysisConfig?: any;
  [key: string]: any;
}

export const useDatasetPersistence = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { user } = useAuth();

  const saveAnalysisProject = async (
    projectName: string,
    researchQuestion: string,
    additionalContext: string,
    parsedData: ParsedDataFile[]
  ) => {
    if (!user) {
      throw new Error('User must be authenticated to save analysis projects');
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      console.log('🔍 Saving detective case file:', projectName);
      
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Calculate totals
      const totalRows = parsedData.reduce((sum, file) => sum + (file.rows || 0), 0);
      const totalColumns = parsedData.reduce((sum, file) => sum + (file.columns || 0), 0);
      
      // Create enhanced metadata
      const metadata: EnhancedDatasetMetadata = {
        projectName,
        researchQuestion,
        additionalContext,
        uploadedAt: new Date().toISOString(),
        fileCount: parsedData.length,
        totalRows,
        totalColumns,
        analysisConfig: {
          educationalMode: false,
          detectiveTheme: true
        }
      };

      // Create summary data with better structure
      const summary = {
        projectName,
        researchQuestion,
        additionalContext,
        totalRows,
        totalColumns,
        fileCount: parsedData.length,
        files: parsedData.map(file => ({
          name: file.name,
          rows: file.rows,
          columns: file.columns
        })),
        possibleUserIdColumns: parsedData.flatMap(file => 
          file.summary?.possibleUserIdColumns || []
        ),
        possibleEventColumns: parsedData.flatMap(file => 
          file.summary?.possibleEventColumns || []
        ),
        possibleTimestampColumns: parsedData.flatMap(file => 
          file.summary?.possibleTimestampColumns || []
        )
      };

      // Convert ParsedDataFile objects to plain objects for JSON compatibility
      const plainParsedData = parsedData.map(file => ({
        id: file.id,
        name: file.name,
        rows: file.rows,
        columns: file.columns,
        rowCount: file.rowCount,
        preview: file.preview,
        data: file.data,
        columnInfo: file.columnInfo,
        summary: file.summary
      }));

      // Save to datasets table
      const datasetRecord = {
        user_id: user.id,
        name: projectName,
        original_filename: `${projectName}_evidence.json`,
        file_size: null,
        mime_type: 'application/json',
        metadata: metadata as any,
        summary: summary as any
      };

      console.log('💾 Saving dataset record to Supabase...');
      
      const { data: savedDataset, error: saveError } = await supabase
        .from('datasets')
        .insert(datasetRecord)
        .select()
        .single();

      if (saveError) {
        console.error('❌ Error saving case file to database:', saveError);
        throw new Error(`Failed to save case file: ${saveError.message}`);
      }

      console.log('✅ Detective case file saved successfully:', savedDataset.id);
      
      return savedDataset;

    } catch (error) {
      console.error('❌ Failed to save detective case file:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred while saving case file';
      setSaveError(errorMessage);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveAnalysisProject,
    isSaving,
    saveError
  };
};
