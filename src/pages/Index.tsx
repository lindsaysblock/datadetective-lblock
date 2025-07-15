
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, BarChart3, Users, History, Settings, Play } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useOptimizedDataPipeline } from '@/hooks/useOptimizedDataPipeline';
import { useAnalyticsManager } from '@/hooks/useAnalyticsManager';
import DataUploadFlow from '@/components/data/DataUploadFlow';
import AnalysisDashboard from '@/components/AnalysisDashboard';
import OptimizedE2ETestRunner from '@/components/testing/OptimizedE2ETestRunner';
import { parseFile } from '@/utils/dataParser';

const Index = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Use auth guard to protect this route
  useAuthGuard({ requireAuth: true });

  const [activeTab, setActiveTab] = useState('upload');
  const [file, setFile] = useState<File | null>(null);
  const [researchQuestion, setResearchQuestion] = useState('');
  const [parsedData, setParsedData] = useState<any>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const dataPipeline = useOptimizedDataPipeline();
  const analyticsManager = useAnalyticsManager();

  // Handle route state for continuing investigations
  useEffect(() => {
    if (location.state?.selectedDataset) {
      const dataset = location.state.selectedDataset;
      console.log('📊 Continuing investigation with dataset:', dataset);
      
      // Reconstruct parsed data from dataset
      const reconstructedData = {
        columns: dataset.metadata?.columns || [],
        rows: dataset.metadata?.sample_rows || [],
        rowCount: dataset.metadata?.sample_rows?.length || 0,
        fileSize: dataset.file_size || 0,
        summary: dataset.summary || {}
      };
      
      setParsedData(reconstructedData);
      setActiveTab(location.state.activeTab || 'analysis');
      setShowAnalysis(true);
    }
  }, [location.state]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log('📁 File selected:', selectedFile.name);
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;

    try {
      console.log('🔄 Starting file upload process...');
      const data = await dataPipeline.processFile(file);
      setParsedData(data);
      console.log('✅ File processed successfully');
    } catch (error) {
      console.error('❌ File upload failed:', error);
    }
  };

  const handleStartAnalysis = async () => {
    if (!parsedData) return;

    try {
      console.log('🔍 Starting analysis...');
      await analyticsManager.runAnalysis(parsedData);
      setShowAnalysis(true);
      setActiveTab('analysis');
      console.log('✅ Analysis completed');
    } catch (error) {
      console.error('❌ Analysis failed:', error);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-gray-600">Please sign in to continue</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Analysis Platform</h1>
          <p className="text-gray-600">Upload, analyze, and gain insights from your data</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="testing" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Testing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Data</CardTitle>
              </CardHeader>
              <CardContent>
                <DataUploadFlow
                  file={file}
                  uploading={dataPipeline.isProcessing}
                  parsing={dataPipeline.isProcessing}
                  parsedData={parsedData}
                  researchQuestion={researchQuestion}
                  onFileChange={handleFileChange}
                  onFileUpload={handleFileUpload}
                  onResearchQuestionChange={setResearchQuestion}
                  onStartAnalysis={handleStartAnalysis}
                  onSaveDataset={() => {}}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="mt-6">
            {showAnalysis && parsedData ? (
              <AnalysisDashboard
                parsedData={parsedData}
                filename={file?.name || 'Dataset'}
                findings={analyticsManager.results}
                onDataUpdate={setParsedData}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Data to Analyze</h3>
                    <p className="text-gray-600 mb-4">Upload a dataset to start analyzing</p>
                    <Button onClick={() => setActiveTab('upload')}>
                      Upload Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Analysis History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <History className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">History Coming Soon</h3>
                  <p className="text-gray-600">Your analysis history will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Settings className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Settings Coming Soon</h3>
                  <p className="text-gray-600">Platform settings will be available here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testing" className="mt-6">
            <OptimizedE2ETestRunner />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
