
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
    handleStartAnalysis,
    handleProjectConfirm
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
    authLoading,
    analysisProgress
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
          onProjectConfirm={handleProjectConfirm}
        />

        {/* Show progress overlay when analysis is running */}
        {formData.isProcessingAnalysis && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <h3 className="text-xl font-semibold">Analyzing Your Data</h3>
                <p className="text-gray-600">Please wait while we process your analysis...</p>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${analysisProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500">{Math.round(analysisProgress)}% complete</p>
              </div>
            </div>
          </div>
        )}
        
        <NewProjectContent onStartAnalysis={handleStartAnalysisWrapper} />
      </div>
    </NewProjectLayout>
  );
};

export default NewProjectContainer;
