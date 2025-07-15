
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ParsedDataFile } from '@/types/data';

export interface Dataset {
  id: string;
  user_id: string;
  name: string;
  original_filename: string;
  file_size: number | null;
  mime_type: string | null;
  storage_path: string | null;
  metadata: any;
  summary: any;
  created_at: string;
  updated_at: string;
}

export interface EnhancedDatasetMetadata {
  researchQuestion: string;
  additionalContext: string;
  parsedData: ParsedDataFile[];
  analysisReady: boolean;
  totalFiles: number;
  projectName: string;
}

export const useDatasetPersistence = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchDatasets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('datasets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDatasets(data || []);
    } catch (error: any) {
      console.error('Error fetching datasets:', error);
      toast({
        title: "Error",
        description: "Failed to fetch datasets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveAnalysisProject = async (
    projectName: string,
    researchQuestion: string,
    additionalContext: string,
    parsedData: ParsedDataFile[]
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create enhanced metadata with complete analysis context
      const enhancedMetadata: EnhancedDatasetMetadata = {
        researchQuestion,
        additionalContext,
        parsedData,
        analysisReady: true,
        totalFiles: parsedData.length,
        projectName
      };

      // Calculate total rows across all files
      const totalRows = parsedData.reduce((sum, data) => sum + (data.rowCount || 0), 0);
      const totalColumns = parsedData.reduce((max, data) => 
        Math.max(max, data.columnInfo?.length || 0), 0
      );

      const summary = {
        projectName,
        researchQuestion,
        description: additionalContext,
        totalRows,
        totalColumns,
        filesCount: parsedData.length,
        analysisReady: true,
        possibleUserIdColumns: parsedData[0]?.summary?.possibleUserIdColumns || [],
        possibleEventColumns: parsedData[0]?.summary?.possibleEventColumns || [],
        possibleTimestampColumns: parsedData[0]?.summary?.possibleTimestampColumns || []
      };

      // Use the first file's name or a default
      const primaryFilename = parsedData[0]?.name || 'project_data.csv';

      const { data, error } = await supabase
        .from('datasets')
        .insert([{
          user_id: user.id,
          name: projectName,
          original_filename: primaryFilename,
          file_size: null,
          mime_type: primaryFilename.endsWith('.csv') ? 'text/csv' : 'application/json',
          metadata: enhancedMetadata,
          summary: summary
        }])
        .select()
        .single();

      if (error) throw error;

      setDatasets(prev => [data, ...prev]);
      
      toast({
        title: "Project Saved",
        description: `${projectName} has been saved to your project history.`,
      });

      return data.id;
    } catch (error: any) {
      console.error('Error saving analysis project:', error);
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save project",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Legacy save method for backward compatibility
  const saveDataset = async (filename: string, parsedData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const metadata = {
        columns: parsedData.columns || [],
        sample_rows: parsedData.rows?.slice(0, 10) || []
      };

      const { data, error } = await supabase
        .from('datasets')
        .insert([{
          user_id: user.id,
          name: filename.replace(/\.[^/.]+$/, ""),
          original_filename: filename,
          file_size: null,
          mime_type: filename.endsWith('.csv') ? 'text/csv' : 'application/json',
          metadata: metadata,
          summary: parsedData.summary || {}
        }])
        .select()
        .single();

      if (error) throw error;

      setDatasets(prev => [data, ...prev]);
      
      toast({
        title: "Dataset Saved",
        description: `${filename} has been saved to your account.`,
      });

      return data.id;
    } catch (error: any) {
      console.error('Error saving dataset:', error);
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save dataset",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteDataset = async (id: string) => {
    try {
      const { error } = await supabase
        .from('datasets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDatasets(prev => prev.filter(dataset => dataset.id !== id));
      
      toast({
        title: "Dataset Deleted",
        description: "Dataset has been permanently deleted.",
      });
    } catch (error: any) {
      console.error('Error deleting dataset:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete dataset",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  return {
    datasets,
    loading,
    saveDataset,
    saveAnalysisProject,
    deleteDataset,
    refreshDatasets: fetchDatasets
  };
};
