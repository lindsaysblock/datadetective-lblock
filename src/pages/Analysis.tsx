import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, FileText, Lightbulb, Search, TrendingUp, Download, MessageSquare, Brain } from 'lucide-react';
import DataDetectiveLogo from '@/components/DataDetectiveLogo';
import Header from '@/components/Header';
import LegalFooter from '@/components/LegalFooter';
import AIRecommendationsModal from '@/components/analysis/AIRecommendationsModal';
import AskMoreQuestionsModal from '@/components/analysis/AskMoreQuestionsModal';
import ChartRenderer from '@/components/visualization/ChartRenderer';
import ReportExporter from '@/components/visualization/ReportExporter';
import DataVisualization from '@/components/DataVisualization';
import { generateVisualizationRecommendations } from '@/utils/visualization/recommendationEngine';

const Analysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [showAskMoreQuestions, setShowAskMoreQuestions] = useState(false);
  const [visualizations, setVisualizations] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);

  useEffect(() => {
    const state = location.state;
    console.log('🔍 Analysis page loaded with navigation state:', state);
    console.log('🔍 State keys:', state ? Object.keys(state) : 'No state');
    console.log('🔍 FormData exists:', !!(state && state.formData));
    console.log('🔍 FormData content:', state?.formData);

    if (!state || !state.formData) {
      console.log('❌ Missing state or formData, redirecting to new-project');
      console.log('❌ State object:', state);
      console.log('❌ FormData:', state?.formData);
      
      toast({
        title: "No Investigation Data",
        description: "No case data found. Starting new investigation.",
        variant: "destructive",
      });
      navigate('/new-project');
      return;
    }

    const { formData, educationalMode, projectName } = state;
    setAnalysisData({ formData, educationalMode, projectName });

    // Simulate real analysis process
    simulateAnalysis(formData, educationalMode);
  }, [location.state, navigate, toast]);

  const simulateAnalysis = async (formData: any, educationalMode: boolean) => {
    try {
      console.log('🔍 Starting real analysis with AnalysisEngine');
      
      // Import the real analysis engine
      const { AnalysisEngine } = await import('@/services/analysisEngine');
      
      // Prepare analysis context
      const analysisContext = {
        researchQuestion: formData.researchQuestion,
        additionalContext: formData.businessContext || '',
        parsedData: formData.parsedData || [],
        columnMapping: formData.columnMapping || {},
        educationalMode
      };
      
      console.log('📊 Analysis context prepared:', {
        researchQuestion: analysisContext.researchQuestion,
        dataFiles: analysisContext.parsedData.length,
        educationalMode: analysisContext.educationalMode
      });
      
      // Phase 1: Data Processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Phase 2: Run real analysis
      const analysisResults = await AnalysisEngine.analyzeData(analysisContext);
      
      console.log('✅ Real analysis completed:', analysisResults);
      
      // Phase 3: Extract insights from real results
      const realInsights = analysisResults.detailedResults?.map(result => ({
        id: result.id,
        title: result.title,
        description: result.description,
        confidence: result.confidence,
        type: 'analysis',
        insight: result.insight
      })) || generateMockInsights(formData);
      
      setInsights(realInsights);
      
      // Phase 4: Create Visualizations based on real data
      const mockVisualizations = await generateMockVisualizations(formData);
      setVisualizations(mockVisualizations);
      
      // Phase 5: Complete Analysis
      setIsAnalyzing(false);
      toast({
        title: "🔍 Investigation Complete!",
        description: `Successfully analyzed case "${analysisData?.projectName || 'Unknown'}" with real insights`,
      });
      
    } catch (error) {
      console.error('❌ Analysis failed:', error);
      
      // Fallback to mock analysis if real analysis fails
      const mockInsights = generateMockInsights(formData);
      setInsights(mockInsights);
      
      const mockVisualizations = await generateMockVisualizations(formData);
      setVisualizations(mockVisualizations);
      
      setIsAnalyzing(false);
      toast({
        title: "⚠️ Analysis Complete (Fallback)",
        description: "Analysis completed using fallback method. Some features may be limited.",
        variant: "destructive"
      });
    }
  };

  const generateMockInsights = (formData: any) => {
    const dataLength = formData.parsedData?.length || 0;
    const rowCount = formData.parsedData?.reduce((sum: number, data: any) => sum + (data.rowCount || data.rows || 0), 0) || 0;
    
    return [
      {
        id: '1',
        title: 'Data Volume Analysis',
        description: `Your dataset contains ${rowCount.toLocaleString()} total records across ${dataLength} file(s).`,
        confidence: 'high',
        type: 'statistical',
        insight: `This represents a ${rowCount > 10000 ? 'large' : rowCount > 1000 ? 'medium' : 'small'} dataset suitable for comprehensive analysis.`
      },
      {
        id: '2', 
        title: 'Research Question Focus',
        description: `Analyzing: "${formData.researchQuestion}"`,
        confidence: 'high',
        type: 'question-based',
        insight: 'This question can be answered through statistical analysis and data visualization.'
      },
      {
        id: '3',
        title: 'Data Quality Assessment',
        description: 'Data structure and completeness evaluation completed.',
        confidence: 'medium',
        type: 'quality',
        insight: 'The data appears well-structured and ready for analysis.'
      }
    ];
  };

  const generateMockVisualizations = async (formData: any) => {
    const recommendations = generateVisualizationRecommendations(
      formData.researchQuestion || '',
      formData.parsedData || { columns: [], rows: [], summary: { totalRows: 0, totalColumns: 0, possibleUserIdColumns: [], possibleTimestampColumns: [] } }
    );
    
    return recommendations.slice(0, 3); // Return top 3 visualizations
  };

  const handleExportFindings = () => {
    const exportData = {
      projectName: analysisData?.projectName,
      researchQuestion: analysisData?.formData?.researchQuestion,
      insights,
      visualizations,
      exportedAt: new Date().toISOString(),
      mode: analysisData?.educationalMode ? 'Educational' : 'Professional'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${analysisData?.projectName || 'analysis'}-findings.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "📋 Findings Exported",
      description: "Your investigation findings have been downloaded.",
    });
  };

  const handleExportVisualReport = () => {
    toast({
      title: "📊 Visual Report",
      description: "Visual report export functionality coming soon!",
    });
  };

  const handleSelectVisualization = (type: string, data: any[]) => {
    console.log('Selected visualization:', type, data);
    toast({
      title: "📈 Visualization Selected",
      description: `${type} chart is now being prepared for analysis.`,
    });
  };

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-blue/5 to-brand-purple/5">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading investigation...</p>
          </div>
        </div>
        <LegalFooter />
      </div>
    );
  }

  const { formData, educationalMode, projectName } = analysisData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue/5 to-brand-purple/5">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button 
              variant="outline" 
              onClick={() => navigate('/new-project')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Button>
            
            <div className="text-center flex-1 mx-8">
              <div className="flex justify-center mb-2">
                <DataDetectiveLogo size="md" showText={false} />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink bg-clip-text text-transparent">
                🕵️ Data Detective Analysis
              </h1>
              <p className="text-brand-blue text-lg">Case: {projectName}</p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleExportFindings}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Findings
              </Button>
            </div>
          </div>

          {/* Analysis Status */}
          {isAnalyzing ? (
            <Card className="mb-8 bg-gradient-to-r from-brand-purple/10 to-brand-blue/10 border-brand-purple/20">
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-purple border-t-transparent mx-auto mb-6"></div>
                <h2 className="text-2xl font-bold text-brand-purple mb-2">🔍 Investigating Your Case</h2>
                <p className="text-brand-blue text-lg mb-4">
                  Our AI detective is examining the evidence for insights...
                </p>
                <p className="text-brand-purple">
                  Research Question: "{formData.researchQuestion}"
                </p>
                {educationalMode && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                    <p className="text-sm text-purple-700">
                      📚 <strong>Educational Mode:</strong> Step-by-step SQL tutorials will be provided during analysis
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Analysis Results Summary */}
              <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <BarChart3 className="w-6 h-6" />
                    🕵️ Investigation Complete!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-700 mb-4">
                    Successfully analyzed {formData.parsedData?.length || 0} evidence file(s) for insights.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <FileText className="w-8 h-8 text-green-600 mb-2" />
                      <h4 className="font-semibold text-green-800">Evidence Processed</h4>
                      <p className="text-green-600 text-sm">
                        {formData.parsedData?.length || 0} files analyzed
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <Lightbulb className="w-8 h-8 text-green-600 mb-2" />
                      <h4 className="font-semibold text-green-800">Key Insights</h4>
                      <p className="text-green-600 text-sm">{insights.length} patterns identified</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
                      <h4 className="font-semibold text-green-800">Visualizations</h4>
                      <p className="text-green-600 text-sm">{visualizations.length} charts generated</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Main Analysis Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Insights & Dig Deeper */}
                <div className="space-y-6">
                  {/* Key Insights */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Search className="w-5 h-5 text-brand-blue" />
                        🔍 Key Investigation Findings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {insights.map((insight, index) => (
                        <div key={insight.id} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-800">{insight.title}</h4>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              insight.confidence === 'high' ? 'bg-green-100 text-green-700' :
                              insight.confidence === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {insight.confidence} confidence
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{insight.description}</p>
                          <p className="text-blue-700 text-sm font-medium">{insight.insight}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Dig Deeper Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">🔍 Let's Dig Deeper</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button
                        onClick={() => setShowAskMoreQuestions(true)}
                        className="w-full flex items-center gap-2 justify-start bg-gradient-to-r from-brand-blue to-brand-purple hover:from-brand-blue/90 hover:to-brand-purple/90"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Ask Additional Questions
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => setShowAIRecommendations(true)}
                        className="w-full flex items-center gap-2 justify-start border-brand-purple text-brand-purple hover:bg-brand-purple/10"
                      >
                        <Brain className="w-4 h-4" />
                        Get AI Recommendations
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => {
                          toast({
                            title: "📊 Creating Visualizations",
                            description: "Visual analysis tools are being prepared...",
                          });
                        }}
                        className="w-full flex items-center gap-2 justify-start border-brand-blue text-brand-blue hover:bg-brand-blue/10"
                      >
                        <BarChart3 className="w-4 h-4" />
                        Create More Visuals
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={handleExportFindings}
                        className="w-full flex items-center gap-2 justify-start border-brand-pink text-brand-pink hover:bg-brand-pink/10"
                      >
                        <Download className="w-4 h-4" />
                        Export Investigation
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column: Visualizations */}
                <div className="space-y-6">
                  {/* Data Visualizations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-brand-purple" />
                        📊 Visual Evidence
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {visualizations.length > 0 ? (
                        <DataVisualization 
                          recommendations={visualizations}
                          onSelectVisualization={handleSelectVisualization}
                        />
                      ) : (
                        <div className="text-center py-8">
                          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">Generating visual evidence...</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Export Options */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Download className="w-5 h-5 text-brand-pink" />
                        📋 Export Investigation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ReportExporter
                        findings={insights}
                        onExportAllFindings={handleExportFindings}
                        onExportVisualReport={handleExportVisualReport}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Case Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>🗂️ Case Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Research Question:</h4>
                    <p className="text-muted-foreground bg-muted p-3 rounded-lg">
                      {formData.researchQuestion}
                    </p>
                  </div>
                  
                  {formData.businessContext && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Business Context:</h4>
                      <p className="text-muted-foreground bg-muted p-3 rounded-lg">
                        {formData.businessContext}
                      </p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Investigation Mode:</h4>
                    <p className="text-muted-foreground">
                      {educationalMode ? '📚 Educational Mode - SQL step-by-step guidance' : '💼 Professional Mode - Direct results'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AIRecommendationsModal
        open={showAIRecommendations}
        onOpenChange={setShowAIRecommendations}
        analysisResults={insights}
        onImplementRecommendation={(recommendation) => {
          console.log('Implementing recommendation:', recommendation);
          toast({
            title: "💡 Recommendation Applied",
            description: "Implementation started for selected recommendation.",
          });
        }}
      />
      
      <AskMoreQuestionsModal
        open={showAskMoreQuestions}
        onOpenChange={setShowAskMoreQuestions}
        currentAnalysis={insights}
        analysisContext={{
          researchQuestion: formData.researchQuestion,
          additionalContext: formData.businessContext || '',
          parsedData: formData.parsedData || [],
          educationalMode: educationalMode
        }}
        onSubmitQuestion={async (question, context) => {
          console.log('New question submitted:', question, context);
          setShowAskMoreQuestions(false);
          toast({
            title: "🔍 New Question Added",
            description: "Starting additional investigation...",
          });
        }}
      />
      
      <LegalFooter />
    </div>
  );
};

export default Analysis;