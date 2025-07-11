
import React, { useState } from 'react';
import { useNewProjectForm } from '@/hooks/useNewProjectForm';
import ProjectAnalysisView from '@/components/ProjectAnalysisView';
import AnalysisProgressView from '@/components/project/AnalysisProgressView';
import NewProjectContent from './NewProjectContent';
import ProjectHeader from './ProjectHeader';
import NewProjectLayout from './NewProjectLayout';
import ProjectDialogs from './ProjectDialogs';

const NewProjectContainer = () => {
  console.log('NewProjectContainer component rendering');
  
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const formData = useNewProjectForm();

  console.log('Current form state:', {
    step: formData.step,
    showAnalysisView: formData.showAnalysisView,
    isProcessingAnalysis: formData.isProcessingAnalysis,
    analysisCompleted: formData.analysisCompleted,
    hasAnalysisResults: !!formData.analysisResults,
    hasData: !!formData.parsedData,
    dataStructure: formData.parsedData ? {
      type: typeof formData.parsedData,
      hasRows: !!formData.parsedData.rows,
      rowCount: formData.parsedData.rows?.length || 0
    } : null
  });

  const handleAnalysisComplete = () => {
    console.log('Analysis complete handler called');
    if (formData.analysisCompleted && formData.analysisResults) {
      console.log('Showing results now');
      formData.showResults();
    }
  };

  const handleProgressUpdate = (progress: number) => {
    console.log('Progress update:', progress);
    setAnalysisProgress(progress);
  };

  const handleViewResults = () => {
    console.log('View Results clicked');
    if (formData.analysisCompleted && formData.analysisResults) {
      formData.showResults();
    } else {
      console.log('Cannot show results - analysis not ready');
    }
  };

  const handleStartAnalysis = (researchQuestion: string, additionalContext: string, educational: boolean = false, parsedData?: any, columnMapping?: any) => {
    console.log('🚀 Starting analysis in container with:', {
      researchQuestion,
      additionalContext,
      educational,
      hasParsedData: !!parsedData,
      dataStructure: parsedData ? {
        hasRows: !!parsedData.rows,
        rowCount: parsedData.rows?.length || 0,
        hasColumns: !!parsedData.columns,
        columnCount: parsedData.columns?.length || 0
      } : null,
      hasColumnMapping: !!columnMapping
    });
    
    // Pass all the context to the analysis
    formData.handleStartAnalysisClick(educational, {
      researchQuestion,
      additionalContext,
      parsedData,
      columnMapping
    });
  };

  if (formData.showAnalysisView) {
    console.log('Rendering analysis view');
    return (
      <ProjectAnalysisView
        projectName={formData.currentProjectName}
        analysisResults={formData.analysisResults}
        onBackToProject={formData.handleBackToProject}
        researchQuestion={formData.researchQuestion}
        additionalContext={formData.additionalContext}
        dataSource={formData.files.length > 0 ? `${formData.files.length} file${formData.files.length > 1 ? 's' : ''}` : 'Database Connection'}
        educationalMode={formData.educationalMode}
      />
    );
  }

  return (
    <NewProjectLayout>
      <div className="container mx-auto px-4 py-8">
        <ProjectHeader />
        
        <ProjectDialogs
          formData={formData}
          analysisProgress={analysisProgress}
          onViewResults={handleViewResults}
        />

        <AnalysisProgressView
          isAnalyzing={formData.isProcessingAnalysis && !formData.showProjectDialog}
          onComplete={handleAnalysisComplete}
          onProgressUpdate={handleProgressUpdate}
        />
        
        <NewProjectContent {...formData} onStartAnalysis={handleStartAnalysis} />
      </div>
    </NewProjectLayout>
  );
};

export default NewProjectContainer;
