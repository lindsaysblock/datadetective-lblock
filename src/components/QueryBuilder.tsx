
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lightbulb, BarChart3, Database, Upload, TestTube } from 'lucide-react';
import Header from './Header';
import DataSourceManager from './DataSourceManager';
import AnalysisDashboard from './AnalysisDashboard';
import DataTestingPanel from './DataTestingPanel';
import UnifiedProgress from './UnifiedProgress';
import AnalyzingIcon from './AnalyzingIcon';
import { useAuthState } from '../hooks/useAuthState';
import { useDataUpload } from '../hooks/useDataUpload';

const QueryBuilder = () => {
  const [activeTab, setActiveTab] = useState('connect');
  const { user, loading, handleUserChange } = useAuthState();
  const {
    uploading,
    uploadProgress,
    uploadStatus,
    uploadError,
    filename,
    parsedData,
    findings,
    analyzing,
    estimatedTime,
    handleFileUpload
  } = useDataUpload();

  const onFileUploadWrapper = async (file: File) => {
    try {
      await handleFileUpload(file);
      setTimeout(() => {
        setActiveTab('insights');
      }, 1500);
    } catch (error) {
      console.error('File upload failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header user={user} onUserChange={handleUserChange} />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <AnalyzingIcon isAnalyzing={true} />
        </div>
      </div>
    );
  }

  // Show upload progress screen
  if (uploading || uploadStatus === 'complete' || uploadStatus === 'error' || analyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header user={user} onUserChange={handleUserChange} />
        <div className="container mx-auto px-4 py-8 space-y-6">
          <UnifiedProgress
            isActive={uploading || analyzing}
            progress={uploadProgress}
            status={uploadStatus}
            filename={filename}
            error={uploadError}
            estimatedTime={estimatedTime}
          />
          {analyzing && (
            <div className="text-center">
              <AnalyzingIcon isAnalyzing={analyzing} />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show analysis dashboard after successful data upload
  if (parsedData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header user={user} onUserChange={handleUserChange} />
        <div className="container mx-auto px-4 py-8">
          <AnalysisDashboard
            parsedData={parsedData}
            filename={filename}
            findings={findings}
          />
        </div>
      </div>
    );
  }

  // Main landing page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header user={user} onUserChange={handleUserChange} />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your AI-powered business intelligence companion. Connect your data, ask questions in natural language, 
            and get instant insights with beautiful visualizations.
          </p>
          
          {!user && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-2xl mx-auto">
              <p className="text-blue-800">
                👋 Welcome! You can explore the dashboard and connect data sources. 
                Sign in using the Account tab above to save your work and access advanced features.
              </p>
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="connect" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Connect
            </TabsTrigger>
            <TabsTrigger value="testing" className="flex items-center gap-2">
              <TestTube className="w-4 h-4" />
              Testing
            </TabsTrigger>
            <TabsTrigger value="query" className="flex items-center gap-2" disabled={!user}>
              <Database className="w-4 h-4" />
              Query
            </TabsTrigger>
            <TabsTrigger value="visualize" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Visualize
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="connect" className="space-y-6">
            <DataSourceManager onFileUpload={onFileUploadWrapper} />
          </TabsContent>

          <TabsContent value="testing" className="space-y-6">
            <DataTestingPanel />
          </TabsContent>

          <TabsContent value="query" className="space-y-6">
            <Card className="p-6">
              <div className="text-center">
                <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Query Builder</h3>
                <p className="text-gray-500">Advanced query capabilities coming soon!</p>
                {!user && (
                  <p className="text-sm text-blue-600 mt-2">Sign in to access query features</p>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="visualize" className="space-y-6">
            <Card className="p-6">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Data Visualization</h3>
                <p className="text-gray-500">Upload data first to see visualization recommendations!</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card className="p-6">
              <div className="text-center">
                <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Business Insights</h3>
                <p className="text-gray-500">Connect your data to start generating insights!</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default QueryBuilder;
