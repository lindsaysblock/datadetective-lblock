
import { useState, useCallback } from 'react';
import { QuestionLog, EnhancedAnalysisResults, DataAnalysisContext } from '@/types/data';
import { useDataAnalysis } from './useDataAnalysis';
import { useToast } from '@/hooks/use-toast';

export const useQuestionLog = () => {
  const [questionLog, setQuestionLog] = useState<QuestionLog[]>([]);
  const [generatedVisuals, setGeneratedVisuals] = useState<any[]>([]);
  const { analyzeData, isAnalyzing } = useDataAnalysis();
  const { toast } = useToast();

  const addQuestion = useCallback(async (
    question: string,
    context: DataAnalysisContext
  ): Promise<QuestionLog | null> => {
    console.log('🔍 Adding new question to analysis:', question);
    
    try {
      // Create enhanced context with the new question
      const enhancedContext = {
        ...context,
        researchQuestion: question,
        additionalContext: `${context.additionalContext}\n\nPrevious questions: ${questionLog.map(q => q.question).join('; ')}`
      };

      const results = await analyzeData(enhancedContext);
      
      if (results) {
        const newQuestionLog: QuestionLog = {
          id: Date.now().toString(),
          question,
          answer: results.insights,
          timestamp: new Date(),
          confidence: results.confidence,
          visualizations: []
        };

        setQuestionLog(prev => [...prev, newQuestionLog]);
        
        toast({
          title: "Question Analyzed",
          description: "Your additional question has been processed successfully.",
        });

        return newQuestionLog;
      }
    } catch (error) {
      console.error('❌ Failed to analyze question:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze your question. Please try again.",
        variant: "destructive",
      });
    }

    return null;
  }, [analyzeData, questionLog, toast]);

  const addVisualization = useCallback((questionId: string, visual: any) => {
    const newVisual = {
      id: Date.now().toString(),
      questionId,
      ...visual
    };
    
    setGeneratedVisuals(prev => [...prev, newVisual]);
    
    // Update the question log to include this visualization
    setQuestionLog(prev => prev.map(q => 
      q.id === questionId 
        ? { ...q, visualizations: [...(q.visualizations || []), newVisual.id] }
        : q
    ));
  }, []);

  const exportQuestionLog = useCallback(() => {
    const exportData = {
      questionLog,
      generatedVisuals,
      exportDate: new Date(),
      totalQuestions: questionLog.length,
      totalVisuals: generatedVisuals.length
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `question-log-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [questionLog, generatedVisuals]);

  const clearQuestionLog = useCallback(() => {
    setQuestionLog([]);
    setGeneratedVisuals([]);
  }, []);

  return {
    questionLog,
    generatedVisuals,
    isAnalyzing,
    addQuestion,
    addVisualization,
    exportQuestionLog,
    clearQuestionLog
  };
};
