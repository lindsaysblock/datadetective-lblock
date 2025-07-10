
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, HelpCircle, Plus, FileSearch, Upload, Database, FileText } from 'lucide-react';
import { useAuthState } from '@/hooks/useAuthState';
import { useNewProjectForm } from '@/hooks/useNewProjectForm';
import ProjectNamingDialog from '@/components/data/upload/ProjectNamingDialog';
import FormRecoveryDialog from '@/components/data/upload/FormRecoveryDialog';
import ProjectAnalysisView from '@/components/ProjectAnalysisView';
import AnalyzingIcon from '@/components/AnalyzingIcon';
import { SignInModal } from '@/components/auth/SignInModal';
import DataDetectiveLogo from '@/components/DataDetectiveLogo';
import HelpMenu from '@/components/HelpMenu';
import FileUploadSection from '@/components/data/upload/FileUploadSection';

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
    <div className="mb-12">
      <div className="flex items-center justify-center gap-8">
        {[
          { label: 'Question', step: 1 },
          { label: 'Data Source', step: 2 },
          { label: 'Business Context', step: 3 },
          { label: 'Analysis', step: 4 }
        ].map((item, index) => (
          <div key={item.step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
              step >= item.step 
                ? 'bg-blue-600 border-blue-600 text-white' 
                : 'border-gray-300 text-gray-400'
            }`}>
              {item.step}
            </div>
            <span className={`ml-2 text-sm ${
              step >= item.step ? 'text-blue-600 font-medium' : 'text-gray-400'
            }`}>
              {item.label}
            </span>
            {index < 3 && (
              <div className={`w-16 h-px mx-4 ${
                step > item.step ? 'bg-blue-600' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <DataDetectiveLogo size="sm" showText={true} />
            </div>
            
            <div className="flex items-center gap-4">
              <HelpMenu />
              <Button 
                onClick={() => setShowSignInModal(true)}
                className="bg-gray-900 hover:bg-gray-800 text-white"
              >
                Sign In / Sign Up
              </Button>
            </div>
          </div>
        </div>
      </div>
      
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
      
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Start New Project
          </h1>
          <p className="text-blue-600 text-lg">Let's explore your data together</p>
        </div>

        {renderStepIndicator()}
        
        {/* Analysis Progress - Show above cards */}
        {isProcessingAnalysis && (
          <div className="mb-8">
            <AnalyzingIcon isAnalyzing={true} />
          </div>
        )}
        
        <div className="space-y-8">
          {/* Step 1: What's your question? */}
          <Card className="w-full">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <HelpCircle className="w-5 h-5 text-purple-600" />
                <h3 className="text-xl font-semibold">What's your question?</h3>
              </div>
              <p className="text-gray-600 mb-4">What do you want to answer?</p>
              <Textarea
                placeholder="e.g., What are the main trends in customer behavior over time?"
                value={researchQuestion}
                onChange={(e) => setResearchQuestion(e.target.value)}
                className="min-h-[120px] resize-none text-base"
              />
              {step === 1 && (
                <div className="flex justify-end mt-6">
                  <Button 
                    onClick={nextStep}
                    disabled={!researchQuestion.trim()}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-6"
                  >
                    Next <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 2: Connect Your Data */}
          {step >= 2 && (
            <Card className="w-full">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <Plus className="w-5 h-5 text-blue-600" />
                  <h3 className="text-xl font-semibold">Connect Your Data</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Upload File */}
                  <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-blue-800 mb-2">Upload File</h4>
                    <p className="text-sm text-blue-600 mb-1">CSV, JSON, or TXT</p>
                  </div>

                  {/* Paste Data */}
                  <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center bg-green-50 hover:bg-green-100 transition-colors cursor-pointer">
                    <FileText className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-green-800 mb-2">Paste Data</h4>
                    <p className="text-sm text-green-600 mb-1">Copy & paste your data</p>
                  </div>

                  {/* Connect Source */}
                  <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer">
                    <Database className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-purple-800 mb-2">Connect Source</h4>
                    <p className="text-sm text-purple-600 mb-1">Database or API</p>
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
                    <Button variant="outline" onClick={prevStep}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                    <Button 
                      onClick={nextStep}
                      disabled={!file}
                      className="bg-gray-900 hover:bg-gray-800 text-white px-6"
                    >
                      Next <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Additional Context */}
          {step >= 3 && (
            <Card className="w-full">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <FileSearch className="w-5 h-5 text-orange-600" />
                  <h3 className="text-xl font-semibold">Additional Context</h3>
                  <span className="text-sm text-gray-500">(Optional)</span>
                </div>
                <p className="text-gray-600 mb-4">
                  Provide any business context or background information about your data
                </p>
                <Textarea
                  placeholder="e.g., This data comes from our e-commerce platform and includes customer purchase history from the last 6 months..."
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                  className="min-h-[120px] resize-none text-base"
                />
                {step === 3 && (
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={prevStep}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                    <Button 
                      onClick={nextStep}
                      className="bg-gray-900 hover:bg-gray-800 text-white px-6"
                    >
                      Next <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 4: Start Analysis */}
          {step >= 4 && (
            <Card className="w-full">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-semibold">
                    4
                  </div>
                  <h3 className="text-xl font-semibold">Ready to Start Analysis</h3>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold mb-4">Summary:</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Question:</span> {researchQuestion || 'Not specified'}</p>
                    <p><span className="font-medium">Data:</span> {file ? file.name : 'No file uploaded'}</p>
                    {additionalContext && (
                      <p><span className="font-medium">Context:</span> {additionalContext}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep} disabled={isProcessingAnalysis}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button 
                    onClick={handleStartAnalysisClick}
                    disabled={!researchQuestion || !file || isProcessingAnalysis}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg"
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
