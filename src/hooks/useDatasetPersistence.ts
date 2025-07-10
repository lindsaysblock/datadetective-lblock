
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { type ParsedData } from '@/utils/dataParser';

export interface Dataset {
  id: string;
  name: string;
  original_filename: string;
  file_size?: number;
  mime_type?: string;
  storage_path?: string;
  metadata: any;
  summary: any;
  created_at: string;
  updated_at: string;
}

export const useDatasetPersistence = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const saveDataset = async (
    filename: string,
    data: ParsedData,
    file?: File
  ): Promise<string | null> => {
    try {
      setLoading(true);
      
      let storagePath = null;
      
      // Upload file to storage if provided
      if (file) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('datasets')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        storagePath = filePath;
      }

      // Save dataset metadata
      const { data: dataset, error } = await supabase
        .from('datasets')
        .insert({
          name: filename.replace(/\.[^/.]+$/, ''),
          original_filename: filename,
          file_size: file?.size,
          mime_type: file?.type,
          storage_path: storagePath,
          metadata: {
            columns: data.columns,
            sample_rows: data.rows.slice(0, 10)
          },
          summary: data.summary
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Dataset Saved",
        description: `${filename} has been saved to your account.`,
      });

      await fetchDatasets();
      return dataset.id;
    } catch (error: any) {
      console.error('Error saving dataset:', error);
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save dataset",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchDatasets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('datasets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDatasets(data || []);
    } catch (error: any) {
      console.error('Error fetching datasets:', error);
      toast({
        title: "Load Failed",
        description: "Failed to load your datasets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteDataset = async (id: string) => {
    try {
      const { error } = await supabase
        .from('datasets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Dataset Deleted",
        description: "Dataset has been removed from your account.",
      });

      await fetchDatasets();
    } catch (error: any) {
      console.error('Error deleting dataset:', error);
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete dataset",
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
    fetchDatasets,
    deleteDataset
  };
};
