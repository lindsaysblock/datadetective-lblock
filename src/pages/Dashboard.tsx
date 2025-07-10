
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Brain, Download, Sparkles, BarChart3 } from 'lucide-react';
import { generateLargeBehavioralDataset, convertBehavioralDatasetToCSV, BehavioralDataset } from '../utils/behavioralDataGenerator';
import { parseRawText } from '../utils/dataParser';
import { generateVisualizationRecommendations } from '../utils/visualizationGenerator';
import BusinessInsights from '../components/BusinessInsights';
import DataVisualization from '../components/DataVisualization';
import AIObservationsPanel from '../components/ai/AIObservationsPanel';
import { useAutoQA } from '../hooks/useAutoQA';
import Header from '../components/Header';

const Dashboard = () => {
  const [researchQuestion, setResearchQuestion] = useState('');
  const [businessContext, setBusinessContext] = useState('');
  const [dataset, setDataset] = useState<BehavioralDataset | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [visualizationRecs, setVisualizationRecs] = useState<any[]>([]);
  const { toast } = useToast();
  const { runManualQA } = useAutoQA();

  // Generate sample dataset on component mount
  useEffect(() => {
    handleGenerateDataset();
  }, []);

  const handleGenerateDataset = async () => {
    setIsGenerating(true);
    try {
      console.log('🔄 Generating large behavioral dataset...');
      
      // Generate comprehensive behavioral dataset
      const behavioralDataset = generateLargeBehavioralDataset(2000, 90); // 2000 users, 90 days
      setDataset(behavioralDataset);
      
      // Convert to CSV for parsing
      const csvData = convertBehavioralDatasetToCSV(behavioralDataset);
      
      // Parse the data using our existing parser
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
    
    // Generate visualization recommendations based on the question
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
    // Auto-analyze the selected question
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
      
      {/* Page Title Section - Below Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-8 py-6">
          <h1 className="text-3xl font-bold text-purple-600 mb-2">Dashboard</h1>
          <p className="text-blue-600">Let's explore your data together</p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-8 py-8">
        {/* QA Controls */}
        <div className="mb-6 flex justify-center">
          <Button 
            onClick={runQAAnalysis}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
          >
            🔍 Run QA Analysis
          </Button>
        </div>

        {/* Dataset Generation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Behavioral Dataset
            </CardTitle>
            <CardDescription>
              Large-scale behavioral dataset with user activities, sessions, and conversions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                {dataset ? (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      <strong>{dataset.users.length}</strong> users • <strong>{dataset.events.length}</strong> events • <strong>{dataset.sessions.length}</strong> sessions
                    </p>
                    <p className="text-xs text-gray-500">
                      Date range: {new Date(dataset.metadata.dateRange.start).toLocaleDateString()} - {new Date(dataset.metadata.dateRange.end).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500">No dataset generated yet</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleGenerateDataset}
                  disabled={isGenerating}
                  variant="outline"
                >
                  {isGenerating ? 'Generating...' : 'Generate New Dataset'}
                </Button>
                {dataset && (
                  <Button onClick={handleDownloadDataset} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download CSV
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Research Question */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              What do you want to discover?
            </CardTitle>
            <CardDescription>
              Ask a question about user behavior, engagement, or business metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="research-question">Research Question</Label>
              <Input
                id="research-question"
                placeholder="e.g., What user behaviors predict high lifetime value? How do engagement patterns differ across user segments?"
                value={researchQuestion}
                onChange={(e) => setResearchQuestion(e.target.value)}
                className="text-sm"
              />
            </div>
            
            <div>
              <Label htmlFor="business-context">Business Context (Optional)</Label>
              <Textarea
                id="business-context"
                placeholder="e.g., We're a SaaS platform focused on improving user retention. Our main concern is understanding which early behaviors indicate long-term success..."
                value={businessContext}
                onChange={(e) => setBusinessContext(e.target.value)}
                className="text-sm min-h-[80px]"
              />
            </div>

            <Button 
              onClick={handleAnalyzeQuestion}
              disabled={!researchQuestion.trim() || !parsedData}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              🔍 Analyze Question
            </Button>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {researchQuestion && parsedData && (
          <div className="space-y-8">
            {/* AI Observations */}
            <AIObservationsPanel
              query={researchQuestion}
              datasetType="behavioral"
              businessContext={businessContext}
              onQuestionSelect={handleQuestionSelect}
            />

            {/* Business Insights */}
            <BusinessInsights onUpdateHypothesis={(hypothesis) => {
              console.log('📝 Updated hypothesis:', hypothesis);
            }} />

            {/* Visualizations */}
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
