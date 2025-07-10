import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lightbulb, BarChart3, Database, Upload, TestTube } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from './Header';
import DataSourceConfig from './DataSourceConfig';
import UploadProgress from './UploadProgress';
import DataVisualization from './DataVisualization';
import BusinessInsights from './BusinessInsights';
import HypothesisTracker from './HypothesisTracker';
import VisualizationFindings from './VisualizationFindings';
import AnalyzingIcon from './AnalyzingIcon';
import DataTestingPanel from './DataTestingPanel';
import { parseFile, generateDataInsights, type ParsedData } from '../utils/dataParser';
import { supabase } from '@/integrations/supabase/client';

interface DataSource {
  id: string;
  name: string;
  type: 'file' | 'database' | 'api' | 'warehouse' | 'amplitude';
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: Date;
}

const QueryBuilder = () => {
  const [activeTab, setActiveTab] = useState('connect');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'uploading' | 'processing' | 'complete' | 'error'>('uploading');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | undefined>(undefined);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [findings, setFindings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
        
        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          console.log('Auth state changed:', event, session?.user?.email);
          setUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleUserChange = (newUser: any) => {
    setUser(newUser);
  };

  const handleDataSourceConnect = async (source: DataSource) => {
    console.log('Data source connected:', source);
    setAnalyzing(true);
    
    // Simulate connection and analysis process with progress updates
    const totalSteps = 5;
    const estimatedTotalTime = 15000; // 15 seconds
    setEstimatedTime(estimatedTotalTime);
    
    for (let step = 1; step <= totalSteps; step++) {
      await new Promise(resolve => setTimeout(resolve, estimatedTotalTime / totalSteps));
      const progress = (step / totalSteps) * 100;
      setUploadProgress(progress);
      setEstimatedTime(estimatedTotalTime - (step * (estimatedTotalTime / totalSteps)));
    }
    
    setAnalyzing(false);
    setUploadProgress(0);
    setEstimatedTime(0);
    
    toast({
      title: "Data Source Connected!",
      description: `Successfully connected to ${source.name}.`,
    });
  };

  const handleFileUpload = async (file: File) => {
    console.log('Starting file upload:', file.name);
    setUploading(true);
    setUploadProgress(0);
    setUploadStatus('uploading');
    setUploadError(null);
    setFilename(file.name);
    setAnalyzing(true);

    // Calculate estimated time based on file size (rough estimate: 1MB per 2 seconds)
    const fileSizeInMB = file.size / (1024 * 1024);
    const baseTime = Math.max(5000, fileSizeInMB * 2000); // Minimum 5 seconds
    setEstimatedTime(baseTime);

    try {
      // Upload phase (30% of progress)
      setUploadProgress(10);
      await new Promise(resolve => setTimeout(resolve, baseTime * 0.2));
      setUploadProgress(30);
      setEstimatedTime(baseTime * 0.7);
      
      console.log('Parsing file...');
      const parsed = await parseFile(file);
      console.log('File parsed successfully:', parsed.summary);
      setParsedData(parsed);
      
      // Processing phase (50% of progress)
      setUploadProgress(50);
      setUploadStatus('processing');
      setEstimatedTime(baseTime * 0.5);
      
      await new Promise(resolve => setTimeout(resolve, baseTime * 0.3));
      setUploadProgress(80);
      setEstimatedTime(baseTime * 0.2);

      const generatedInsights = generateDataInsights(parsed);
      setInsights(generatedInsights);
      console.log('Generated insights:', generatedInsights.length);
      
      const mockFindings = generateMockFindings(parsed);
      setFindings(mockFindings);
      console.log('Generated findings:', mockFindings.length);
      
      // Final phase
      await new Promise(resolve => setTimeout(resolve, baseTime * 0.2));
      setUploadStatus('complete');
      setUploadProgress(100);
      setEstimatedTime(0);

      setTimeout(() => {
        setActiveTab('insights');
      }, 1500);

      toast({
        title: "Upload Complete!",
        description: `Successfully processed ${file.name} with ${parsed.summary.totalRows} rows.`,
      });
    } catch (error: any) {
      console.error("File upload error:", error);
      setUploadStatus('error');
      setUploadError(error.message || 'Failed to process file');
      setEstimatedTime(0);
      toast({
        title: "Upload Failed",
        description: `Failed to process ${file.name}: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  };

  const generateMockFindings = (data: ParsedData) => {
    const findings = [];
    
    if (data.summary.possibleUserIdColumns.length > 0) {
      findings.push({
        id: '1',
        title: 'User Identification Patterns',
        description: 'Analysis of user identifier distribution in the dataset',
        chartType: 'Bar Chart',
        insight: `Found ${data.summary.possibleUserIdColumns.length} potential user ID columns. This suggests good data structure for user behavior analysis.`,
        confidence: 'high' as const,
        timestamp: new Date(),
        chartData: data.summary.possibleUserIdColumns.map(col => ({
          name: col,
          value: Math.floor(Math.random() * 100) + 50
        }))
      });
    }

    if (data.summary.totalRows > 100) {
      findings.push({
        id: '2',
        title: 'Dataset Size Analysis',
        description: 'Statistical significance assessment of the dataset',
        chartType: 'Line Chart',
        insight: `Dataset contains ${data.summary.totalRows} rows, which provides good statistical power for analysis. Confidence intervals will be reliable.`,
        confidence: 'high' as const,
        timestamp: new Date(),
        chartData: [
          { name: 'Sample Size', value: data.summary.totalRows },
          { name: 'Recommended Min', value: 100 },
          { name: 'Statistical Power', value: Math.min(data.summary.totalRows / 10, 95) }
        ]
      });
    }

    return findings;
  };

  const handleHypothesisUpdate = (hypothesis: any) => {
    console.log('Hypothesis updated:', hypothesis);
    toast({
      title: "Hypothesis Updated",
      description: "Your hypothesis has been updated successfully.",
    });
  };

  const handleSelectVisualization = (type: string, data: any[]) => {
    console.log('Visualization selected:', type, data);
    toast({
      title: "Visualization Selected",
      description: `Selected ${type} chart for visualization.`,
    });
    
    // Auto-switch to findings tab to show the results
    setActiveTab('insights');
  };

  const handleExportFinding = (finding: any) => {
    console.log('Exporting finding:', finding);
    
    // Create downloadable JSON
    const exportData = {
      finding,
      exportDate: new Date().toISOString(),
      metadata: {
        source: filename || 'unknown',
        dataRows: parsedData?.summary.totalRows || 0
      }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `finding-${finding.id}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Finding Exported",
      description: "Your finding has been exported successfully.",
    });
  };

  const handleShareFinding = (finding: any) => {
    console.log('Sharing finding:', finding);
    
    // Copy finding summary to clipboard
    const shareText = `📊 Data Finding: ${finding.title}\n\n${finding.insight}\n\nConfidence: ${finding.confidence}\nGenerated: ${finding.timestamp.toLocaleDateString()}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        toast({
          title: "Finding Copied",
          description: "Finding summary copied to clipboard for sharing.",
        });
      }).catch(() => {
        toast({
          title: "Share Ready",
          description: "Finding details logged to console for sharing.",
        });
      });
    } else {
      toast({
        title: "Share Ready",
        description: "Finding details logged to console for sharing.",
      });
    }
  };

  const generateRecommendations = (data: ParsedData) => {
    const numericColumns = data.columns.filter(col => col.type === 'number');
    const recommendations = [];

    if (numericColumns.length > 0) {
      recommendations.push({
        type: 'bar' as const,
        title: 'Numeric Data Distribution',
        description: 'Compare values across different numeric columns',
        icon: BarChart3,
        data: numericColumns.slice(0, 5).map(col => ({
          name: col.name,
          value: col.samples.reduce((sum, val) => sum + (Number(val) || 0), 0) / col.samples.length || 0
        })),
        reason: 'Shows distribution of numeric values across columns',
        confidence: 'high' as const,
        qualityScore: {
          completeness: Math.min(95, Math.max(60, (data.summary.totalRows / 10))),
          consistency: Math.min(95, Math.max(70, 100 - (data.columns.length * 2))),
          accuracy: Math.min(95, Math.max(75, 100 - (data.summary.totalColumns * 1.5))),
          overall: Math.min(95, Math.max(70, (data.summary.totalRows / 10))),
          issues: data.summary.totalRows < 50 ? ['Small sample size may affect reliability'] : []
        },
        validation: {
          sampleSize: data.summary.totalRows,
          confidenceLevel: 95,
          marginOfError: Math.max(1, Math.min(10, 100 / Math.sqrt(data.summary.totalRows))),
          isSignificant: data.summary.totalRows >= 30,
          warnings: data.summary.totalRows < 30 ? ['Sample size below recommended minimum'] : []
        },
        businessRelevance: 'Understanding data distribution helps identify patterns and outliers in your dataset.'
      });
    }

    const dateColumns = data.columns.filter(col => col.type === 'date');
    if (dateColumns.length > 0) {
      recommendations.push({
        type: 'line' as const,
        title: 'Time Series Analysis',
        description: 'Analyze trends over time periods',
        icon: BarChart3,
        data: dateColumns.slice(0, 3).map((col, index) => ({
          name: col.name,
          value: 100 - (index * 20)
        })),
        reason: 'Time-based data can reveal seasonal patterns and trends',
        confidence: 'medium' as const,
        qualityScore: {
          completeness: 85,
          consistency: 90,
          accuracy: 85,
          overall: 87,
          issues: []
        },
        validation: {
          sampleSize: data.summary.totalRows,
          confidenceLevel: 90,
          marginOfError: 4.5,
          isSignificant: true,
          warnings: []
        },
        businessRelevance: 'Time series analysis helps identify growth trends and seasonal patterns in your business data.'
      });
    }

    return recommendations;
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

  // Show upload progress screen with enhanced progress bar
  if (uploading || uploadStatus === 'complete' || uploadStatus === 'error' || analyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header user={user} onUserChange={handleUserChange} />
        <div className="container mx-auto px-4 py-8 space-y-6">
          <UploadProgress
            isUploading={uploading || analyzing}
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
    const recommendations = generateRecommendations(parsedData);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header user={user} onUserChange={handleUserChange} />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              📊 Data Analysis Dashboard
            </h1>
            <p className="text-gray-600">
              Analyzing {filename} • {parsedData.summary.totalRows} rows • {parsedData.summary.totalColumns} columns
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Business Insights
              </TabsTrigger>
              <TabsTrigger value="visualize" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Visualizations
              </TabsTrigger>
              <TabsTrigger value="hypothesis" className="flex items-center gap-2">
                <TestTube className="w-4 h-4" />
                Hypothesis
              </TabsTrigger>
              <TabsTrigger value="findings" className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Findings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="insights">
              <BusinessInsights onUpdateHypothesis={handleHypothesisUpdate} />
            </TabsContent>

            <TabsContent value="visualize">
              <DataVisualization 
                recommendations={recommendations}
                onSelectVisualization={handleSelectVisualization}
              />
            </TabsContent>

            <TabsContent value="hypothesis">
              <HypothesisTracker onHypothesisUpdate={handleHypothesisUpdate} />
            </TabsContent>

            <TabsContent value="findings">
              <VisualizationFindings 
                findings={findings}
                onExportFinding={handleExportFinding}
                onShareFinding={handleShareFinding}
              />
            </TabsContent>
          </Tabs>
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
            <DataSourceConfig 
              onDataSourceConnect={handleDataSourceConnect}
              onFileUpload={handleFileUpload}
            />
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
