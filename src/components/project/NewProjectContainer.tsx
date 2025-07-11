
import React, { useState } from 'react';
import { useNewProjectForm } from '@/hooks/useNewProjectForm';
import ProjectNamingDialog from '@/components/data/upload/ProjectNamingDialog';
import FormRecoveryDialog from '@/components/data/upload/FormRecoveryDialog';
import ProjectAnalysisView from '@/components/ProjectAnalysisView';
import AnalysisProgressView from '@/components/project/AnalysisProgressView';
import { SignInModal } from '@/components/auth/SignInModal';
import Header from '@/components/Header';
import NewProjectContent from './NewProjectContent';
import ProjectHeader from './ProjectHeader';
import LegalFooter from '@/components/LegalFooter';

const NewProjectContainer = () => {
  console.log('NewProjectContainer component rendering');
  
  const [analysisProgress, setAnalysisProgress] = useState(0);
  
  const formData = useNewProjectForm();

  console.log('Current step:', formData.step);
  console.log('Show analysis view:', formData.showAnalysisView);
  console.log('Is processing analysis:', formData.isProcessingAnalysis);
  console.log('Analysis completed:', formData.analysisCompleted);
  console.log('Analysis results:', formData.analysisResults ? 'Available' : 'None');

  const handleAnalysisComplete = () => {
    console.log('Analysis complete handler called, analysisCompleted:', formData.analysisCompleted);
    // Only show results and close dialog when analysis is truly complete
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
    console.log('View Results clicked - before showResults call');
    console.log('Analysis completed:', formData.analysisCompleted);
    console.log('Analysis results available:', !!formData.analysisResults);
    
    if (formData.analysisCompleted && formData.analysisResults) {
      formData.showResults();
      console.log('showResults called - showAnalysisView should now be:', formData.showAnalysisView);
    } else {
      console.log('Cannot show results - analysis not completed or no results available');
    }
  };

  const handleStartAnalysis = (researchQuestion: string, additionalContext: string, educational: boolean = false, parsedData?: any, columnMapping?: any) => {
    console.log('Starting analysis with:', {
      researchQuestion,
      additionalContext,
      educational,
      parsedData,
      columnMapping
    });
    formData.handleStartAnalysisClick(educational);
  };

  if (formData.showAnalysisView) {
    console.log('Showing analysis view');
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

  console.log('Rendering main NewProjectContainer component');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <ProjectHeader />
        
        <FormRecoveryDialog
          open={formData.showRecoveryDialog}
          onOpenChange={formData.setShowRecoveryDialog}
          onRestore={formData.handleRestoreData}
          onStartFresh={formData.handleStartFresh}
          lastSaved={formData.lastSaved}
        />

        <SignInModal
          open={formData.showSignInModal}
          onOpenChange={formData.setShowSignInModal}
          email={formData.email}
          password={formData.password}
          loading={formData.authLoading}
          setEmail={formData.setEmail}
          setPassword={formData.setPassword}
          onSignIn={formData.handleSignIn}
          onSignUp={formData.handleSignUp}
        />

        {/* Analysis Progress Overlay - only show when not in project dialog */}
        <AnalysisProgressView
          isAnalyzing={formData.isProcessingAnalysis && !formData.showProjectDialog}
          onComplete={handleAnalysisComplete}
          onProgressUpdate={handleProgressUpdate}
        />
        
        <NewProjectContent {...formData} onStartAnalysis={handleStartAnalysis} />

        <ProjectNamingDialog
          open={formData.showProjectDialog}
          onOpenChange={(open) => {
            // Only allow closing if analysis is not running or is complete
            if (!formData.isProcessingAnalysis || formData.analysisCompleted) {
              formData.setShowProjectDialog(open);
            }
          }}
          onConfirm={formData.handleProjectConfirm}
          onViewResults={handleViewResults}
          isProcessing={formData.isProcessingAnalysis}
          analysisProgress={analysisProgress}
          analysisCompleted={formData.analysisCompleted}
        />
      </div>

      <LegalFooter />
    </div>
  );
};

export default NewProjectContainer;
