
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generateLargeBehavioralDataset, convertBehavioralDatasetToCSV, BehavioralDataset } from '../utils/behavioralDataGenerator';
import { parseRawText } from '../utils/dataParser';
import { generateVisualizationRecommendations } from '../utils/visualizationGenerator';
import BusinessInsights from '../components/BusinessInsights';
import DataVisualization from '../components/DataVisualization';
import AIObservationsPanel from '../components/ai/AIObservationsPanel';
import { useAutoQA } from '../hooks/useAutoQA';
import Header from '../components/Header';
import DashboardControls from '../components/dashboard/DashboardControls';
import DatasetCard from '../components/dashboard/DatasetCard';
import ResearchQuestionCard from '../components/dashboard/ResearchQuestionCard';

const Dashboard = () => {
  const [researchQuestion, setResearchQuestion] = useState('');
  const [businessContext, setBusinessContext] = useState('');
  const [dataset, setDataset] = useState<BehavioralDataset | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [visualizationRecs, setVisualizationRecs] = useState<any[]>([]);
  const { toast } = useToast();
  const { runManualQA } = useAutoQA();

  useEffect(() => {
    handleGenerateDataset();
  }, []);

  const handleGenerateDataset = async () => {
    setIsGenerating(true);
    try {
      console.log('🔄 Generating large behavioral dataset...');
      
      const behavioralDataset = generateLargeBehavioralDataset(2000, 90);
      setDataset(behavioralDataset);
      
      const csvData = convertBehavioralDatasetToCSV(behavioralDataset);
      const parsed = parseRawText(csvData);
      setParsedData(parsed);
      
      console.log('✅ Dataset generated and parsed successfully');
      
      toast({
        title: "Dataset Generated!",
        description: `Created ${behavioralDataset.users.length} users with ${behavioralDataset.events.length} behavioral events`,
      });
      
    } catch (error: any) {
      console.error('❌ Error generating dataset:', error);
      toast({
        title: "Generation Error",
        description: error.message || "Failed to generate dataset",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnalyzeQuestion = () => {
    if (!researchQuestion.trim()) {
      toast({
        title: "Missing Question",
        description: "Please enter a research question to analyze.",
        variant: "destructive",
      });
      return;
    }

    if (!parsedData) {
      toast({
        title: "No Data",
        description: "Please generate a dataset first.",
        variant: "destructive",
      });
      return;
    }

    console.log('🔍 Analyzing question:', researchQuestion);
    
    const recommendations = generateVisualizationRecommendations(
      researchQuestion,
      parsedData,
      businessContext
    );
    
    setVisualizationRecs(recommendations);
    
    toast({
      title: "Analysis Complete!",
      description: `Generated ${recommendations.length} visualization recommendations for your question.`,
    });
  };

  const handleDownloadDataset = () => {
    if (!dataset) return;
    
    const csvData = convertBehavioralDatasetToCSV(dataset);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'behavioral_dataset.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: "Behavioral dataset CSV file is downloading...",
    });
  };

  const handleSelectVisualization = (type: string, data: any) => {
    console.log('📊 Selected visualization:', type, data);
    toast({
      title: "Visualization Selected",
      description: `Selected ${type} chart for analysis`,
    });
  };

  const handleQuestionSelect = (question: string) => {
    setResearchQuestion(question);
    if (parsedData) {
      const recommendations = generateVisualizationRecommendations(
        question,
        parsedData,
        businessContext
      );
      setVisualizationRecs(recommendations);
    }
  };

  const runQAAnalysis = async () => {
    try {
      console.log('🔍 Running comprehensive QA analysis...');
      const report = await runManualQA();
      
      toast({
        title: "QA Analysis Complete",
        description: `${report.passed}/${report.totalTests} tests passed. Check console for details.`,
        duration: 5000,
      });
    } catch (error: any) {
      toast({
        title: "QA Analysis Failed",
        description: error.message || "QA analysis encountered an error",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-8 py-6">
          <h1 className="text-3xl font-bold text-purple-600 mb-2">Dashboard</h1>
          <p className="text-blue-600">Let's explore your data together</p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-8 py-8">
        <DashboardControls onRunQA={runQAAnalysis} />

        <DatasetCard
          dataset={dataset}
          isGenerating={isGenerating}
          onGenerate={handleGenerateDataset}
          onDownload={handleDownloadDataset}
        />

        <ResearchQuestionCard
          researchQuestion={researchQuestion}
          businessContext={businessContext}
          setResearchQuestion={setResearchQuestion}
          setBusinessContext={setBusinessContext}
          onAnalyze={handleAnalyzeQuestion}
          canAnalyze={!!parsedData}
        />

        {researchQuestion && parsedData && (
          <div className="space-y-8">
            <AIObservationsPanel
              query={researchQuestion}
              datasetType="behavioral"
              businessContext={businessContext}
              onQuestionSelect={handleQuestionSelect}
            />

            <BusinessInsights onUpdateHypothesis={(hypothesis) => {
              console.log('📝 Updated hypothesis:', hypothesis);
            }} />

            {visualizationRecs.length > 0 && (
              <DataVisualization
                recommendations={visualizationRecs}
                onSelectVisualization={handleSelectVisualization}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
