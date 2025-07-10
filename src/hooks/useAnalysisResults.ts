
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface AnalysisResult {
  id: string;
  dataset_id: string;
  type: 'insight' | 'finding' | 'visualization';
  title: string;
  description?: string;
  data: any;
  confidence: 'low' | 'medium' | 'high';
  created_at: string;
}

export const useAnalysisResults = (datasetId?: string) => {
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const saveResult = async (
    datasetId: string,
    type: 'insight' | 'finding' | 'visualization',
    title: string,
    description: string,
    data: any,
    confidence: 'low' | 'medium' | 'high' = 'medium'
  ) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('analysis_results')
        .insert({
          dataset_id: datasetId,
          type,
          title,
          description,
          data,
          confidence
        });

      if (error) throw error;

      toast({
        title: "Analysis Saved",
        description: `${title} has been saved.`,
      });

      await fetchResults();
    } catch (error: any) {
      console.error('Error saving analysis result:', error);
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save analysis",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('analysis_results')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (datasetId) {
        query = query.eq('dataset_id', datasetId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setResults(data || []);
    } catch (error: any) {
      console.error('Error fetching analysis results:', error);
      toast({
        title: "Load Failed",
        description: "Failed to load analysis results",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteResult = async (id: string) => {
    try {
      const { error } = await supabase
        .from('analysis_results')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Analysis Deleted",
        description: "Analysis result has been removed.",
      });

      await fetchResults();
    } catch (error: any) {
      console.error('Error deleting analysis result:', error);
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete analysis",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (datasetId) {
      fetchResults();
    }
  }, [datasetId]);

  return {
    results,
    loading,
    saveResult,
    fetchResults,
    deleteResult
  };
};
