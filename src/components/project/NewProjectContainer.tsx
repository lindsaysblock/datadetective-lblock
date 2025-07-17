/**
 * New Project Container
 * Refactored to meet coding standards and implement proper Data Detective branding
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNewProjectForm } from '@/hooks/useNewProjectForm';
import { useAnalysisEngine } from '@/hooks/useAnalysisEngine';
import NewProjectLayout from './NewProjectLayout';
import NewProjectContent from './NewProjectContent';
import AnalysisProgressModal from '@/components/analysis/AnalysisProgressModal';
import { SPACING } from '@/constants/ui';

const NewProjectContainer: React.FC = () => {
  console.log('🔍 NewProjectContainer rendering with proper form integration');
  const navigate = useNavigate();

  const { formData, isLoading, error, actions } = useNewProjectForm();
  const { startAnalysis, isAnalyzing, progress, report } = useAnalysisEngine();

  const handleStartAnalysis = async (educationalMode: boolean = false, projectName: string = '') => {
    console.log('🚀 Starting analysis from container:', { educationalMode, projectName });
    
    try {
      console.log('🔍 Starting analysis engine with data:', {
        researchQuestion: formData.researchQuestion,
        businessContext: formData.businessContext,
        parsedDataCount: formData.parsedData?.length || 0,
        educationalMode
      });

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

  const handleAnalysisComplete = () => {
    console.log('✅ Analysis completed, redirecting to analysis page');
    // Navigate to analysis page with the completed analysis
    navigate('/analysis', {
      state: {
        analysisReport: report,
        projectName: formData.projectName,
        researchQuestion: formData.researchQuestion
      }
    });
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
    <>
      <NewProjectLayout>
        <NewProjectContent
          formData={formData}
          onStartAnalysis={handleStartAnalysis}
          isLoading={isLoading || isAnalyzing}
        />
      </NewProjectLayout>
      
      {/* Analysis Progress Modal */}
      <AnalysisProgressModal
        isOpen={isAnalyzing}
        progress={progress}
        onComplete={handleAnalysisComplete}
        projectName={formData.projectName || 'Untitled Investigation'}
      />
    </>
  );
};

export default NewProjectContainer;