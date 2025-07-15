import React, { useEffect, useState } from 'react';
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
  console.log('🕵️ NewProjectContainer component rendering');
  
  const location = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const formData = useNewProjectForm();
  const flowManager = useProjectFlowManager();
  const { reconstructAnalysisState, createMockFilesFromParsedData } = useContinueCase();
  
  const [continueSetupComplete, setContinueSetupComplete] = useState(false);
  const [continueSetupError, setContinueSetupError] = useState<string | null>(null);
  
  const isContinueCase = location.state?.continueInvestigation;

  // Handle continue investigation with improved error handling
  useEffect(() => {
    if (location.state?.continueInvestigation && location.state?.dataset && !continueSetupComplete) {
      const dataset = location.state.dataset;
      
      console.log('🔍 Continue case detected - Setting up analysis state from dataset:', dataset.id);
      
      try {
        // Reconstruct the complete analysis state
        const analysisState = reconstructAnalysisState(dataset);
        
        console.log('📊 Reconstructed analysis state:', {
          hasResearchQuestion: !!analysisState.researchQuestion,
          hasAdditionalContext: !!analysisState.additionalContext,
          parsedDataCount: analysisState.parsedData.length,
          step: analysisState.step,
          projectName: analysisState.projectName
        });
        
        // Validate reconstructed data
        if (!analysisState.parsedData || analysisState.parsedData.length === 0) {
          throw new Error('No data found in dataset for analysis');
        }
        
        if (!analysisState.researchQuestion) {
          throw new Error('No research question found in dataset');
        }
        
        // Set all form data from reconstructed state
        formData.setResearchQuestion(analysisState.researchQuestion);
        formData.setAdditionalContext(analysisState.additionalContext);
        formData.setParsedData(analysisState.parsedData);
        formData.setStep(analysisState.step);
        
        // Create mock files for the analysis pipeline
        const mockFiles = createMockFilesFromParsedData(analysisState.parsedData);
        formData.setFiles(mockFiles);
        
        console.log('✅ Continue case setup completed successfully:', {
          filesCreated: mockFiles.length,
          totalFileSize: mockFiles.reduce((sum, file) => sum + file.size, 0),
          researchQuestion: analysisState.researchQuestion
        });
        
        setContinueSetupComplete(true);
        setContinueSetupError(null);
        
      } catch (error) {
        console.error('❌ Error setting up continue case:', error);
        setContinueSetupError(error instanceof Error ? error.message : 'Failed to setup continue case');
      }
      
      // Clear location state to prevent re-triggering
      window.history.replaceState({}, document.title);
    }
  }, [location.state, formData, reconstructAnalysisState, createMockFilesFromParsedData, continueSetupComplete]);

  console.log('🕵️ Current investigation state:', {
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
    continueSetupComplete,
    continueSetupError,
    researchQuestion: formData.researchQuestion
  });

  const handleStartAnalysis = async (educationalMode: boolean = false, projectName: string = '') => {
    console.log('🚀 Starting detective investigation with:', { educationalMode, projectName, isContinueCase });
    
    if (!user && !authLoading) {
      console.log('❌ User not authenticated');
      return;
    }

    if (!formData.researchQuestion?.trim()) {
      console.error('❌ Research question is required for investigation');
      return;
    }

    let filesToProcess = formData.files;
    
    // For continue case, ensure we have properly formatted files
    if (isContinueCase && continueSetupComplete) {
      console.log('🔄 Continue case: Using prepared evidence files for analysis...');
      
      if (!filesToProcess || filesToProcess.length === 0) {
        console.error('❌ Continue case setup completed but no files available');
        return;
      }
      
      // Log file details for debugging
      filesToProcess.forEach((file, index) => {
        console.log(`📄 Evidence file ${index + 1}:`, {
          name: file.name,
          size: file.size,
          type: file.type,
          isReconstructed: (file as any).isReconstructed,
          hasContent: file.size > 0
        });
      });
    }

    if (!filesToProcess || filesToProcess.length === 0) {
      console.error('❌ No evidence files available for investigation');
      return;
    }

    const finalProjectName = projectName || `Investigation ${Date.now()}`;
    
    try {
      console.log('🔍 Executing detective analysis:', {
        isContinueCase,
        fileCount: filesToProcess.length,
        projectName: finalProjectName
      });

      const results = await flowManager.executeFullAnalysis(
        formData.researchQuestion,
        formData.additionalContext || '',
        educationalMode,
        filesToProcess,
        finalProjectName
      );

      console.log('✅ Detective investigation completed:', !!results);
    } catch (error) {
      console.error('❌ Detective investigation failed:', error);
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
    if (flowManager.analysisProgress < 15) return '🔍 Cataloging evidence files...';
    if (flowManager.analysisProgress < 30) return '🧐 Examining data patterns...';
    if (flowManager.analysisProgress < 50) return '🕵️ Following the data trail...';
    if (flowManager.analysisProgress < 70) return '🔗 Connecting the clues...';
    if (flowManager.analysisProgress < 85) return '📝 Building the case...';
    if (flowManager.analysisProgress < 95) return '📊 Preparing final report...';
    return '🎯 Case almost solved...';
  };

  // Show continue case setup error if there is one
  if (continueSetupError) {
    return (
      <NewProjectLayout>
        <div className="container mx-auto px-4 py-8">
          <ProjectHeader isContinueCase={isContinueCase} />
          <div className="max-w-md mx-auto mt-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-red-600 text-2xl">🚨</div>
              </div>
              <h3 className="text-xl font-semibold text-red-800 mb-2">Case Setup Failed</h3>
              <p className="text-red-600 mb-4">{continueSetupError}</p>
              <button 
                onClick={() => {
                  setContinueSetupError(null);
                  setContinueSetupComplete(false);
                  formData.resetForm();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Start New Case
              </button>
            </div>
          </div>
        </div>
      </NewProjectLayout>
    );
  }

  // Show analysis view if we have completed analysis AND results
  if (flowManager.showAnalysisView && flowManager.analysisResults) {
    console.log('📊 Rendering detective case results view');
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

        {/* Enhanced analysis overlay with improved progress flow */}
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
                    <span>~{(flowManager.analysisProgress === 0 ? 2.0 : flowManager.analysisProgress < 25 ? 1.5 : flowManager.analysisProgress < 50 ? 1.0 : flowManager.analysisProgress < 75 ? 0.5 : 0.1).toFixed(1)} min remaining</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <p className="text-sm text-gray-500">
                    {flowManager.analysisProgress < 15 ? '🔍 Cataloging evidence files...' :
                     flowManager.analysisProgress < 30 ? '🧐 Examining data patterns...' :
                     flowManager.analysisProgress < 50 ? '🕵️ Following the data trail...' :
                     flowManager.analysisProgress < 70 ? '🔗 Connecting the clues...' :
                     flowManager.analysisProgress < 85 ? '📝 Building the case...' :
                     flowManager.analysisProgress < 95 ? '📊 Preparing final report...' :
                     '🎯 Case almost solved...'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Improved error overlay with better messaging */}
        {flowManager.analysisError && !flowManager.analysisCompleted && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <div className="text-red-600 text-2xl">🚨</div>
                </div>
                <h3 className="text-xl font-semibold">🚨 Investigation Interrupted</h3>
                <p className="text-gray-600">{flowManager.analysisError}</p>
                <div className="flex gap-3 justify-center">
                  <button 
                    onClick={() => handleStartAnalysis(false, flowManager.currentProjectName)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    🔍 Retry Investigation
                  </button>
                  <button 
                    onClick={() => {
                      flowManager.backToProject();
                      formData.resetForm();
                      setContinueSetupComplete(false);
                      setContinueSetupError(null);
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    📋 New Case
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
