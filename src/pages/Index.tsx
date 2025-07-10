
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDatasetPersistence } from '@/hooks/useDatasetPersistence';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import { useAuthState } from '@/hooks/useAuthState';
import DashboardTabNavigation from '@/components/dashboard/DashboardTabNavigation';
import FileUploadSection from '@/components/data/FileUploadSection';
import DataPreviewGrid from '@/components/data/DataPreviewGrid';
import DatasetsGrid from '@/components/data/DatasetsGrid';
import { useFileUpload } from '@/hooks/useFileUpload';

const Index = () => {
  const { user, loading, handleUserChange } = useAuthState();
  const [activeTab, setActiveTab] = useState('dataExploration');
  const [initialQuestion, setInitialQuestion] = useState('');
  const { toast } = useToast();
  const { datasets, saveDataset, loading: datasetsLoading, refreshDatasets } = useDatasetPersistence();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');

  const {
    file,
    uploading,
    parsing,
    parsedData,
    handleFileChange,
    handleFileUpload
  } = useFileUpload();

  useEffect(() => {
    if (projectId) {
      toast({
        title: "Project Loaded",
        description: `Project ID: ${projectId} loaded. Start exploring!`,
      });
    }
  }, [projectId, toast]);

  const handleSaveDataset = async () => {
    if (!parsedData || !file) {
      toast({
        title: "Error",
        description: "No data to save. Please upload a file and ensure it's parsed correctly.",
        variant: "destructive",
      });
      return;
    }

    try {
      const datasetId = await saveDataset(file.name, parsedData);
      
      toast({
        title: "Dataset Saved",
        description: `${file.name} has been saved.`,
      });

      navigate(`/?dataset=${datasetId}`);
    } catch (error: any) {
      console.error("Save Dataset Error:", error);
      toast({
        title: "Save Error",
        description: error.message || "Failed to save dataset.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header user={user} onUserChange={handleUserChange} />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header user={user} onUserChange={handleUserChange} />
      
      <div className="container mx-auto px-4 py-8">
        {!user ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Data Detective</h2>
              <p className="text-gray-600 mb-6">Sign in to start exploring and analyzing your data.</p>
              <Button onClick={() => navigate('/auth')}>Sign In</Button>
            </div>
          </div>
        ) : (
          <Card className="mb-8 border-blue-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">Data Exploration</CardTitle>
                <DashboardTabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
              </div>
              <CardDescription className="text-gray-600">
                {activeTab === 'dataExploration'
                  ? 'Upload a file to explore its contents and ask questions.'
                  : 'View and manage your uploaded datasets.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeTab === 'dataExploration' ? (
                <div className="space-y-4">
                  <FileUploadSection
                    file={file}
                    uploading={uploading}
                    parsing={parsing}
                    onFileChange={handleFileChange}
                    onFileUpload={handleFileUpload}
                  />

                  {parsedData && (
                    <div className="space-y-4">
                      <DataPreviewGrid parsedData={parsedData} />

                      <Separator />

                      <div className="flex justify-between items-center">
                        <div>
                          <Label htmlFor="initialQuestion" className="block text-sm font-medium text-gray-700">
                            Initial Question
                          </Label>
                          <Input
                            type="text"
                            id="initialQuestion"
                            placeholder="What do you want to know about this data?"
                            className="mt-1"
                            value={initialQuestion}
                            onChange={(e) => setInitialQuestion(e.target.value)}
                          />
                        </div>
                        <Button onClick={handleSaveDataset}>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Save Dataset
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <DatasetsGrid datasets={datasets} loading={datasetsLoading} />
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
