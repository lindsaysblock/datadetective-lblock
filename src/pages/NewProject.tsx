
import React from 'react';
import { useNewProjectForm } from '@/hooks/useNewProjectForm';
import ProjectNamingDialog from '@/components/data/upload/ProjectNamingDialog';
import FormRecoveryDialog from '@/components/data/upload/FormRecoveryDialog';
import ProjectAnalysisView from '@/components/ProjectAnalysisView';
import AnalyzingIcon from '@/components/AnalyzingIcon';
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
    file,
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
    setEmail,
    setPassword,
    setResearchQuestion,
    setAdditionalContext,
    nextStep,
    prevStep,
    handleFileChange,
    handleFileUpload,
    handleStartAnalysisClick,
    handleProjectConfirm,
    handleBackToProject,
    handleRestoreData,
    handleStartFresh,
    handleSignIn,
    handleSignUp,
    setShowSignInModal,
    setShowRecoveryDialog
  } = useNewProjectForm();

  console.log('Current step:', step);
  console.log('Show analysis view:', showAnalysisView);
  console.log('Show recovery dialog:', showRecoveryDialog);

  if (showAnalysisView) {
    return (
      <ProjectAnalysisView
        projectName={currentProjectName}
        analysisResults={analysisResults}
        onBackToProject={handleBackToProject}
        researchQuestion={researchQuestion}
        additionalContext={additionalContext}
        dataSource={file ? file.name : 'Database Connection'}
        educationalMode={educationalMode}
      />
    );
  }

  const renderCurrentStep = () => {
    console.log('Rendering step:', step);
    
    switch (step) {
      case 1:
        return (
          <ResearchQuestionStep
            researchQuestion={researchQuestion}
            setResearchQuestion={setResearchQuestion}
            onNext={nextStep}
          />
        );

      case 2:
        return (
          <DataSourceStep
            file={file}
            uploading={uploading}
            parsing={parsing}
            onFileChange={handleFileChange}
            onFileUpload={handleFileUpload}
            onNext={nextStep}
            onPrevious={prevStep}
          />
        );

      case 3:
        return (
          <BusinessContextStep
            additionalContext={additionalContext}
            setAdditionalContext={setAdditionalContext}
            onNext={nextStep}
            onPrevious={prevStep}
          />
        );

      case 4:
        return (
          <AnalysisSummaryStep
            researchQuestion={researchQuestion}
            file={file}
            additionalContext={additionalContext}
            isProcessingAnalysis={isProcessingAnalysis}
            onPrevious={prevStep}
            onStartAnalysis={handleStartAnalysisClick}
          />
        );

      default:
        console.log('Unknown step:', step);
        return <div>Unknown step: {step}</div>;
    }
  };

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
      
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <ProjectHeader />
        <StepIndicator currentStep={step} />
        
        {/* Analysis Progress */}
        {isProcessingAnalysis && (
          <div className="mb-8">
            <AnalyzingIcon isAnalyzing={true} />
          </div>
        )}
        
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
