
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lightbulb, BarChart3, Database, Upload, TestTube } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();

    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
  }, []);

  const handleDataSourceConnect = (source: DataSource) => {
    toast({
      title: "Data Source Connected!",
      description: `Successfully connected to ${source.name}.`,
    });
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);
    setUploadStatus('uploading');
    setUploadError(null);
    setFilename(file.name);

    try {
      const parsed = await parseFile(file);
      setParsedData(parsed);
      setUploadProgress(30);
      setUploadStatus('processing');

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      setUploadProgress(70);

      const generatedInsights = generateDataInsights(parsed);
      setInsights(generatedInsights);
      setUploadStatus('complete');
      setUploadProgress(100);

      toast({
        title: "Upload Complete!",
        description: `Successfully processed ${file.name} with ${parsed.summary.totalRows} rows.`,
      });
    } catch (error: any) {
      console.error("File upload error:", error);
      setUploadStatus('error');
      setUploadError(error.message || 'Failed to process file');
      toast({
        title: "Upload Failed",
        description: `Failed to process ${file.name}: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
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
  };

  const handleExportFinding = (finding: any) => {
    console.log('Exporting finding:', finding);
    toast({
      title: "Finding Exported",
      description: "Your finding has been exported successfully.",
    });
  };

  const handleShareFinding = (finding: any) => {
    console.log('Sharing finding:', finding);
    toast({
      title: "Finding Shared",
      description: "Your finding has been shared successfully.",
    });
  };

  // Generate mock recommendations from parsed data
  const generateRecommendations = (data: ParsedData) => {
    const numericColumns = data.columns.filter(col => col.type === 'number');
    const recommendations = [];

    if (numericColumns.length > 0) {
      recommendations.push({
        type: 'bar' as const,
        title: 'Column Value Distribution',
        description: 'Compare values across different categories',
        icon: BarChart3,
        data: numericColumns.slice(0, 5).map(col => ({
          name: col.name,
          value: col.samples.reduce((sum, val) => sum + (Number(val) || 0), 0) / col.samples.length || 0
        })),
        reason: 'Shows distribution of numeric values across columns',
        confidence: 'high' as const,
        qualityScore: {
          completeness: 85,
          consistency: 92,
          accuracy: 88,
          overall: 88,
          issues: []
        },
        validation: {
          sampleSize: data.summary.totalRows,
          confidenceLevel: 95,
          marginOfError: 3.5,
          isSignificant: true,
          warnings: []
        },
        businessRelevance: 'Understanding data distribution helps identify patterns and outliers in your dataset.'
      });
    }

    return recommendations;
  };

  if (uploading || uploadStatus === 'complete' || uploadStatus === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <UploadProgress
            isUploading={uploading}
            progress={uploadProgress}
            status={uploadStatus}
            filename={filename}
            error={uploadError}
          />
        </div>
      </div>
    );
  }

  if (parsedData) {
    const recommendations = generateRecommendations(parsedData);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <BusinessInsights onUpdateHypothesis={handleHypothesisUpdate} />
          <DataVisualization 
            recommendations={recommendations}
            onSelectVisualization={handleSelectVisualization}
          />
          <HypothesisTracker onHypothesisUpdate={handleHypothesisUpdate} />
          <VisualizationFindings 
            findings={[]}
            onExportFinding={handleExportFinding}
            onShareFinding={handleShareFinding}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Data Detective
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your AI-powered business intelligence companion. Connect your data, ask questions in natural language, 
            and get instant insights with beautiful visualizations.
          </p>
          
          {!user && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-2xl mx-auto">
              <p className="text-blue-800">
                👋 Welcome! You can explore the dashboard and connect data sources. 
                <Button 
                  variant="link" 
                  onClick={() => setActiveTab('auth')} 
                  className="text-blue-600 underline p-0 ml-1"
                >
                  Sign in
                </Button> 
                to save your work and access advanced features.
              </p>
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
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
            <TabsTrigger value="auth" className="flex items-center gap-2">
              {user ? '👤 Account' : '🔐 Sign In'}
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
            <Card>
              <p>Query Builder Content (Coming Soon)</p>
            </Card>
          </TabsContent>

          <TabsContent value="visualize" className="space-y-6">
            <Card>
              <p>Data Visualization Content (Coming Soon)</p>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <p>Business Insights Content (Coming Soon)</p>
            </Card>
          </TabsContent>

          <TabsContent value="auth" className="space-y-6">
            <Card>
              {user ? (
                <>
                  <h3 className="text-lg font-semibold mb-4">Your Account</h3>
                  <p>Email: {user.email}</p>
                  <Button onClick={() => supabase.auth.signOut()} variant="destructive">
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold mb-4">Sign In</h3>
                  <Button onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}>
                    Sign In with Google
                  </Button>
                </>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default QueryBuilder;
