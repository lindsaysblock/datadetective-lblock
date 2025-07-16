/**
 * New Project Container
 * Refactored to meet coding standards and implement proper Data Detective branding
 */

import React from 'react';
import { useNewProjectForm } from '@/hooks/useNewProjectForm';
import { useAnalysisEngine } from '@/hooks/useAnalysisEngine';
import NewProjectLayout from './NewProjectLayout';
import NewProjectContent from './NewProjectContent';
import { SPACING } from '@/constants/ui';

const NewProjectContainer: React.FC = () => {
  console.log('🔍 NewProjectContainer rendering with proper form integration');

  const { formData, isLoading, error, actions } = useNewProjectForm();
  const { startAnalysis, isAnalyzing } = useAnalysisEngine();

  const handleStartAnalysis = async (educationalMode: boolean = false, projectName: string = '') => {
    console.log('🚀 Starting analysis from container:', { educationalMode, projectName });
    
    try {
      // Validate form data before starting analysis
      const validation = actions.validateFormData(projectName);
      if (!validation) {
        console.error('❌ Form validation failed');
        return;
      }

      // Start the analysis engine  
      await startAnalysis({
        researchQuestion: formData.researchQuestion,
        additionalContext: formData.businessContext,
        parsedData: formData.parsedData || [],
        educationalMode
      });

    } catch (error) {
      console.error('❌ Analysis failed to start:', error);
    }
  };

  if (error) {
    return (
      <NewProjectLayout>
        <div className={`container mx-auto px-${SPACING.MD} py-${SPACING.XL}`}>
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Project</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={actions.resetForm}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </NewProjectLayout>
    );
  }

  return (
    <NewProjectLayout>
      <NewProjectContent
        formData={formData}
        onStartAnalysis={handleStartAnalysis}
        isLoading={isLoading || isAnalyzing}
      />
    </NewProjectLayout>
  );
};

export default NewProjectContainer;