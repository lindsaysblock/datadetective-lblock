
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, FileText, Database, MessageSquare, Upload } from 'lucide-react';
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
  const [researchQuestion, setResearchQuestion] = useState('');
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

  const handleStartAnalysis = () => {
    if (!parsedData) {
      toast({
        title: "No Data",
        description: "Please upload data first before starting analysis.",
        variant: "destructive",
      });
      return;
    }

    if (!researchQuestion.trim()) {
      toast({
        title: "Missing Question",
        description: "Please describe what you want to analyze or discover.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically start the analysis process
    toast({
      title: "Analysis Started",
      description: `Starting analysis: "${researchQuestion}"`,
    });
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
                <CardTitle className="text-2xl font-bold">Data Detective</CardTitle>
                <DashboardTabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
              </div>
              <CardDescription className="text-gray-600">
                {activeTab === 'dataExploration'
                  ? 'Upload your data and ask questions to discover insights.'
                  : 'View and manage your uploaded datasets.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeTab === 'dataExploration' ? (
                <div className="space-y-6">
                  {/* Step 1: Data Status */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${parsedData ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <h3 className="font-medium">Step 1: Your Data</h3>
                    </div>
                    {parsedData ? (
                      <div className="flex items-center gap-2 text-sm text-green-700">
                        <FileText className="w-4 h-4" />
                        <span>Loaded: {file?.name} ({parsedData.rows?.length || 0} rows, {parsedData.columns?.length || 0} columns)</span>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600">No data loaded. Upload a file to get started.</p>
                        <FileUploadSection
                          file={file}
                          uploading={uploading}
                          parsing={parsing}
                          onFileChange={handleFileChange}
                          onFileUpload={handleFileUpload}
                        />
                      </div>
                    )}
                  </div>

                  {/* Step 2: Research Question */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${researchQuestion.trim() ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <h3 className="font-medium">Step 2: What do you want to discover?</h3>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="researchQuestion" className="text-sm text-gray-700">
                        Describe your research question or what you want to analyze
                      </Label>
                      <Input
                        id="researchQuestion"
                        placeholder="e.g., What factors influence customer satisfaction? Are there any sales trends over time?"
                        value={researchQuestion}
                        onChange={(e) => setResearchQuestion(e.target.value)}
                        className="text-sm"
                      />
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <MessageSquare className="w-3 h-3" />
                        <span>Be specific about what insights you're looking for</span>
                      </div>
                    </div>
                  </div>

                  {/* Data Preview */}
                  {parsedData && (
                    <div className="space-y-4">
                      <Separator />
                      <DataPreviewGrid parsedData={parsedData} />
                    </div>
                  )}

                  {/* Action Buttons */}
                  {parsedData && (
                    <div className="flex justify-between items-center pt-4 border-t">
                      <Button 
                        onClick={handleSaveDataset}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Database className="w-4 h-4" />
                        Save Dataset
                      </Button>
                      
                      <Button 
                        onClick={handleStartAnalysis}
                        disabled={!researchQuestion.trim()}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Start Analysis
                      </Button>
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
