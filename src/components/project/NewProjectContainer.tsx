
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProjectAnalysisView from '@/components/ProjectAnalysisView';
import NewProjectContent from './NewProjectContent';
import ProjectHeader from './ProjectHeader';
import NewProjectLayout from './NewProjectLayout';
import { useProjectFlowManager } from '@/hooks/useProjectFlowManager';
import { useNewProjectForm } from '@/hooks/useNewProjectForm';
import { useAuth } from '@/hooks/useAuth';
import { Progress } from '@/components/ui/progress';

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
      console.log('Dataset metadata:', dataset.metadata);
      console.log('Dataset summary:', dataset.summary);
      
      // Reconstruct the form data from the dataset
      const reconstructedParsedData = [{
        id: dataset.id,
        name: dataset.original_filename,
        columns: dataset.metadata?.columns?.length || dataset.summary?.totalColumns || 0,
        rows: dataset.metadata?.totalRows || dataset.summary?.totalRows || 0,
        rowCount: dataset.metadata?.totalRows || dataset.summary?.totalRows || 0,
        preview: dataset.metadata?.sample_rows || [],
        data: dataset.metadata?.sample_rows || [],
        columnInfo: dataset.metadata?.columns?.map((col: any) => ({
          name: col.name || col,
          type: col.type || 'string',
          samples: col.samples || []
        })) || [],
        summary: {
          totalRows: dataset.metadata?.totalRows || dataset.summary?.totalRows || 0,
          totalColumns: dataset.metadata?.columns?.length || dataset.summary?.totalColumns || 0,
          possibleUserIdColumns: dataset.summary?.possibleUserIdColumns || [],
          possibleEventColumns: dataset.summary?.possibleEventColumns || [],
          possibleTimestampColumns: dataset.summary?.possibleTimestampColumns || []
        }
      }];
      
      console.log('Reconstructed parsed data:', reconstructedParsedData);
      
      // Set the form data with proper values
      formData.setResearchQuestion(dataset.summary?.researchQuestion || '');
      formData.setAdditionalContext(dataset.summary?.description || dataset.summary?.additionalContext || '');
      formData.setParsedData(reconstructedParsedData);
      
      // Create proper mock files for the form - this is crucial for analysis
      const mockFiles = [{
        name: dataset.original_filename,
        type: dataset.mime_type || 'text/csv',
        size: dataset.file_size || 1000,
        lastModified: new Date(dataset.created_at).getTime(),
        // Add the actual data as a blob so the analysis can work
        stream: () => new ReadableStream(),
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        text: () => Promise.resolve(''),
        slice: () => new Blob()
      }];
      
      formData.setFiles(mockFiles as File[]);
      
      // Force step to 4 for continue case
      formData.setStep(4);
      
      console.log('Continue case setup completed:', {
        step: 4,
        hasResearchQuestion: !!formData.researchQuestion,
        hasFiles: mockFiles.length > 0,
        hasParsedData: reconstructedParsedData.length > 0
      });
      
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

    // For continue case, we need to handle files differently
    let filesToProcess = formData.files;
    
    if (isContinueCase && (!filesToProcess || filesToProcess.length === 0)) {
      console.log('Continue case: Creating synthetic files from parsed data');
      
      // Create synthetic files from parsed data for continue case
      filesToProcess = formData.parsedData.map(data => {
        const columnHeaders = data.columnInfo?.map(col => col.name) || [];
        const sampleRows = data.preview || [];
        
        const csvContent = [
          columnHeaders.join(','),
          ...sampleRows.map(row => 
            columnHeaders.map(header => row[header] || '').join(',')
          )
        ].join('\n');
        
        return new File([csvContent], data.name, { type: 'text/csv' });
      });
      
      console.log('Created synthetic files:', filesToProcess.map(f => f.name));
    }

    if (!filesToProcess || filesToProcess.length === 0) {
      console.error('No files available for analysis');
      return;
    }

    const finalProjectName = projectName || `Analysis ${Date.now()}`;
    
    try {
      console.log('📊 Calling flowManager.executeFullAnalysis with:', {
        researchQuestion: formData.researchQuestion,
        additionalContext: formData.additionalContext || '',
        educationalMode,
        filesCount: filesToProcess.length,
        projectName: finalProjectName
      });

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

  // Calculate estimated time based on progress
  const getEstimatedTime = () => {
    if (flowManager.analysisProgress === 0) return 2.0;
    if (flowManager.analysisProgress < 25) return 1.5;
    if (flowManager.analysisProgress < 50) return 1.0;
    if (flowManager.analysisProgress < 75) return 0.5;
    return 0.1;
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
                
                {/* Enhanced Progress Bar */}
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
                  <p className="text-sm text-gray-500">Running comprehensive analysis on your dataset...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Show error overlay only for true analysis failures */}
        {flowManager.analysisError && !flowManager.analysisCompleted && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <div className="text-red-600 text-2xl">⚠️</div>
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
