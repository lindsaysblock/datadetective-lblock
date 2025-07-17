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
    console.log('🚀 [PIPELINE] Starting analysis from container:', { educationalMode, projectName });
    
    try {
      // STEP 1: Validate form data before starting analysis
      console.log('🔍 [PIPELINE] STEP 1 - Validating form data:', {
        researchQuestion: formData.researchQuestion,
        businessContext: formData.businessContext,
        parsedDataCount: formData.parsedData?.length || 0,
        parsedDataSample: formData.parsedData?.[0] ? {
          hasRows: !!formData.parsedData[0].rows,
          rowCount: formData.parsedData[0].rows?.length || 0,
          hasColumns: !!formData.parsedData[0].columns,
          columnCount: formData.parsedData[0].columns?.length || 0
        } : 'No parsed data',
        educationalMode
      });

      // STEP 2: Check for required data
      if (!formData.researchQuestion?.trim()) {
        console.error('❌ [PIPELINE] Missing research question');
        return;
      }

      if (!formData.parsedData || formData.parsedData.length === 0) {
        console.error('❌ [PIPELINE] Missing parsed data');
        return;
      }

      if (!formData.parsedData[0]?.rows || formData.parsedData[0].rows.length === 0) {
        console.error('❌ [PIPELINE] No data rows found');
        return;
      }

      console.log('✅ [PIPELINE] STEP 2 - Form data validation passed');

      // STEP 3: Start the analysis engine
      console.log('🔍 [PIPELINE] STEP 3 - Starting analysis engine with data:', {
        researchQuestion: formData.researchQuestion,
        additionalContext: formData.businessContext,
        parsedDataFiles: formData.parsedData.length,
        firstFileRows: formData.parsedData[0].rows?.length,
        firstFileColumns: formData.parsedData[0].columns?.length,
        educationalMode
      });

      await startAnalysis({
        researchQuestion: formData.researchQuestion,
        additionalContext: formData.businessContext,
        parsedData: formData.parsedData || [],
        educationalMode
      });

      console.log('✅ [PIPELINE] STEP 3 - Analysis engine started successfully');

    } catch (error) {
      console.error('❌ [PIPELINE] Analysis failed to start:', error);
    }
  };

  const handleAnalysisComplete = () => {
    console.log('✅ [PIPELINE] STEP 4 - Analysis completed, preparing navigation');
    console.log('📊 [PIPELINE] STEP 4 - Current state check:', {
      formData: {
        projectName: formData.projectName,
        researchQuestion: formData.researchQuestion,
        parsedDataCount: formData.parsedData?.length || 0,
        hasBusinessContext: !!formData.businessContext
      },
      analysisReport: report ? {
        id: report.id,
        resultsCount: report.results?.length || 0,
        insightsCount: report.insights?.length || 0,
        confidence: report.confidence
      } : 'No report available'
    });
    
    // STEP 5: Prepare navigation state
    const navigationState = {
      formData: formData,
      educationalMode: false,
      projectName: formData.projectName || 'Untitled Investigation',
      analysisReport: report
    };

    console.log('🚀 [PIPELINE] STEP 5 - Navigating to analysis page with state:', {
      stateKeys: Object.keys(navigationState),
      formDataKeys: Object.keys(navigationState.formData),
      hasAnalysisReport: !!navigationState.analysisReport,
      projectName: navigationState.projectName
    });
    
    // Navigate to analysis page with the completed analysis data in the expected format
    navigate('/analysis', {
      state: navigationState
    });

    console.log('✅ [PIPELINE] STEP 5 - Navigation initiated');
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