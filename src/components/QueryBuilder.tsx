
import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Database, Wand2, History, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DataDetectiveLogo from './DataDetectiveLogo';
import RateLimitedDropzone from './RateLimitedDropzone';
import DataSourceManager from './DataSourceManager';
import AnalysisDashboard from './AnalysisDashboard';
import OnboardingFlow from './OnboardingFlow';
import Header from './Header';
import DatasetLibrary from './DatasetLibrary';
import UserProfilePanel from './UserProfilePanel';
import EnhancedUploadProgress from './EnhancedUploadProgress';
import { generateMockDataset } from '@/utils/mockData';
import { parseFile } from '@/utils/dataParser';
import QARunner from './QARunner';
import { useAuthState } from '@/hooks/useAuthState';
import { useDatasetPersistence } from '@/hooks/useDatasetPersistence';
import { useDataUpload } from '@/hooks/useDataUpload';

interface AnalysisData {
  columns: any[];
  rows: any[];
  summary: any;
}

const QueryBuilder: React.FC = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [currentFilename, setCurrentFilename] = useState<string | null>(null);
  const [currentDatasetId, setCurrentDatasetId] = useState<string | null>(null);
  const [findings, setFindings] = useState<any[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [activeTab, setActiveTab] = useState('upload');
  
  const { user, loading, handleUserChange } = useAuthState();
  const { saveDataset } = useDatasetPersistence();
  const {
    uploading,
    uploadProgress,
    uploadStatus,
    uploadError,
    filename: uploadFilename,
    estimatedTime,
    handleFileUpload,
    resetUpload
  } = useDataUpload();
  
  const { toast } = useToast();

  const handleFileProcessed = useCallback(async (file: File) => {
    try {
      resetUpload();
      const parsedData = await handleFileUpload(file);
      
      if (parsedData) {
        setAnalysisData(parsedData);
        setCurrentFilename(file.name);
        setActiveTab('analysis');
        
        toast({
          title: "Data Loaded",
          description: `${file.name} processed successfully.`,
        });
      }
    } catch (error: any) {
      console.error("Error processing file:", error);
      toast({
        title: "File Processing Error",
        description: error.message || "Failed to process the file.",
        variant: "destructive",
      });
    }
  }, [handleFileUpload, resetUpload, toast]);

  const handleSaveToAccount = async () => {
    if (!analysisData || !currentFilename) return;
    
    try {
      const datasetId = await saveDataset(currentFilename, analysisData);
      if (datasetId) {
        setCurrentDatasetId(datasetId);
        toast({
          title: "Dataset Saved",
          description: "Your analysis has been saved to your account.",
        });
      }
    } catch (error: any) {
      console.error('Error saving dataset:', error);
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save dataset",
        variant: "destructive",
      });
    }
  };

  const handleDataSourceLoaded = (data: any, sourceName: string) => {
    const columns = Object.keys(data[0] || {}).map(key => ({
      name: key,
      type: 'string',
      samples: data.slice(0, 5).map((row: any) => row[key])
    }));
    const summary = {
      totalRows: data.length,
      totalColumns: columns.length,
      source: sourceName
    };
    setAnalysisData({ columns, rows: data, summary });
    setCurrentFilename(sourceName);
    setActiveTab('analysis');
    toast({
      title: "Data Source Loaded",
      description: `Data from ${sourceName} loaded successfully.`,
    });
  };

  const handleDatasetSelect = async (dataset: any) => {
    try {
      // Convert dataset back to AnalysisData format
      const analysisData = {
        columns: dataset.metadata?.columns || [],
        rows: dataset.metadata?.sample_rows || [],
        summary: dataset.summary || {}
      };
      
      setAnalysisData(analysisData);
      setCurrentFilename(dataset.original_filename);
      setCurrentDatasetId(dataset.id);
      setActiveTab('analysis');
      
      toast({
        title: "Dataset Loaded",
        description: `${dataset.name} loaded for analysis.`,
      });
    } catch (error: any) {
      console.error('Error loading dataset:', error);
      toast({
        title: "Load Failed",
        description: "Failed to load dataset for analysis",
        variant: "destructive",
      });
    }
  };

  const handleGenerateMockData = () => {
    const mockData = generateMockDataset(100, 3);
    handleDataSourceLoaded(mockData, 'AI Generated Sample Data');
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    toast({
      title: "Welcome to Data Detective!",
      description: "You're all set to start analyzing your data.",
    });
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    toast({
      title: "Onboarding Skipped",
      description: "You can always access help from the menu.",
    });
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
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('upload')}
                className="mb-4"
              >
                ← Back to Upload
              </Button>
              
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

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="upload" className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload
                  </TabsTrigger>
                  <TabsTrigger value="library" className="flex items-center gap-2">
                    <History className="w-4 h-4" />
                    My Data
                  </TabsTrigger>
                  <TabsTrigger value="connect" className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Connect
                  </TabsTrigger>
                  <TabsTrigger value="profile" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Profile
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="p-6 bg-white/80 backdrop-blur-sm border-purple-200">
                      <div className="flex items-center gap-3 mb-4">
                        <Upload className="w-6 h-6 text-purple-600" />
                        <h2 className="text-xl font-semibold">Upload Your Data</h2>
                      </div>
                      <RateLimitedDropzone 
                        onFileProcessed={handleFileProcessed}
                        maxFileSize={100}
                        maxFilesPerHour={20}
                      />
                    </Card>

                    <Card className="p-6 bg-white/80 backdrop-blur-sm border-green-200">
                      <div className="flex items-center gap-3 mb-4">
                        <Wand2 className="w-6 h-6 text-green-600" />
                        <h2 className="text-xl font-semibold">AI Data Generation</h2>
                      </div>
                      <p className="text-gray-600 mb-4">
                        Don't have data? Let our AI generate sample datasets for practice
                      </p>
                      <Button onClick={handleGenerateMockData} className="w-full">
                        Generate Sample Data
                      </Button>
                    </Card>
                  </div>

                  {(uploading || uploadStatus === 'complete' || uploadStatus === 'error') && (
                    <EnhancedUploadProgress
                      isUploading={uploading}
                      progress={uploadProgress}
                      status={uploadStatus}
                      filename={uploadFilename}
                      error={uploadError}
                      estimatedTime={estimatedTime}
                      onSaveToAccount={user ? handleSaveToAccount : undefined}
                      showSaveOption={user && uploadStatus === 'complete'}
                    />
                  )}
                </TabsContent>

                <TabsContent value="library">
                  {user ? (
                    <div className="space-y-6">
                      <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Dataset Library</h2>
                        <p className="text-gray-600">Manage and analyze your saved datasets</p>
                      </div>
                      <DatasetLibrary onDatasetSelect={handleDatasetSelect} />
                    </div>
                  ) : (
                    <Card className="text-center py-12">
                      <div className="text-center">
                        <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">Sign In Required</h3>
                        <p className="text-gray-500 mb-4">Create an account to save and manage your datasets</p>
                        <Button onClick={() => window.location.href = '/auth'}>
                          Sign In / Sign Up
                        </Button>
                      </div>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="connect">
                  <Card className="p-6 bg-white/80 backdrop-blur-sm border-blue-200">
                    <div className="flex items-center gap-3 mb-4">
                      <Database className="w-6 h-6 text-blue-600" />
                      <h2 className="text-xl font-semibold">Connect Data Source</h2>
                    </div>
                    <DataSourceManager onFileUpload={handleFileProcessed} />
                  </Card>
                </TabsContent>

                <TabsContent value="profile">
                  {user ? (
                    <div className="space-y-6">
                      <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">User Profile</h2>
                        <p className="text-gray-600">Manage your account and preferences</p>
                      </div>
                      <UserProfilePanel />
                    </div>
                  ) : (
                    <Card className="text-center py-12">
                      <div className="text-center">
                        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">Sign In Required</h3>
                        <p className="text-gray-500 mb-4">Create an account to access your profile</p>
                        <Button onClick={() => window.location.href = '/auth'}>
                          Sign In / Sign Up
                        </Button>
                      </div>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default QueryBuilder;
