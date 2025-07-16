
/**
 * Dataset Persistence Hook
 * Handles saving and loading datasets from Supabase
 * Refactored for consistency and maintainability
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ParsedDataFile } from '@/types/data';
import { supabase } from '@/integrations/supabase/client';

export interface Dataset {
  id: string;
  name: string;
  created_at: string;
  updated_at?: string;
  original_filename: string;
  file_size?: number;
  mime_type?: string;
  metadata?: any;
  summary?: any;
  user_id: string;
}

export interface EnhancedDatasetMetadata {
  projectName: string;
  researchQuestion: string;
  additionalContext: string;
  uploadedAt: string;
  fileCount: number;
  totalRows: number;
  totalColumns: number;
  analysisReady?: boolean;
  parsedData?: ParsedDataFile[];
  analysisConfig?: any;
  [key: string]: any;
}

export const useDatasetPersistence = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch datasets
  const fetchDatasets = async () => {
    if (!user) {
      setDatasets([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('datasets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDatasets(data || []);
    } catch (error) {
      console.error('Error fetching datasets:', error);
      setDatasets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, [user]);

  // Save dataset (legacy function)
  const saveDataset = async (filename: string, data: any) => {
    if (!user) {
      throw new Error('User must be authenticated to save datasets');
    }

    try {
      const datasetRecord = {
        user_id: user.id,
        name: filename.replace(/\.[^/.]+$/, ''), // Remove file extension
        original_filename: filename,
        metadata: data,
        summary: data.summary || {}
      };

      const { data: savedDataset, error } = await supabase
        .from('datasets')
        .insert(datasetRecord)
        .select()
        .single();

      if (error) throw error;

      // Refresh datasets
      await fetchDatasets();
      
      return savedDataset.id;
    } catch (error) {
      console.error('Error saving dataset:', error);
      throw error;
    }
  };

  // Save analysis project (new enhanced function)
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
        analysisReady: true,
        parsedData: parsedData,
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
      
      // Refresh datasets
      await fetchDatasets();
      
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

  // Delete dataset
  const deleteDataset = async (datasetId: string) => {
    if (!user) {
      throw new Error('User must be authenticated to delete datasets');
    }

    try {
      const { error } = await supabase
        .from('datasets')
        .delete()
        .eq('id', datasetId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh datasets
      await fetchDatasets();
    } catch (error) {
      console.error('Error deleting dataset:', error);
      throw error;
    }
  };

  const refreshDatasets = fetchDatasets;

  return {
    datasets,
    loading,
    isSaving,
    saveError,
    saveDataset,
    saveAnalysisProject,
    deleteDataset,
    refreshDatasets
  };
};
