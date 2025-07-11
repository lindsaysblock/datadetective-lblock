
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DataAnalysisContext } from '@/types/data';
import { useProjectFormData } from './useProjectFormData';

export const useNewProjectForm = () => {
  const formData = useProjectFormData();
  const [showAnalysisView, setShowAnalysisView] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  const [isProcessingAnalysis, setIsProcessingAnalysis] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [currentProjectName, setCurrentProjectName] = useState('');
  const [educationalMode, setEducationalMode] = useState(false);
  const { toast } = useToast();

  console.log('useNewProjectForm hook called');
  console.log('useNewProjectForm returning step:', formData.step);
  console.log('useNewProjectForm parsedData:', formData.parsedData.length > 0 ? 'has data' : 'no data');

  const startAnalysis = async (context: DataAnalysisContext) => {
    console.log('🚀 Starting analysis with context:', context);
    setIsProcessingAnalysis(true);
    setEducationalMode(context.educationalMode || false);
    
    // Mock analysis process
    setTimeout(() => {
      const mockResults = {
        summary: "Analysis completed successfully",
        insights: [
          "Key pattern detected in the data",
          "Significant correlation found",
          "Outliers identified and analyzed"
        ],
        recommendations: [
          "Consider focusing on high-performing segments",
          "Investigate the outlier cases",
          "Monitor trends over time"
        ],
        questionLog: []
      };
      
      setAnalysisResults(mockResults);
      setAnalysisCompleted(true);
      setIsProcessingAnalysis(false);
      
      toast({
        title: "Analysis Complete!",
        description: "Your data analysis has finished successfully.",
      });
    }, 3000);
  };

  const showResults = () => {
    console.log('Showing analysis results');
    setShowAnalysisView(true);
  };

  const handleBackToProject = () => {
    setShowAnalysisView(false);
  };

  return {
    ...formData,
    showAnalysisView,
    analysisResults,
    analysisCompleted,
    isProcessingAnalysis,
    showProjectDialog,
    currentProjectName,
    educationalMode,
    setShowProjectDialog,
    setCurrentProjectName,
    startAnalysis,
    showResults,
    handleBackToProject
  };
};
