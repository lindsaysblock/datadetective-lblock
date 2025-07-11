
import React, { useState } from 'react';
import { useNewProjectForm } from '@/hooks/useNewProjectForm';
import ProjectAnalysisView from '@/components/ProjectAnalysisView';
import AnalysisProgressView from '@/components/project/AnalysisProgressView';
import NewProjectContent from './NewProjectContent';
import ProjectHeader from './ProjectHeader';
import NewProjectLayout from './NewProjectLayout';
import ProjectDialogs from './ProjectDialogs';

const NewProjectContainer = () => {
  console.log('NewProjectContainer component rendering');
  
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const formData = useNewProjectForm();

  console.log('Current step:', formData.step);
  console.log('Show analysis view:', formData.showAnalysisView);
  console.log('Is processing analysis:', formData.isProcessingAnalysis);
  console.log('Analysis completed:', formData.analysisCompleted);
  console.log('Analysis results:', formData.analysisResults ? 'Available' : 'None');

  const handleAnalysisComplete = () => {
    console.log('Analysis complete handler called, analysisCompleted:', formData.analysisCompleted);
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
    console.log('View Results clicked - before showResults call');
    console.log('Analysis completed:', formData.analysisCompleted);
    console.log('Analysis results available:', !!formData.analysisResults);
    
    if (formData.analysisCompleted && formData.analysisResults) {
      formData.showResults();
      console.log('showResults called - showAnalysisView should now be:', formData.showAnalysisView);
    } else {
      console.log('Cannot show results - analysis not completed or no results available');
    }
  };

  const handleStartAnalysis = (researchQuestion: string, additionalContext: string, educational: boolean = false, parsedData?: any, columnMapping?: any) => {
    console.log('Starting analysis with:', {
      researchQuestion,
      additionalContext,
      educational,
      parsedData,
      columnMapping
    });
    formData.handleStartAnalysisClick(educational);
  };

  if (formData.showAnalysisView) {
    console.log('Showing analysis view');
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

  console.log('Rendering main NewProjectContainer component');

  return (
    <NewProjectLayout>
      <div className="container mx-auto px-4 py-8">
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
      </div>
    </NewProjectLayout>
  );
};

export default NewProjectContainer;
