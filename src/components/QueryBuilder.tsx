
import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Database, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DataDetectiveLogo from './DataDetectiveLogo';
import Dropzone from './Dropzone';
import DataSourceManager from './DataSourceManager';
import AnalysisDashboard from './AnalysisDashboard';
import OnboardingFlow from './OnboardingFlow';
import Header from './Header';
import { generateMockDataset } from '@/utils/mockData';
import { parseFile } from '@/utils/dataParser';
import QARunner from './QARunner';
import { useAuthState } from '@/hooks/useAuthState';

interface AnalysisData {
  columns: any[];
  rows: any[];
  summary: any;
}

const QueryBuilder: React.FC = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [currentFilename, setCurrentFilename] = useState<string | null>(null);
  const [findings, setFindings] = useState<any[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const { user, loading, handleUserChange } = useAuthState();
  const { toast } = useToast();

  const handleFileProcessed = useCallback(async (file: File) => {
    try {
      const parsedData = await parseFile(file);
      setAnalysisData(parsedData);
      setCurrentFilename(file.name);
      toast({
        title: "Data Loaded",
        description: `${file.name} processed successfully.`,
      });
    } catch (error: any) {
      console.error("Error processing file:", error);
      toast({
        title: "File Processing Error",
        description: error.message || "Failed to process the file.",
        variant: "destructive",
      });
    }
  }, [toast]);

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
    toast({
      title: "Data Source Loaded",
      description: `Data from ${sourceName} loaded successfully.`,
    });
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

          {!analysisData ? (
            <div className="space-y-8">
              {showOnboarding && (
                <OnboardingFlow 
                  onComplete={handleOnboardingComplete} 
                  onSkip={handleOnboardingSkip} 
                />
              )}
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6 bg-white/80 backdrop-blur-sm border-purple-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Upload className="w-6 h-6 text-purple-600" />
                    <h2 className="text-xl font-semibold">Upload Your Data</h2>
                  </div>
                  <Dropzone onFileProcessed={handleFileProcessed} />
                </Card>

                <Card className="p-6 bg-white/80 backdrop-blur-sm border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Database className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-semibold">Connect Data Source</h2>
                  </div>
                  <DataSourceManager onFileUpload={handleFileProcessed} />
                </Card>
              </div>

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
          ) : (
            <AnalysisDashboard
              parsedData={analysisData}
              filename={currentFilename}
              findings={findings}
              onDataUpdate={setAnalysisData}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default QueryBuilder;
