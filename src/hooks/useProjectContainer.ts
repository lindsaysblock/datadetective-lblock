
import { useState } from 'react';
import { useNewProjectForm } from '@/hooks/useNewProjectForm';
import { DataAnalysisContext } from '@/types/data';

export const useProjectContainer = () => {
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const formData = useNewProjectForm();

  const handleAnalysisComplete = () => {
    console.log('Analysis complete handler called');
    if (formData.analysisCompleted && formData.analysisResults) {
      console.log('Showing results now');
      formData.showResults();
    }
  };

  const handleProgressUpdate = (progress: number) => {
    console.log('Progress update:', progress);
    setAnalysisProgress(progress);
  };

  const handleViewResults = () => {
    console.log('View Results clicked');
    if (formData.analysisCompleted && formData.analysisResults) {
      formData.showResults();
    } else {
      console.log('Cannot show results - analysis not ready');
    }
  };

  const handleStartAnalysis = async (
    researchQuestion: string,
    additionalContext: string,
    educational: boolean = false,
    parsedData?: any,
    columnMapping?: any
  ) => {
    console.log('🚀 Starting analysis in container');
    
    const dataArray = parsedData && parsedData.rows ? parsedData.rows : (Array.isArray(parsedData) ? parsedData : []);
    
    const analysisContext: DataAnalysisContext = {
      researchQuestion,
      additionalContext,
      parsedData: dataArray,
      columnMapping,
      educationalMode: educational
    };

    await formData.startAnalysis(analysisContext);
    formData.setShowProjectDialog(true);
  };

  return {
    formData,
    analysisProgress,
    handleAnalysisComplete,
    handleProgressUpdate,
    handleViewResults,
    handleStartAnalysis
  };
};
