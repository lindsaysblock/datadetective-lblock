import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNewProjectForm } from '@/hooks/useNewProjectForm';
import NewProjectLayout from './NewProjectLayout';
import NewProjectContent from './NewProjectContent';

/**
 * Container component for the new project creation flow
 * Handles form state management and navigation logic
 */
const NewProjectContainer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);
  
  const {
    formData,
    isLoading,
    error,
    actions: {
      nextStep,
      prevStep,
      goToStep,
      setProjectName,
      setResearchQuestion,
      setAdditionalContext: setBusinessContext,
      addFile: handleFileSelection,
      removeFile,
      handleFileUpload,
      setContinueCaseData: loadProject,
      resetForm,
    }
  } = useNewProjectForm();

  // Debug logging to track state
  console.log('NewProjectContainer state:', {
    step: formData.step,
    hasData: formData.files.length > 0 || formData.parsedData.length > 0,
    isLoading,
    error
  });

  // Handle continue investigation from route state
  useEffect(() => {
    if (!isInitialized && location.state?.continueInvestigation && location.state?.dataset) {
      console.log('🔄 Loading existing project:', location.state.dataset);
      
      if (location.state.dataset.id) {
        loadProject(location.state.dataset);
      }
      setIsInitialized(true);
    } else if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [location.state, loadProject, isInitialized]);

  // Analysis starter function
  const startAnalysis = async (educationalMode: boolean = false, projectName: string = '') => {
    console.log('🚀 Starting analysis:', { educationalMode, projectName });
    
    try {
      navigate('/analysis', {
        state: {
          formData: enhancedFormData,
          educationalMode,
          projectName
        }
      });
    } catch (error) {
      console.error('❌ Failed to start analysis:', error);
    }
  };

  // Enhanced form data for backward compatibility
  const enhancedFormData = {
    ...formData,
    setResearchQuestion,
    setProjectName,
    setAdditionalContext: setBusinessContext,
    nextStep,
    prevStep,
    goToStep,
    onFileChange: formData.onFileChange,
    handleFileUpload: formData.handleFileUpload,
    removeFile: formData.removeFile,
    setColumnMapping: formData.setColumnMapping,
    files: formData.files,
    uploading: formData.uploading,
    parsing: formData.parsing,
    parsedData: formData.parsedData,
    processedFiles: formData.processedFiles,
    columnMapping: formData.columnMapping,
    analysisResults: formData.analysisResults,
    analysisCompleted: formData.analysisCompleted,
    isProcessingAnalysis: formData.isProcessingAnalysis,
    hasData: formData.files.length > 0 || formData.parsedData.length > 0,
    businessContext: formData.businessContext,
    additionalContext: formData.businessContext,
  };

  // Loading state
  if (!isInitialized || isLoading) {
    return (
      <NewProjectLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">
                {location.state?.continueInvestigation ? 'Loading investigation...' : 'Initializing...'}
              </p>
            </div>
          </div>
        </div>
      </NewProjectLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <NewProjectLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Investigation</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={resetForm}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Start New Investigation
            </button>
          </div>
        </div>
      </NewProjectLayout>
    );
  }

  // Main render
  return (
    <NewProjectLayout>
      <NewProjectContent
        formData={enhancedFormData}
        onStartAnalysis={startAnalysis}
      />
    </NewProjectLayout>
  );
};

export default NewProjectContainer;