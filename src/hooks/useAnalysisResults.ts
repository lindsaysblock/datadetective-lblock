
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AnalysisResult {
  id: string;
  dataset_id: string;
  user_id: string;
  type: 'insight' | 'finding' | 'visualization';
  title: string;
  description: string | null;
  data: any;
  confidence: 'low' | 'medium' | 'high' | null;
  created_at: string;
  updated_at: string;
}

export const useAnalysisResults = (datasetId?: string) => {
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchResults = async () => {
    if (!datasetId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('analysis_results')
        .select('*')
        .eq('dataset_id', datasetId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setResults(data as AnalysisResult[]);
    } catch (error: any) {
      console.error('Error fetching analysis results:', error);
      toast({
        title: "Error",
        description: "Failed to fetch analysis results",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveResult = async (result: Omit<AnalysisResult, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('analysis_results')
        .insert([{
          ...result,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      setResults(prev => [data as AnalysisResult, ...prev]);
      
      toast({
        title: "Success",
        description: "Analysis result saved successfully",
      });

      return data;
    } catch (error: any) {
      console.error('Error saving analysis result:', error);
      toast({
        title: "Error",
        description: "Failed to save analysis result",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteResult = async (id: string) => {
    try {
      const { error } = await supabase
        .from('analysis_results')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setResults(prev => prev.filter(result => result.id !== id));
      
      toast({
        title: "Success",
        description: "Analysis result deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting analysis result:', error);
      toast({
        title: "Error",
        description: "Failed to delete analysis result",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchResults();
  }, [datasetId]);

  return {
    results,
    loading,
    saveResult,
    deleteResult,
    refreshResults: fetchResults
  };
};
