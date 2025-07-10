
import React from 'react';
import DataDetectiveLogo from './DataDetectiveLogo';
import Header from './Header';
import LegalFooter from './LegalFooter';
import QARunner from './QARunner';
import QueryBuilderHeader from './query/QueryBuilderHeader';
import AnalysisView from './query/AnalysisView';
import MainTabsView from './query/MainTabsView';
import { useQueryBuilderState } from '@/hooks/useQueryBuilderState';
import { useQueryBuilderActions } from '@/hooks/useQueryBuilderActions';

const QueryBuilder: React.FC = () => {
  const {
    analysisData,
    currentFilename,
    currentDatasetId,
    findings,
    showOnboarding,
    activeTab,
    user,
    loading,
    uploading,
    uploadProgress,
    uploadStatus,
    uploadError,
    uploadFilename,
    estimatedTime,
    setAnalysisData,
    setCurrentFilename,
    setCurrentDatasetId,
    setFindings,
    setShowOnboarding,
    setActiveTab,
    handleUserChange,
    resetUpload,
    handleFileUpload
  } = useQueryBuilderState();

  const {
    handleFileProcessed,
    handleSaveToAccount: handleSaveToAccountAction,
    handleDataSourceLoaded,
    handleDatasetSelect,
    handleGenerateMockData,
    handleStartNewProject,
    handleResumeProject
  } = useQueryBuilderActions({
    setAnalysisData,
    setCurrentFilename,
    setCurrentDatasetId,
    setFindings,
    setActiveTab,
    resetUpload,
    handleFileUpload
  });

  const handleSaveToAccount = () => handleSaveToAccountAction(analysisData, currentFilename);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <DataDetectiveLogo />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <QARunner />
      <Header user={user} onUserChange={handleUserChange} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <QueryBuilderHeader
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleStartNewProject={handleStartNewProject}
            handleResumeProject={handleResumeProject}
          />

          {activeTab === 'analysis' && analysisData ? (
            <AnalysisView
              analysisData={analysisData}
              currentFilename={currentFilename}
              findings={findings}
              setActiveTab={setActiveTab}
              setAnalysisData={setAnalysisData}
              handleStartNewProject={handleStartNewProject}
              handleResumeProject={handleResumeProject}
            />
          ) : (
            <MainTabsView
              showOnboarding={showOnboarding}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              uploading={uploading}
              uploadProgress={uploadProgress}
              uploadStatus={uploadStatus}
              uploadFilename={uploadFilename}
              uploadError={uploadError}
              estimatedTime={estimatedTime}
              user={user}
              handleOnboardingComplete={handleOnboardingComplete}
              handleOnboardingSkip={handleOnboardingSkip}
              handleStartNewProject={handleStartNewProject}
              handleResumeProject={handleResumeProject}
              handleFileProcessed={handleFileProcessed}
              handleGenerateMockData={handleGenerateMockData}
              handleSaveToAccount={handleSaveToAccount}
              handleDatasetSelect={handleDatasetSelect}
            />
          )}
        </div>
      </main>
      
      <LegalFooter />
    </div>
  );
};

export default QueryBuilder;
