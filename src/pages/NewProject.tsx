
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, HelpCircle } from 'lucide-react';
import { useAuthState } from '@/hooks/useAuthState';
import { useNewProjectForm } from '@/hooks/useNewProjectForm';
import ProjectNamingDialog from '@/components/data/upload/ProjectNamingDialog';
import FormRecoveryDialog from '@/components/data/upload/FormRecoveryDialog';
import ProjectAnalysisView from '@/components/ProjectAnalysisView';
import AnalyzingIcon from '@/components/AnalyzingIcon';
import { SignInModal } from '@/components/auth/SignInModal';
import DataDetectiveLogo from '@/components/DataDetectiveLogo';
import FileUploadSection from '@/components/data/upload/FileUploadSection';
import Header from '@/components/Header';

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
    <div className="flex items-center justify-center gap-8 mb-12">
      {[
        { label: 'Question', step: 1 },
        { label: 'Data Source', step: 2 },
        { label: 'Business Context', step: 3 },
        { label: 'Analysis', step: 4 }
      ].map((item, index) => (
        <div key={item.step} className="flex items-center">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
            step >= item.step 
              ? 'bg-blue-500 text-white' 
              : 'border border-gray-300 text-gray-400 bg-white'
          }`}>
            {step > item.step ? '✓' : item.step}
          </div>
          <span className={`ml-2 text-sm ${
            step >= item.step ? 'text-gray-700' : 'text-gray-400'
          }`}>
            {item.label}
          </span>
          {index < 3 && (
            <div className={`w-12 h-px mx-4 ${
              step > item.step ? 'bg-blue-500' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
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
      
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Page Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-purple-600 mb-2">Start New Project</h1>
          <p className="text-lg text-blue-600">Let's explore your data together</p>
        </div>
        
        {renderStepIndicator()}
        
        {/* Analysis Progress */}
        {isProcessingAnalysis && (
          <div className="mb-8">
            <AnalyzingIcon isAnalyzing={true} />
          </div>
        )}
        
        <div className="space-y-8">
          {/* Step 1: What's your question? */}
          <Card className="w-full shadow-sm">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-medium flex-shrink-0 mt-1">
                  1
                </div>
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-purple-500" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">What's your question?</h3>
                    <p className="text-gray-500 text-sm mt-1">What do you want to answer?</p>
                  </div>
                </div>
              </div>
              
              <Textarea
                placeholder="e.g., What are the main trends in customer behavior over time?"
                value={researchQuestion}
                onChange={(e) => setResearchQuestion(e.target.value)}
                className="min-h-[120px] resize-none text-base border-gray-300 mb-6"
              />
              
              {step === 1 && (
                <div className="flex justify-end">
                  <Button 
                    onClick={nextStep}
                    disabled={!researchQuestion.trim()}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-6 flex items-center gap-2"
                  >
                    Next <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 2: Connect Your Data */}
          {step >= 2 && (
            <Card className="w-full shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-medium flex-shrink-0 mt-1">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Connect Your Data</h3>
                    <p className="text-gray-500 text-sm mt-1">Upload a file or connect to your data source</p>
                  </div>
                </div>

                <FileUploadSection
                  file={file}
                  uploading={uploading}
                  parsing={parsing}
                  onFileChange={handleFileChange}
                  onFileUpload={handleFileUpload}
                />

                {step === 2 && (
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={prevStep} className="flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <Button 
                      onClick={nextStep}
                      disabled={!file}
                      className="bg-gray-900 hover:bg-gray-800 text-white px-6 flex items-center gap-2"
                    >
                      Next <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Business Context */}
          {step >= 3 && (
            <Card className="w-full shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-medium flex-shrink-0 mt-1">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Business Context</h3>
                    <p className="text-gray-500 text-sm mt-1">Help us understand your data better (optional)</p>
                  </div>
                </div>
                
                <Textarea
                  placeholder="e.g., This data comes from our e-commerce platform and includes customer purchase history from the last 6 months..."
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                  className="min-h-[120px] resize-none text-base border-gray-300 mb-6"
                />
                
                {step === 3 && (
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={prevStep} className="flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <Button 
                      onClick={nextStep}
                      className="bg-gray-900 hover:bg-gray-800 text-white px-6 flex items-center gap-2"
                    >
                      Next <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 4: Start Analysis */}
          {step >= 4 && (
            <Card className="w-full shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-medium flex-shrink-0 mt-1">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Analysis</h3>
                    <p className="text-gray-500 text-sm mt-1">Review your inputs and begin the analysis</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold mb-4 text-gray-900">Summary:</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium text-gray-900">Question:</span> {researchQuestion || 'Not specified'}</p>
                    <p><span className="font-medium text-gray-900">Data:</span> {file ? file.name : 'No file uploaded'}</p>
                    {additionalContext && (
                      <p><span className="font-medium text-gray-900">Context:</span> {additionalContext}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep} disabled={isProcessingAnalysis} className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <Button 
                    onClick={handleStartAnalysisClick}
                    disabled={!researchQuestion || !file || isProcessingAnalysis}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 text-lg"
                  >
                    {isProcessingAnalysis ? 'Starting Analysis...' : 'Start Analysis'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
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
