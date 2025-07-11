
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import DataUploadContainer from './components/upload/DataUploadContainer';
import DashboardContainer from './components/dashboard/DashboardContainer';
import VisualizationReporting from './components/VisualizationReporting';
import ProjectAnalysisView from './components/ProjectAnalysisView';
import { Button } from "@/components/ui/button"
import { Rocket } from "lucide-react"
import { generateMockAnalysisResults } from './utils/mockDataGenerator';
import { EnhancedAnalyticsProvider } from '@/contexts/EnhancedAnalyticsContext';

function App() {
  const [data, setData] = useState<any>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [projectName, setProjectName] = useState('My Project');
  const [researchQuestion, setResearchQuestion] = useState('What are the key trends in user behavior?');
  const [additionalContext, setAdditionalContext] = useState('Analyzing user engagement metrics to improve retention.');
  const [dataSource, setDataSource] = useState('Internal behavioral dataset');
	const { toast } = useToast()

  useEffect(() => {
    // Simulate initial data load and analysis
    // generateSampleData();
  }, []);

  const handleDataUpload = (parsedData: any) => {
    console.log('Data uploaded to App:', parsedData);
    setData(parsedData);
    toast({
      title: "Upload Complete!",
      description: "Your data has been successfully uploaded.",
    });
  };

  const handleRunAnalysis = () => {
    // Simulate running analysis and getting results
    const mockResults = generateMockAnalysisResults();
    setAnalysisResults(mockResults);
		toast({
			title: "Analysis Complete!",
			description: "Your data has been successfully analyzed.",
		  })
  };

  const handleBackToProject = () => {
    setAnalysisResults(null);
  };

  return (
    <EnhancedAnalyticsProvider
      config={{
        enableRealTime: true,
        enableML: true,
        enableCaching: true,
        enableScheduling: true,
        realTimeConfig: {
          batchSize: 50,
          processingInterval: 3000,
          enableStreamProcessing: true
        },
        cacheConfig: {
          maxSize: 200,
          defaultTTL: 10 * 60 * 1000, // 10 minutes
          enableCompression: true
        }
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={
            <div className="container mx-auto mt-10">
              <h1 className="text-3xl font-bold text-center mb-6">Data Analysis Tool</h1>
              <DataUploadContainer onDataUpload={handleDataUpload} />
              {data && (
                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-3">Dashboard</h2>
                   <DashboardContainer data={data} />
                  {!analysisResults && (
                    <div className="flex justify-center mt-6">
                      <Button onClick={handleRunAnalysis}>
                        <Rocket className="mr-2 h-4 w-4" />
                        Run Analysis
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          } />
          <Route path="/reporting" element={<VisualizationReporting />} />
          <Route
            path="/project-analysis"
            element={
              analysisResults ? (
                <ProjectAnalysisView
                  projectName={projectName}
                  analysisResults={analysisResults}
                  onBackToProject={handleBackToProject}
                  researchQuestion={researchQuestion}
                  additionalContext={additionalContext}
                  dataSource={dataSource}
                />
              ) : (
                <div className="container mx-auto mt-10">
                  <h1 className="text-3xl font-bold text-center mb-6">No Analysis Results</h1>
                  <p className="text-center">Please run an analysis first.</p>
                  <div className="flex justify-center mt-6">
                    <Button onClick={handleRunAnalysis}>
                      <Rocket className="mr-2 h-4 w-4" />
                      Run Analysis
                    </Button>
                  </div>
                </div>
              )
            }
          />
        </Routes>
        <Toaster />
      </Router>
    </EnhancedAnalyticsProvider>
  );
}

export default App;
