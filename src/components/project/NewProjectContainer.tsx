
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProjectAnalysisView from '@/components/ProjectAnalysisView';
import NewProjectContent from './NewProjectContent';
import ProjectHeader from './ProjectHeader';
import NewProjectLayout from './NewProjectLayout';
import { useProjectFlowManager } from '@/hooks/useProjectFlowManager';
import { useNewProjectForm } from '@/hooks/useNewProjectForm';
import { useAuth } from '@/hooks/useAuth';
import { useContinueCase } from '@/hooks/useContinueCase';
import { Progress } from '@/components/ui/progress';

const NewProjectContainer = () => {
  console.log('NewProjectContainer component rendering');
  
  const location = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const formData = useNewProjectForm();
  const flowManager = useProjectFlowManager();
  const { reconstructAnalysisState, createMockFilesFromParsedData } = useContinueCase();
  
  const isContinueCase = location.state?.continueInvestigation;

  // Handle continue investigation with improved logic
  useEffect(() => {
    if (location.state?.continueInvestigation && location.state?.dataset) {
      const dataset = location.state.dataset;
      
      console.log('Continue case: Setting up analysis state from dataset:', dataset.id);
      
      try {
        // Reconstruct the complete analysis state
        const analysisState = reconstructAnalysisState(dataset);
        
        console.log('Reconstructed analysis state:', {
          hasResearchQuestion: !!analysisState.researchQuestion,
          hasAdditionalContext: !!analysisState.additionalContext,
          parsedDataCount: analysisState.parsedData.length,
          step: analysisState.step
        });
        
        // Set all form data from reconstructed state
        formData.setResearchQuestion(analysisState.researchQuestion);
        formData.setAdditionalContext(analysisState.additionalContext);
        formData.setParsedData(analysisState.parsedData);
        formData.setStep(analysisState.step);
        
        // Create mock files for the analysis pipeline
        const mockFiles = createMockFilesFromParsedData(analysisState.parsedData);
        formData.setFiles(mockFiles);
        
        console.log('Continue case setup completed successfully');
        
      } catch (error) {
        console.error('Error setting up continue case:', error);
      }
      
      // Clear location state to prevent re-triggering
      window.history.replaceState({}, document.title);
    }
  }, [location.state, formData, reconstructAnalysisState, createMockFilesFromParsedData]);

  console.log('Current flow state:', {
    step: formData.step,
    showAnalysisView: flowManager.showAnalysisView,
    isProcessingData: flowManager.isProcessingData,
    isAnalyzing: flowManager.isAnalyzing,
    analysisCompleted: flowManager.analysisCompleted,
    hasAnalysisResults: !!flowManager.analysisResults,
    hasData: !!formData.parsedData && formData.parsedData.length > 0,
    dataFiles: formData.parsedData?.length || 0,
    hasFiles: !!formData.files && formData.files.length > 0,
    filesCount: formData.files?.length || 0,
    user: user?.email,
    authLoading,
    analysisProgress: flowManager.analysisProgress,
    analysisError: flowManager.analysisError,
    isContinueCase,
    researchQuestion: formData.researchQuestion
  });

  const handleStartAnalysis = async (educationalMode: boolean = false, projectName: string = '') => {
    console.log('🚀 Starting analysis with:', { educationalMode, projectName });
    
    if (!user && !authLoading) {
      console.log('User not authenticated');
      return;
    }

    if (!formData.researchQuestion?.trim()) {
      console.error('Research question is required');
      return;
    }

    let filesToProcess = formData.files;
    
    // For continue case, ensure we have files for the analysis pipeline
    if (isContinueCase && (!filesToProcess || filesToProcess.length === 0)) {
      console.log('Continue case: Creating files from parsed data for analysis');
      filesToProcess = createMockFilesFromParsedData(formData.parsedData);
    }

    if (!filesToProcess || filesToProcess.length === 0) {
      console.error('No files available for analysis');
      return;
    }

    const finalProjectName = projectName || `Investigation ${Date.now()}`;
    
    try {
      console.log('📊 Executing analysis for continue case:', isContinueCase);

      const results = await flowManager.executeFullAnalysis(
        formData.researchQuestion,
        formData.additionalContext || '',
        educationalMode,
        filesToProcess,
        finalProjectName
      );

      console.log('✅ Analysis execution completed:', results);
    } catch (error) {
      console.error('❌ Analysis execution failed:', error);
    }
  };

  const getEstimatedTime = () => {
    if (flowManager.analysisProgress === 0) return 2.0;
    if (flowManager.analysisProgress < 25) return 1.5;
    if (flowManager.analysisProgress < 50) return 1.0;
    if (flowManager.analysisProgress < 75) return 0.5;
    return 0.1;
  };

  const getProgressPhase = () => {
    if (flowManager.analysisProgress < 20) return 'Examining the evidence...';
    if (flowManager.analysisProgress < 40) return 'Following the data trail...';
    if (flowManager.analysisProgress < 60) return 'Connecting the clues...';
    if (flowManager.analysisProgress < 80) return 'Building the case...';
    if (flowManager.analysisProgress < 95) return 'Preparing final report...';
    return 'Case almost solved...';
  };

  // Show analysis view if we have completed analysis
  if (flowManager.showAnalysisView && flowManager.analysisResults) {
    console.log('📊 Rendering analysis view');
    return (
      <ProjectAnalysisView
        projectName={flowManager.currentProjectName}
        analysisResults={flowManager.analysisResults}
        onBackToProject={flowManager.backToProject}
        researchQuestion={formData.researchQuestion}
        additionalContext={formData.additionalContext}
        dataSource={formData.files.length > 0 ? `${formData.files.length} evidence file${formData.files.length > 1 ? 's' : ''}` : 'Database Connection'}
        educationalMode={false}
      />
    );
  }

  return (
    <NewProjectLayout>
      <div className="container mx-auto px-4 py-8" data-testid="new-project-container">
        <ProjectHeader isContinueCase={isContinueCase} />
        
        {/* Processing overlay */}
        {flowManager.isProcessingData && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <h3 className="text-xl font-semibold">🔍 Processing Evidence</h3>
                <p className="text-gray-600">Detective is cataloging your files...</p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced analysis overlay with detective theme */}
        {flowManager.isAnalyzing && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <h3 className="text-xl font-semibold">🕵️ Investigating the Case...</h3>
                <p className="text-gray-600">Detective is analyzing "{flowManager.currentProjectName}"</p>
                
                <div className="space-y-3">
                  <Progress value={flowManager.analysisProgress} className="w-full h-3" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{Math.round(flowManager.analysisProgress)}% complete</span>
                    <span>~{getEstimatedTime().toFixed(1)} min remaining</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <p className="text-sm text-gray-500">{getProgressPhase()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error overlay */}
        {flowManager.analysisError && !flowManager.analysisCompleted && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <div className="text-red-600 text-2xl">🚨</div>
                </div>
                <h3 className="text-xl font-semibold">Investigation Interrupted</h3>
                <p className="text-gray-600">{flowManager.analysisError}</p>
                <div className="flex gap-3 justify-center">
                  <button 
                    onClick={() => handleStartAnalysis(false, flowManager.currentProjectName)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Retry Investigation
                  </button>
                  <button 
                    onClick={() => {
                      flowManager.backToProject();
                      formData.resetForm();
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    New Case
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
