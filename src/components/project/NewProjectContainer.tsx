
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProjectAnalysisView from '@/components/ProjectAnalysisView';
import NewProjectContent from './NewProjectContent';
import ProjectHeader from './ProjectHeader';
import NewProjectLayout from './NewProjectLayout';
import { useProjectFlowManager } from '@/hooks/useProjectFlowManager';
import { useNewProjectForm } from '@/hooks/useNewProjectForm';
import { useAuth } from '@/hooks/useAuth';

const NewProjectContainer = () => {
  console.log('NewProjectContainer component rendering');
  
  const location = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const formData = useNewProjectForm();
  const flowManager = useProjectFlowManager();
  const isContinueCase = location.state?.continueInvestigation;

  // Handle continue investigation from query history
  useEffect(() => {
    if (location.state?.continueInvestigation && location.state?.dataset) {
      const dataset = location.state.dataset;
      const step = location.state.step || 4;
      
      console.log('Continuing investigation with dataset:', dataset);
      
      // Reconstruct the form data from the dataset
      const reconstructedParsedData = [{
        id: dataset.id,
        name: dataset.original_filename,
        columns: dataset.metadata?.columns || [],
        rows: dataset.metadata?.sample_rows || [],
        rowCount: dataset.metadata?.totalRows || 0,
        summary: dataset.summary
      }];
      
      // Set the form data
      formData.setResearchQuestion(dataset.summary?.researchQuestion || '');
      formData.setAdditionalContext(dataset.summary?.description || '');
      formData.setParsedData(reconstructedParsedData);
      formData.setStep(step);
      
      // Create mock files for the form
      const mockFiles = [{
        name: dataset.original_filename,
        type: dataset.mime_type || 'text/csv',
        size: dataset.file_size || 0,
        lastModified: new Date(dataset.created_at).getTime()
      }];
      formData.setFiles(mockFiles as File[]);
      
      // Clear the location state to prevent re-triggering
      window.history.replaceState({}, document.title);
    }
  }, [location.state, formData]);

  console.log('Current flow state:', {
    step: formData.step,
    showAnalysisView: flowManager.showAnalysisView,
    isProcessingData: flowManager.isProcessingData,
    isAnalyzing: flowManager.isAnalyzing,
    analysisCompleted: flowManager.analysisCompleted,
    hasAnalysisResults: !!flowManager.analysisResults,
    hasData: !!formData.parsedData && formData.parsedData.length > 0,
    dataFiles: formData.parsedData?.length || 0,
    user: user?.email,
    authLoading,
    analysisProgress: flowManager.analysisProgress,
    analysisError: flowManager.analysisError,
    isContinueCase
  });

  const handleStartAnalysis = async (educationalMode: boolean = false, projectName: string = '') => {
    console.log('Starting analysis with:', { educationalMode, projectName });
    
    // Check authentication
    if (!user && !authLoading) {
      console.log('User not authenticated');
      return;
    }

    // Validate form data
    if (!formData.researchQuestion?.trim()) {
      console.error('Research question is required');
      return;
    }

    if (!formData.files || formData.files.length === 0) {
      console.error('Files are required');
      return;
    }

    const finalProjectName = projectName || `Analysis ${Date.now()}`;
    
    try {
      console.log('Calling flowManager.executeFullAnalysis with:', {
        researchQuestion: formData.researchQuestion,
        additionalContext: formData.additionalContext || '',
        educationalMode,
        filesCount: formData.files.length,
        projectName: finalProjectName
      });

      const results = await flowManager.executeFullAnalysis(
        formData.researchQuestion,
        formData.additionalContext || '',
        educationalMode,
        formData.files,
        finalProjectName
      );

      console.log('Analysis execution completed:', results);
    } catch (error) {
      console.error('Analysis execution failed:', error);
    }
  };

  // Calculate estimated time based on progress
  const getEstimatedTime = () => {
    if (flowManager.analysisProgress === 0) return 2;
    if (flowManager.analysisProgress < 25) return 1.5;
    if (flowManager.analysisProgress < 50) return 1;
    if (flowManager.analysisProgress < 75) return 0.5;
    return 0.1;
  };

  // Show analysis view if we have completed analysis
  if (flowManager.showAnalysisView && flowManager.analysisResults) {
    console.log('Rendering analysis view');
    return (
      <ProjectAnalysisView
        projectName={flowManager.currentProjectName}
        analysisResults={flowManager.analysisResults}
        onBackToProject={flowManager.backToProject}
        researchQuestion={formData.researchQuestion}
        additionalContext={formData.additionalContext}
        dataSource={formData.files.length > 0 ? `${formData.files.length} file${formData.files.length > 1 ? 's' : ''}` : 'Database Connection'}
        educationalMode={false}
      />
    );
  }

  return (
    <NewProjectLayout>
      <div className="container mx-auto px-4 py-8" data-testid="new-project-container">
        <ProjectHeader isContinueCase={isContinueCase} />
        
        {/* Show processing overlay when data is being processed */}
        {flowManager.isProcessingData && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <h3 className="text-xl font-semibold">Processing Your Data</h3>
                <p className="text-gray-600">Please wait while we process your files...</p>
              </div>
            </div>
          </div>
        )}

        {/* Show analysis overlay when analysis is running */}
        {flowManager.isAnalyzing && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <h3 className="text-xl font-semibold">Analyzing Your Data...</h3>
                <p className="text-gray-600">Please wait while we process your analysis for "{flowManager.currentProjectName}"</p>
                
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${flowManager.analysisProgress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{Math.round(flowManager.analysisProgress)}% complete</span>
                    <span>~{getEstimatedTime()} min remaining</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500">Running analysis on your dataset...</p>
              </div>
            </div>
          </div>
        )}

        {/* Show error overlay only for true analysis failures */}
        {flowManager.analysisError && !flowManager.analysisCompleted && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                  <div className="text-yellow-600 text-2xl">⚠️</div>
                </div>
                <h3 className="text-xl font-semibold">Analysis Error</h3>
                <p className="text-gray-600">{flowManager.analysisError}</p>
                <div className="flex gap-3 justify-center">
                  <button 
                    onClick={() => handleStartAnalysis(false, flowManager.currentProjectName)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Try Again
                  </button>
                  <button 
                    onClick={() => {
                      flowManager.backToProject();
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
        
        <NewProjectContent onStartAnalysis={handleStartAnalysis} />
      </div>
    </NewProjectLayout>
  );
};

export default NewProjectContainer;
