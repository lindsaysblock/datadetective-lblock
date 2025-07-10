
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Database, History, User, Plus } from 'lucide-react';
import DataDetectiveLogo from './DataDetectiveLogo';
import AnalysisDashboard from './AnalysisDashboard';
import OnboardingFlow from './OnboardingFlow';
import Header from './Header';
import LegalFooter from './LegalFooter';
import QARunner from './QARunner';
import ProjectActionButtons from './query/ProjectActionButtons';
import DataUploadTab from './query/DataUploadTab';
import ProjectLibraryTab from './query/ProjectLibraryTab';
import DataSourceTab from './query/DataSourceTab';
import ProfileTab from './query/ProfileTab';
import { useQueryBuilderState } from '@/hooks/useQueryBuilderState';

const QueryBuilder: React.FC = () => {
  const {
    analysisData,
    currentFilename,
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
    setShowOnboarding,
    setActiveTab,
    handleUserChange,
    handleFileProcessed,
    handleSaveToAccount,
    handleDataSourceLoaded,
    handleDatasetSelect,
    handleGenerateMockData,
    handleStartNewProject,
    handleResumeProject
  } = useQueryBuilderState();

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
          <div className="text-center mb-8">
            <DataDetectiveLogo />
          </div>

          {activeTab === 'analysis' && analysisData ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('upload')}
                  className="mb-4"
                >
                  ← Back to Dashboard
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={handleStartNewProject}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    New Project
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleResumeProject}
                    className="flex items-center gap-2"
                  >
                    <History className="w-4 h-4" />
                    Project History
                  </Button>
                </div>
              </div>
              
              <AnalysisDashboard
                parsedData={analysisData}
                filename={currentFilename}
                findings={findings}
                onDataUpdate={setAnalysisData}
              />
            </div>
          ) : (
            <div className="space-y-8">
              {showOnboarding && (
                <OnboardingFlow 
                  onComplete={handleOnboardingComplete} 
                  onSkip={handleOnboardingSkip} 
                />
              )}

              <ProjectActionButtons
                onStartNewProject={handleStartNewProject}
                onResumeProject={handleResumeProject}
              />

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="upload" className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Select Data
                  </TabsTrigger>
                  <TabsTrigger value="library" className="flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Project History
                  </TabsTrigger>
                  <TabsTrigger value="connect" className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Connect Sources
                  </TabsTrigger>
                  <TabsTrigger value="profile" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Profile
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload">
                  <DataUploadTab
                    onFileProcessed={handleFileProcessed}
                    onGenerateMockData={handleGenerateMockData}
                    uploading={uploading}
                    uploadProgress={uploadProgress}
                    uploadStatus={uploadStatus}
                    uploadFilename={uploadFilename}
                    uploadError={uploadError}
                    estimatedTime={estimatedTime}
                    user={user}
                    onSaveToAccount={handleSaveToAccount}
                  />
                </TabsContent>

                <TabsContent value="library">
                  <ProjectLibraryTab
                    user={user}
                    onDatasetSelect={handleDatasetSelect}
                  />
                </TabsContent>

                <TabsContent value="connect">
                  <DataSourceTab onFileUpload={handleFileProcessed} />
                </TabsContent>

                <TabsContent value="profile">
                  <ProfileTab user={user} />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </main>
      
      <LegalFooter />
    </div>
  );
};

export default QueryBuilder;
