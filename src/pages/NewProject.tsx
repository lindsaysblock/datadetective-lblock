
import React from 'react';
import { useNewProjectForm } from '@/hooks/useNewProjectForm';
import ProjectNamingDialog from '@/components/data/upload/ProjectNamingDialog';
import FormRecoveryDialog from '@/components/data/upload/FormRecoveryDialog';
import ProjectAnalysisView from '@/components/ProjectAnalysisView';
import AnalysisProgressView from '@/components/project/AnalysisProgressView';
import { SignInModal } from '@/components/auth/SignInModal';
import Header from '@/components/Header';
import StepIndicator from '@/components/project/StepIndicator';
import ProjectHeader from '@/components/project/ProjectHeader';
import ResearchQuestionStep from '@/components/project/ResearchQuestionStep';
import DataSourceStep from '@/components/project/DataSourceStep';
import BusinessContextStep from '@/components/project/BusinessContextStep';
import AnalysisSummaryStep from '@/components/project/AnalysisSummaryStep';

const NewProject = () => {
  console.log('NewProject component rendering');
  
  const {
    step,
    researchQuestion,
    additionalContext,
    files,
    uploading,
    parsing,
    parsedData,
    showProjectDialog,
    isProcessingAnalysis,
    showRecoveryDialog,
    lastSaved,
    analysisResults,
    currentProjectName,
    showAnalysisView,
    showSignInModal,
    authLoading,
    email,
    password,
    educationalMode,
    analysisCompleted,
    setEmail,
    setPassword,
    setResearchQuestion,
    setAdditionalContext,
    nextStep,
    prevStep,
    handleFileChange,
    handleFileUpload,
    removeFile,
    handleStartAnalysisClick,
    handleProjectConfirm,
    handleBackToProject,
    handleRestoreData,
    handleStartFresh,
    handleSignIn,
    handleSignUp,
    setShowSignInModal,
    setShowRecoveryDialog,
    showResults
  } = useNewProjectForm();

  console.log('Current step:', step);
  console.log('Show analysis view:', showAnalysisView);
  console.log('Is processing analysis:', isProcessingAnalysis);

  if (showAnalysisView) {
    console.log('Showing analysis view');
    return (
      <ProjectAnalysisView
        projectName={currentProjectName}
        analysisResults={analysisResults}
        onBackToProject={handleBackToProject}
        researchQuestion={researchQuestion}
        additionalContext={additionalContext}
        dataSource={files.length > 0 ? `${files.length} file${files.length > 1 ? 's' : ''}` : 'Database Connection'}
        educationalMode={educationalMode}
      />
    );
  }

  const renderCurrentStep = () => {
    console.log('Rendering step:', step);
    
    switch (step) {
      case 1:
        console.log('Rendering ResearchQuestionStep');
        return (
          <ResearchQuestionStep
            researchQuestion={researchQuestion}
            setResearchQuestion={setResearchQuestion}
            onNext={nextStep}
          />
        );

      case 2:
        console.log('Rendering DataSourceStep');
        return (
          <DataSourceStep
            files={files}
            uploading={uploading}
            parsing={parsing}
            onFileChange={handleFileChange}
            onFileUpload={handleFileUpload}
            onRemoveFile={removeFile}
            onNext={nextStep}
            onPrevious={prevStep}
          />
        );

      case 3:
        console.log('Rendering BusinessContextStep');
        return (
          <BusinessContextStep
            additionalContext={additionalContext}
            setAdditionalContext={setAdditionalContext}
            onNext={nextStep}
            onPrevious={prevStep}
          />
        );

      case 4:
        console.log('Rendering AnalysisSummaryStep');
        return (
          <AnalysisSummaryStep
            researchQuestion={researchQuestion}
            files={files}
            additionalContext={additionalContext}
            isProcessingAnalysis={isProcessingAnalysis}
            onPrevious={prevStep}
            onStartAnalysis={handleStartAnalysisClick}
          />
        );

      default:
        console.log('Unknown step:', step);
        return (
          <div className="text-center p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unknown step: {step}</h2>
            <p className="text-gray-600">Please refresh the page or contact support.</p>
          </div>
        );
    }
  };

  console.log('Rendering main NewProject component');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      
      <FormRecoveryDialog
        open={showRecoveryDialog}
        onOpenChange={setShowRecoveryDialog}
        onRestore={handleRestoreData}
        onStartFresh={handleStartFresh}
        lastSaved={lastSaved}
      />

      <SignInModal
        open={showSignInModal}
        onOpenChange={setShowSignInModal}
        email={email}
        password={password}
        loading={authLoading}
        setEmail={setEmail}
        setPassword={setPassword}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
      />

      {/* Analysis Progress Overlay */}
      <AnalysisProgressView
        isAnalyzing={isProcessingAnalysis && !showProjectDialog}
        onComplete={showResults}
      />
      
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <ProjectHeader />
        <StepIndicator currentStep={step} />
        
        <div className="space-y-8">
          {renderCurrentStep()}
        </div>

        <ProjectNamingDialog
          open={showProjectDialog}
          onOpenChange={(open) => {}}
          onConfirm={handleProjectConfirm}
          isProcessing={isProcessingAnalysis}
        />
      </div>
    </div>
  );
};

export default NewProject;
