
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Database, History, User } from 'lucide-react';
import OnboardingFlow from '../OnboardingFlow';
import ProjectActionButtons from './ProjectActionButtons';
import DataUploadTab from './DataUploadTab';
import ProjectLibraryTab from './ProjectLibraryTab';
import DataSourceTab from './DataSourceTab';
import ProfileTab from './ProfileTab';

interface MainTabsViewProps {
  showOnboarding: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  uploading: boolean;
  uploadProgress: number;
  uploadStatus: string;
  uploadFilename: string;
  uploadError: string | null;
  estimatedTime: number;
  user: any;
  handleOnboardingComplete: () => void;
  handleOnboardingSkip: () => void;
  handleStartNewProject: () => void;
  handleResumeProject: () => void;
  handleFileProcessed: (file: File) => void;
  handleGenerateMockData: () => void;
  handleSaveToAccount: (filename: string) => void;
  handleDatasetSelect: (dataset: any) => void;
}

const MainTabsView: React.FC<MainTabsViewProps> = ({
  showOnboarding,
  activeTab,
  setActiveTab,
  uploading,
  uploadProgress,
  uploadStatus,
  uploadFilename,
  uploadError,
  estimatedTime,
  user,
  handleOnboardingComplete,
  handleOnboardingSkip,
  handleStartNewProject,
  handleResumeProject,
  handleFileProcessed,
  handleGenerateMockData,
  handleSaveToAccount,
  handleDatasetSelect
}) => {
  return (
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
  );
};

export default MainTabsView;
