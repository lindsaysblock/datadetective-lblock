
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNewProjectForm } from '@/hooks/useNewProjectForm';
import NewProjectLayout from './NewProjectLayout';
import NewProjectContent from './NewProjectContent';

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

  console.log('NewProjectContainer rendering with formData:', {
    step: formData.step,
    projectName: formData.projectName,
    researchQuestion: formData.researchQuestion,
    hasFiles: formData.files.length > 0 || formData.parsedData.length > 0,
  });

  // Handle continue investigation from route state
  useEffect(() => {
    if (!isInitialized && location.state?.continueInvestigation && location.state?.dataset) {
      console.log('🔄 Loading existing project:', location.state.dataset);
      
      // If we have a dataset with an ID, load the full project
      if (location.state.dataset.id) {
        loadProject(location.state.dataset);
      }
      setIsInitialized(true);
    } else if (!isInitialized) {
      // Normal initialization
      setIsInitialized(true);
    }
  }, [location.state, loadProject, isInitialized]);

  // Show loading state during initialization
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

  // Show error state
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

  // Create enhanced form data object for backward compatibility
  const enhancedFormData = {
    ...formData,
    // Add action functions for components
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
    // Computed properties for compatibility
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

  const startAnalysis = async (educationalMode: boolean = false, projectName: string = '') => {
    console.log('🚀 Starting analysis:', { educationalMode, projectName });
    
    try {
      // Navigate to analysis page with form data
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
