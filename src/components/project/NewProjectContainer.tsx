
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
    analysisProgress,
    analysisError: formData.analysisError
  });

  const handleStartAnalysisWrapper = (educationalMode: boolean = false, projectName: string = '') => {
    console.log('Starting analysis with:', { educationalMode, projectName });
    console.log('Form data for analysis:', {
      researchQuestion: formData.researchQuestion?.slice(0, 50) + '...',
      hasAdditionalContext: !!formData.additionalContext,
      educationalMode,
      projectName,
      hasData: !!formData.parsedData && formData.parsedData.length > 0,
      dataCount: formData.parsedData?.length || 0,
      user: user?.email
    });
    
    // Check if user is authenticated before starting analysis
    if (!user && !authLoading) {
      formData.setShowSignInModal(true);
      return;
    }

    // Clear any previous errors
    formData.setAnalysisError(null);

    // Set the project name first
    if (projectName) {
      formData.setCurrentProjectName(projectName);
    }
    
    // Start analysis with proper error handling
    try {
      handleStartAnalysis(
        formData.researchQuestion,
        formData.additionalContext,
        educationalMode,
        formData.parsedData,
        formData.columnMapping
      );
    } catch (error) {
      console.error('Error starting analysis:', error);
      // Show error to user instead of navigating away
      formData.setAnalysisError('We encountered an issue while analyzing your data. This could be due to data format issues or temporary processing problems.');
    }
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

        {/* Show error state only if analysis failed AND not completed */}
        {formData.analysisError && !formData.analysisCompleted && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                  <div className="text-yellow-600 text-2xl">⚠️</div>
                </div>
                <h3 className="text-xl font-semibold">Analysis Error</h3>
                <p className="text-gray-600">{formData.analysisError}</p>
                <div className="flex gap-3 justify-center">
                  <button 
                    onClick={() => {
                      formData.setAnalysisError(null);
                      // Retry analysis
                      handleStartAnalysisWrapper(formData.educationalMode, formData.currentProjectName);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Try Again
                  </button>
                  <button 
                    onClick={() => {
                      formData.setAnalysisError(null);
                      formData.resetForm();
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Start New Project
                  </button>
                </div>
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
