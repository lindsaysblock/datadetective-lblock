/**
 * New Project Container
 * Refactored to meet coding standards and implement proper Data Detective branding
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNewProjectForm } from '@/hooks/useNewProjectForm';
import { useAnalysisEngine } from '@/hooks/useAnalysisEngine';
import { useAuth } from '@/contexts/AuthContext';
import NewProjectLayout from './NewProjectLayout';
import NewProjectContent from './NewProjectContent';
import AnalysisProgressModal from '@/components/analysis/AnalysisProgressModal';
import { SPACING } from '@/constants/ui';

const NewProjectContainer: React.FC = () => {
  console.log('🔍 NewProjectContainer rendering with proper form integration');
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const { formData, isLoading, error, actions } = useNewProjectForm();
  const { startAnalysis, isAnalyzing, progress, report } = useAnalysisEngine();

  // Watch for analysis completion and trigger navigation
  useEffect(() => {
    console.log('🔍 [CONTAINER] Analysis state check:', { progress, hasReport: !!report, isAnalyzing });
    
    // Navigate when progress is 100% AND we have a report (regardless of isAnalyzing state)
    if (progress >= 100 && report) {
      console.log('🎯 [CONTAINER] Analysis detected as complete, triggering handleAnalysisComplete');
      handleAnalysisComplete(formData.projectName);
    }
  }, [progress, report]); // Removed isAnalyzing dependency to avoid race conditions

  // CRITICAL DEBUG: Check formData every render
  console.log('🔥 [CONTAINER] FormData check on render:', {
    formDataExists: !!formData,
    formDataType: typeof formData,
    formDataKeys: formData ? Object.keys(formData) : 'No formData',
    researchQuestion: formData?.researchQuestion || 'Missing',
    parsedDataCount: formData?.parsedData?.length || 0,
    projectName: formData?.projectName || 'Missing'
  });

  const handleStartAnalysis = async (educationalMode: boolean = false, projectName: string = '') => {
    console.log('🚀 [PIPELINE] Starting analysis from container:', { educationalMode, projectName });
    console.log('🔍 [PIPELINE] User auth status:', { 
      isAuthenticated: !!user, 
      userId: user?.id, 
      userEmail: user?.email 
    });
    
    // CRITICAL: Update formData with the project name first
    if (projectName && projectName.trim()) {
      console.log('📝 [PIPELINE] Updating formData with project name:', projectName);
      actions.setProjectName(projectName.trim());
    }
    
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

      // STEP 2: Check for authentication first
      if (!user) {
        console.error('❌ [PIPELINE] User not authenticated - analysis requires sign in');
        console.error('❌ [PIPELINE] Auth state:', { user, loading });
        alert('Please sign in to run analysis. Your data and results will be saved to your account.');
        return;
      }
      
      console.log('✅ [PIPELINE] User authenticated:', { userId: user.id, email: user.email });

      // STEP 3: Check for required data
      if (!formData.researchQuestion?.trim()) {
        console.error('❌ [PIPELINE] Missing research question');
        return;
      }

      if (!formData.parsedData || formData.parsedData.length === 0) {
        console.log('⚡ [PIPELINE] No uploaded data - generating sample data for demo');
        // Generate sample data for demo/testing purposes
        const sampleData = {
          columns: [
            { name: 'user_id', type: 'string', samples: ['user_001', 'user_002', 'user_003'] },
            { name: 'action', type: 'string', samples: ['login', 'purchase', 'view'] },
            { name: 'timestamp', type: 'date', samples: ['2024-01-01', '2024-01-02', '2024-01-03'] },
            { name: 'value', type: 'number', samples: [100, 250, 75] }
          ],
          rows: [
            { user_id: 'user_001', action: 'login', timestamp: '2024-01-01', value: 100 },
            { user_id: 'user_002', action: 'purchase', timestamp: '2024-01-02', value: 250 },
            { user_id: 'user_003', action: 'view', timestamp: '2024-01-03', value: 75 }
          ],
          summary: {
            totalRows: 3,
            totalColumns: 4,
            possibleUserIdColumns: ['user_id'],
            possibleTimestampColumns: ['timestamp']
          }
        };
        
        // Update formData with sample data
        actions.updateFormData({ parsedData: [sampleData] });
        console.log('✅ [PIPELINE] Sample data generated and set');
      }

      if (!formData.parsedData[0]?.rows || formData.parsedData[0].rows.length === 0) {
        console.error('❌ [PIPELINE] No data rows found even after sample data generation');
        return;
      }

      console.log('✅ [PIPELINE] STEP 4 - Form data validation passed');

      // STEP 5: Start the analysis engine
      console.log('🔍 [PIPELINE] STEP 5 - Starting analysis engine with data:', {
        researchQuestion: formData.researchQuestion,
        additionalContext: formData.businessContext,
        parsedDataFiles: formData.parsedData.length,
        firstFileRows: formData.parsedData[0].rows?.length,
        firstFileColumns: formData.parsedData[0].columns?.length,
        educationalMode
      });

      // CRITICAL: Transform data to match expected ParsedData structure
      console.log('🔥 [CRITICAL] About to transform parsedData:', {
        parsedDataExists: !!formData.parsedData,
        parsedDataLength: formData.parsedData?.length,
        firstDataItemKeys: formData.parsedData?.[0] ? Object.keys(formData.parsedData[0]) : 'No first item',
        firstDataItemType: typeof formData.parsedData?.[0],
        fullFirstDataItem: formData.parsedData?.[0]
      });

      const transformedData = formData.parsedData.map((data, index) => {
        console.log(`🔧 [${index}] Transforming data structure for analysis:`, {
          dataType: typeof data,
          dataKeys: Object.keys(data),
          hasRows: !!data.rows,
          rowsLength: data.rows?.length,
          hasColumns: !!data.columns,
          columnsLength: data.columns?.length,
          hasSummary: !!data.summary,
          summaryType: typeof data.summary,
          summaryKeys: data.summary ? Object.keys(data.summary) : 'No summary',
          fullData: data
        });
        
        // Ensure the data has the required ParsedData structure for analysis functions
        const transformedItem = {
          ...data,
          // Ensure summary object exists with required properties
          summary: {
            totalRows: data.summary?.totalRows || data.rowCount || data.rows?.length || 0,
            totalColumns: data.summary?.totalColumns || data.columns?.length || 0,
            possibleUserIdColumns: data.summary?.possibleUserIdColumns || [],
            possibleTimestampColumns: data.summary?.possibleTimestampColumns || [],
            possibleEventColumns: data.summary?.possibleEventColumns || []
          },
          // Ensure rows and columns exist
          rows: data.rows || [],
          columns: data.columns || []
        };
        
        console.log('✅ Transformed data structure:', {
          originalKeys: Object.keys(data),
          transformedKeys: Object.keys(transformedItem),
          summaryKeys: Object.keys(transformedItem.summary),
          totalRows: transformedItem.summary.totalRows,
          totalColumns: transformedItem.summary.totalColumns
        });
        
        return transformedItem;
      });

      await startAnalysis({
        researchQuestion: formData.researchQuestion,
        additionalContext: formData.businessContext,
        parsedData: transformedData,
        educationalMode
      });

      console.log('✅ [PIPELINE] STEP 3 - Analysis engine started successfully');

    } catch (error) {
      console.error('❌ [PIPELINE] Analysis failed to start:', error);
    }
  };

  const handleAnalysisComplete = (projectName?: string) => {
    console.log('✅ [PIPELINE] STEP 4 - Analysis completed, preparing navigation');
    
    // CRITICAL DEBUG: Check what formData actually contains
    console.log('🔍 [PIPELINE] STEP 4 - CRITICAL FORMDATA CHECK:', {
      formDataType: typeof formData,
      formDataKeys: formData ? Object.keys(formData) : 'formData is null/undefined',
      formDataValue: formData,
      hasResearchQuestion: !!(formData?.researchQuestion),
      hasParsedData: !!(formData?.parsedData),
      parsedDataLength: formData?.parsedData?.length || 0,
      hasProjectName: !!(formData?.projectName)
    });
    
    console.log('📊 [PIPELINE] STEP 4 - Analysis report check:', {
      reportExists: !!report,
      reportId: report?.id || 'No report ID',
      reportType: typeof report
    });
    
    // Check if formData is valid before navigation
    if (!formData) {
      console.error('❌ [PIPELINE] CRITICAL ERROR: formData is null/undefined during navigation!');
      return;
    }
    
    // STEP 5: Prepare navigation state with only serializable data
    const finalProjectName = projectName || formData.projectName || 'Untitled Investigation';
    console.log('📝 [PIPELINE] Final project name for navigation:', finalProjectName);
    
    const serializableFormData = {
      projectName: finalProjectName,
      researchQuestion: formData.researchQuestion || '',
      businessContext: formData.businessContext || '',
      file: null, // File objects are not serializable
      files: [], // File arrays are not serializable
      uploadedData: formData.uploadedData,
      parsedData: formData.parsedData || [],
      columnMapping: formData.columnMapping || {},
      analysisResults: formData.analysisResults,
      analysisCompleted: formData.analysisCompleted || false,
      isProcessingAnalysis: false,
      uploading: false,
      parsing: false,
      step: formData.step || 1,
      processedFiles: formData.processedFiles || [],
    };

    const navigationState = {
      formData: serializableFormData,
      educationalMode: false,
      projectName: finalProjectName,
      analysisReport: report
    };

    console.log('🚀 [PIPELINE] STEP 5 - Final navigation state prepared:', {
      stateKeys: Object.keys(navigationState),
      formDataKeys: Object.keys(navigationState.formData),
      formDataValid: !!navigationState.formData,
      researchQuestionValid: !!navigationState.formData.researchQuestion,
      parsedDataValid: !!navigationState.formData.parsedData,
      projectNameValid: !!navigationState.projectName
    });
    
    // Navigate to analysis page
    console.log('🚀 [CONTAINER] About to navigate to /analysis with state');
    navigate('/analysis', {
      state: navigationState
    });

    console.log('✅ [CONTAINER] Navigation call completed - should now be on analysis page');
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
          actions={actions}
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