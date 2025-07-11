
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import DataUploadContainer from './components/upload/DataUploadContainer';
import DashboardContainer from './components/dashboard/DashboardContainer';
import VisualizationReporting from './components/VisualizationReporting';
import ProjectAnalysisView from './components/ProjectAnalysisView';
import NewProject from './pages/NewProject';
import Index from './pages/Index';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import QueryHistory from './pages/QueryHistory';
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
        <div className="min-h-screen bg-background text-foreground">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/new-project" element={<NewProject />} />
            <Route path="/query-history" element={<QueryHistory />} />
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
                  <Index />
                )
              }
            />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </EnhancedAnalyticsProvider>
  );
}

export default App;
