
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
      setContinueCaseData,
      resetForm,
    }
  } = useNewProjectForm();

  console.log('NewProjectContainer rendering with formData:', formData);

  // Handle continue investigation from route state
  useEffect(() => {
    if (!isInitialized && location.state?.continueInvestigation && location.state?.dataset) {
      console.log('🔄 Initializing continue case:', location.state.dataset);
      setContinueCaseData(location.state.dataset);
      setIsInitialized(true);
    } else if (!isInitialized) {
      // Normal initialization
      setIsInitialized(true);
    }
  }, [location.state, setContinueCaseData, isInitialized]);

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

  const handleStartAnalysis = (educationalMode?: boolean, projectName?: string) => {
    console.log('Starting analysis with:', { educationalMode, projectName, formData });
    // Navigate to analysis or handle analysis start
    navigate('/analysis', { 
      state: { 
        formData, 
        educationalMode, 
        projectName 
      } 
    });
  };

  return (
    <NewProjectLayout>
      <NewProjectContent
        formData={formData}
        onStartAnalysis={handleStartAnalysis}
      />
    </NewProjectLayout>
  );
};

export default NewProjectContainer;
