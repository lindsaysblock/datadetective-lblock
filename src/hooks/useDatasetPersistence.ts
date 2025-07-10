
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

  const saveDataset = async (filename: string, parsedData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Convert data to JSON-compatible format
      const metadata = {
        columns: parsedData.columns || [],
        sample_rows: parsedData.rows?.slice(0, 10) || []
      };

      const { data, error } = await supabase
        .from('datasets')
        .insert([{
          user_id: user.id,
          name: filename.replace(/\.[^/.]+$/, ""), // Remove extension
          original_filename: filename,
          file_size: null, // We'll update this if we have file size
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
    deleteDataset,
    refreshDatasets: fetchDatasets
  };
};
