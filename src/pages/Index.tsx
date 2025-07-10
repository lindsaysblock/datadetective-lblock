
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import DashboardTabNavigation from '@/components/dashboard/DashboardTabNavigation';
import DataPreviewGrid from '@/components/data/DataPreviewGrid';
import DatasetsGrid from '@/components/data/DatasetsGrid';
import DataUploadFlow from '@/components/data/DataUploadFlow';
import { useIndexPageState } from '@/hooks/useIndexPageState';

const Index = () => {
  const {
    user,
    loading,
    handleUserChange,
    activeTab,
    setActiveTab,
    researchQuestion,
    setResearchQuestion,
    datasets,
    datasetsLoading,
    file,
    uploading,
    parsing,
    parsedData,
    handleFileChange,
    handleFileUpload,
    handleSaveDataset,
    handleStartAnalysis
  } = useIndexPageState();

  const navigate = useNavigate();

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
                  ? 'Add your data or connect your data and ask questions to discover insights.'
                  : 'View and manage your uploaded datasets.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeTab === 'dataExploration' ? (
                <div className="space-y-6">
                  <DataUploadFlow
                    file={file}
                    uploading={uploading}
                    parsing={parsing}
                    parsedData={parsedData}
                    researchQuestion={researchQuestion}
                    onFileChange={handleFileChange}
                    onFileUpload={handleFileUpload}
                    onResearchQuestionChange={setResearchQuestion}
                    onStartAnalysis={handleStartAnalysis}
                    onSaveDataset={handleSaveDataset}
                  />

                  {parsedData && (
                    <div className="space-y-4">
                      <Separator />
                      <DataPreviewGrid parsedData={parsedData} />
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
