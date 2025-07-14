
import React from 'react';
import ProjectAnalysisView from '@/components/ProjectAnalysisView';
import AnalysisProgressView from '@/components/project/AnalysisProgressView';
import NewProjectContent from './NewProjectContent';
import ProjectHeader from './ProjectHeader';
import NewProjectLayout from './NewProjectLayout';
import ProjectDialogs from './ProjectDialogs';
import { useProjectContainer } from '@/hooks/useProjectContainer';
import { useAuth } from '@/hooks/useAuth';

const NewProjectContainer = () => {
  console.log('NewProjectContainer component rendering');
  
  const { user, isLoading: authLoading } = useAuth();
  const {
    formData,
    analysisProgress,
    handleAnalysisComplete,
    handleProgressUpdate,
    handleViewResults,
    handleStartAnalysis
  } = useProjectContainer();

  console.log('Current form state:', {
    step: formData.step,
    showAnalysisView: formData.showAnalysisView,
    isProcessingAnalysis: formData.isProcessingAnalysis,
    analysisCompleted: formData.analysisCompleted,
    hasAnalysisResults: !!formData.analysisResults,
    hasData: !!formData.parsedData && formData.parsedData.length > 0,
    dataFiles: formData.parsedData?.length || 0,
    user: user?.email,
    authLoading
  });

  const handleStartAnalysisWrapper = (educationalMode: boolean = false) => {
    console.log('Starting analysis with educational mode:', educationalMode);
    console.log('Form data for analysis:', {
      researchQuestion: formData.researchQuestion?.slice(0, 50) + '...',
      hasAdditionalContext: !!formData.additionalContext,
      educationalMode,
      hasData: !!formData.parsedData && formData.parsedData.length > 0,
      dataCount: formData.parsedData?.length || 0,
      user: user?.email
    });
    
    // Check if user is authenticated before starting analysis
    if (!user && !authLoading) {
      formData.setShowSignInModal(true);
      return;
    }
    
    handleStartAnalysis(
      formData.researchQuestion,
      formData.additionalContext,
      educationalMode,
      formData.parsedData,
      formData.columnMapping
    );
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
        
        <NewProjectContent onStartAnalysis={handleStartAnalysisWrapper} />
      </div>
    </NewProjectLayout>
  );
};

export default NewProjectContainer;
