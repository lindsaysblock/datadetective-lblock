
import React, { useState } from 'react';
import { useNewProjectForm } from '@/hooks/useNewProjectForm';
import { DataAnalysisContext } from '@/types/data';
import ProjectAnalysisView from '@/components/ProjectAnalysisView';
import AnalysisProgressView from '@/components/project/AnalysisProgressView';
import NewProjectContent from './NewProjectContent';
import ProjectHeader from './ProjectHeader';
import NewProjectLayout from './NewProjectLayout';
import ProjectDialogs from './ProjectDialogs';
import ComprehensiveE2ETest from '@/components/testing/ComprehensiveE2ETest';

const NewProjectContainer = () => {
  console.log('NewProjectContainer component rendering');
  
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [showE2ETest, setShowE2ETest] = useState(false);
  const formData = useNewProjectForm();

  console.log('Current form state:', {
    step: formData.step,
    showAnalysisView: formData.showAnalysisView,
    isProcessingAnalysis: formData.isProcessingAnalysis,
    analysisCompleted: formData.analysisCompleted,
    hasAnalysisResults: !!formData.analysisResults,
    hasData: !!formData.parsedData?.length,
    dataFiles: formData.parsedData?.length || 0
  });

  // Auto-show E2E test in development or when URL contains test parameter
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('test') === 'true' || process.env.NODE_ENV === 'development') {
      setShowE2ETest(true);
    }
  }, []);

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
    
    const analysisContext: DataAnalysisContext = {
      researchQuestion,
      additionalContext,
      parsedData: parsedData || formData.parsedData || [],
      columnMapping,
      educationalMode: educational
    };

    await formData.startAnalysis(analysisContext);
    formData.setShowProjectDialog(true);
  };

  if (formData.showAnalysisView) {
    console.log('Rendering analysis view');
    return (
      <ProjectAnalysisView
        projectName={formData.currentProjectName}
        analysisResults={formData.analysisResults}
        onBackToProject={formData.handleBackToProject}
        researchQuestion={formData.researchQuestion}
        additionalContext={formData.additionalContext}
        dataSource={formData.files.length > 0 ? `${formData.files.length} file${formData.files.length > 1 ? 's' : ''}` : 'Database Connection'}
        educationalMode={formData.educationalMode}
      />
    );
  }

  return (
    <NewProjectLayout>
      <div className="container mx-auto px-4 py-8" data-testid="new-project-container">
        <ProjectHeader />
        
        <ProjectDialogs
          formData={formData}
          analysisProgress={analysisProgress}
          onViewResults={handleViewResults}
        />

        <AnalysisProgressView
          isAnalyzing={formData.isProcessingAnalysis && !formData.showProjectDialog}
          onComplete={handleAnalysisComplete}
          onProgressUpdate={handleProgressUpdate}
        />
        
        <NewProjectContent {...formData} onStartAnalysis={handleStartAnalysis} />

        {showE2ETest && (
          <div className="mt-8">
            <ComprehensiveE2ETest />
          </div>
        )}
      </div>
    </NewProjectLayout>
  );
};

export default NewProjectContainer;
