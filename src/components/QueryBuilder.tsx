import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Database, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DataDetectiveLogo } from './ui/logo';
import DropZone from './Dropzone';
import DataSourceManager from './DataSourceManager';
import AnalysisDashboard from './AnalysisDashboard';
import OnboardingFlow from './OnboardingFlow';
import Header from './Header';
import { generateMockDataset } from '@/utils/mockData';
import { parseData } from '@/utils/dataParser';
import QARunner from './QARunner';

interface AnalysisData {
  columns: any[];
  rows: any[];
  summary: any;
}

const QueryBuilder: React.FC = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [currentFilename, setCurrentFilename] = useState<string | null>(null);
	const [findings, setFindings] = useState<any[]>([]);
  const { toast } = useToast();

  const handleFileProcessed = useCallback(async (file: File) => {
    try {
      const parsedData = await parseData(file);
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
    // Simulate parsing and summarizing data
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
    const mockData = generateMockDataset(5, 3);
    handleDataSourceLoaded(mockData, 'AI Generated Data');
  };

  const handleStepComplete = (stepName: string) => {
    toast({
      title: "Onboarding Step Complete",
      description: `You've completed the ${stepName} step!`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <QARunner />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <DataDetectiveLogo />
          </div>

          {!analysisData ? (
            <div className="space-y-8">
              <OnboardingFlow onStepComplete={handleStepComplete} />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6 bg-white/80 backdrop-blur-sm border-purple-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Upload className="w-6 h-6 text-purple-600" />
                    <h2 className="text-xl font-semibold">Upload Your Data</h2>
                  </div>
                  <DropZone onFileProcessed={handleFileProcessed} />
                </Card>

                <Card className="p-6 bg-white/80 backdrop-blur-sm border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Database className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-semibold">Connect Data Source</h2>
                  </div>
                  <DataSourceManager onDataLoaded={handleDataSourceLoaded} />
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
