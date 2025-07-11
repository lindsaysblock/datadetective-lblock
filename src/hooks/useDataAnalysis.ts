
import { useState, useCallback } from 'react';
import { DataAnalysisContext, AnalysisResults } from '@/types/data';
import { AnalysisCoordinator } from '@/services/analysis/analysisCoordinator';
import { useToast } from '@/hooks/use-toast';

export const useDataAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const { toast } = useToast();

  const analyzeData = useCallback(async (context: DataAnalysisContext): Promise<AnalysisResults | null> => {
    if (isAnalyzing) {
      console.warn('Analysis already in progress');
      return null;
    }

    console.log('🔍 Starting REAL data analysis with context:', {
      hasResearchQuestion: !!context.researchQuestion,
      hasData: !!context.parsedData?.length,
      dataCount: context.parsedData?.length || 0,
      dataStructure: context.parsedData?.[0] ? {
        rows: context.parsedData[0].rows?.length || 0,
        columns: context.parsedData[0].columns?.length || 0,
        sampleColumns: context.parsedData[0].columns?.slice(0, 3) || []
      } : 'No data structure'
    });

    setIsAnalyzing(true);
    setAnalysisError(null);
    
    try {
      // Use AnalysisCoordinator directly for real analysis
      const report = await AnalysisCoordinator.executeAnalysis(context);
      
      console.log('✅ Real analysis completed:', {
        confidence: report.confidence,
        insightsCount: report.insights?.length || 0,
        resultsCount: report.results?.length || 0,
        recommendationsCount: report.recommendations?.length || 0
      });

      // Transform the report to the expected format
      const results: AnalysisResults = {
        insights: Array.isArray(report.insights) ? report.insights.join('\n\n') : report.insights || 'No insights generated',
        confidence: report.confidence || 'medium',
        recommendations: report.recommendations || [],
        detailedResults: report.results?.map(result => ({
          id: result.id,
          title: result.title,
          description: result.description,
          value: result.value,
          insight: result.description,
          confidence: result.confidence
        })) || [],
        sqlQuery: report.sqlQuery || '-- No query generated',
        queryBreakdown: report.queryBreakdown ? {
          steps: report.queryBreakdown.map((step, index) => ({
            step: index + 1,
            title: `Step ${index + 1}`,
            description: step,
            code: step,
            explanation: step
          }))
        } : undefined
      };

      setAnalysisResults(results);
      
      toast({
        title: "Real Analysis Complete",
        description: `Analysis completed with ${report.results?.length || 0} findings and ${report.insights?.length || 0} insights.`,
      });

      return results;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Real analysis failed';
      console.error('❌ Real analysis failed:', error);
      
      setAnalysisError(errorMessage);
      
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });

      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [isAnalyzing, toast]);

  const clearAnalysis = useCallback(() => {
    setAnalysisResults(null);
    setAnalysisError(null);
  }, []);

  return {
    isAnalyzing,
    analysisResults,
    analysisError,
    analyzeData,
    clearAnalysis
  };
};
