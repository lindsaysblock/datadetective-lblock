
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import { useAuthState } from '@/hooks/useAuthState';
import { useNewProjectForm } from '@/hooks/useNewProjectForm';
import ProjectNamingDialog from '@/components/data/upload/ProjectNamingDialog';
import FormRecoveryDialog from '@/components/data/upload/FormRecoveryDialog';
import ProjectAnalysisView from '@/components/ProjectAnalysisView';
import ResearchQuestionStep from '@/components/project/ResearchQuestionStep';
import DataSourceStep from '@/components/project/DataSourceStep';
import BusinessContextStep from '@/components/project/BusinessContextStep';
import AnalysisSummaryStep from '@/components/project/AnalysisSummaryStep';
import AnalyzingIcon from '@/components/AnalyzingIcon';
import { SignInModal } from '@/components/auth/SignInModal';

const NewProject = () => {
  const { user, handleUserChange } = useAuthState();
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
    setShowSignInModal
  } = useNewProjectForm();

  if (showAnalysisView) {
    return (
      <ProjectAnalysisView
        projectName={currentProjectName}
        analysisResults={analysisResults}
        onBackToProject={handleBackToProject}
        researchQuestion={researchQuestion}
        additionalContext={additionalContext}
        dataSource={file ? file.name : 'Database Connection'}
      />
    );
  }

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 ${step > 1 ? 'text-blue-600' : 'text-gray-400'}`}>
          {step > 1 ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-5 h-5 rounded-full border border-gray-400"></div>}
          Question
        </div>
        <div className={`flex items-center gap-2 ${step > 2 ? 'text-blue-600' : 'text-gray-400'}`}>
          {step > 2 ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-5 h-5 rounded-full border border-gray-400"></div>}
          Data Source
        </div>
        <div className={`flex items-center gap-2 ${step > 3 ? 'text-blue-600' : 'text-gray-400'}`}>
          {step > 3 ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-5 h-5 rounded-full border border-gray-400"></div>}
          Business Context
        </div>
        <div className={`flex items-center gap-2 ${step > 4 ? 'text-blue-600' : 'text-gray-400'}`}>
          {step > 4 ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-5 h-5 rounded-full border border-gray-400"></div>}
          Analysis
        </div>
      </div>
      <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return (
          <ResearchQuestionStep
            researchQuestion={researchQuestion}
            onResearchQuestionChange={setResearchQuestion}
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
            onPrevious={prevStep}
            onNext={nextStep}
          />
        );
      case 3:
        return (
          <BusinessContextStep
            researchQuestion={researchQuestion}
            additionalContext={additionalContext}
            onAdditionalContextChange={setAdditionalContext}
            onPrevious={prevStep}
            onNext={nextStep}
          />
        );
      case 4:
        return (
          <AnalysisSummaryStep
            researchQuestion={researchQuestion}
            additionalContext={additionalContext}
            file={file}
            parsedData={parsedData}
            isProcessingAnalysis={isProcessingAnalysis}
            onResearchQuestionChange={setResearchQuestion}
            onStartAnalysis={handleStartAnalysisClick}
            onPrevious={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header user={user} onUserChange={handleUserChange} />
      
      <FormRecoveryDialog
        open={showRecoveryDialog}
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
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="text-center flex-1 mx-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Start New Project
            </h1>
            <p className="text-blue-600 text-lg">Let's explore your data together</p>
          </div>
          <div className="w-24"></div>
        </div>

        {renderStepIndicator()}
        
        {/* Analysis Progress - Show above project dialog */}
        {isProcessingAnalysis && (
          <div className="mb-8">
            <AnalyzingIcon isAnalyzing={true} />
          </div>
        )}
        
        {renderCurrentStep()}

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
