
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, FileText, Lightbulb } from 'lucide-react';
import DataDetectiveLogo from '@/components/DataDetectiveLogo';
import Header from '@/components/Header';
import LegalFooter from '@/components/LegalFooter';

const Analysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    const state = location.state;
    console.log('Analysis page loaded with state:', state);

    if (!state || !state.formData) {
      toast({
        title: "No Data Found",
        description: "No analysis data found. Redirecting to new project.",
        variant: "destructive",
      });
      navigate('/new-project');
      return;
    }

    // Simulate analysis process
    const { formData, educationalMode, projectName } = state;
    setAnalysisData({ formData, educationalMode, projectName });

    // Simulate analysis completion after 3 seconds
    const timer = setTimeout(() => {
      setIsAnalyzing(false);
      toast({
        title: "Analysis Complete!",
        description: `Successfully analyzed data for "${projectName}"`,
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [location.state, navigate, toast]);

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analysis...</p>
          </div>
        </div>
        <LegalFooter />
      </div>
    );
  }

  const { formData, educationalMode, projectName } = analysisData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Data Detective Analysis
              </h1>
              <p className="text-blue-600 text-lg">Investigating: {projectName}</p>
            </div>
            
            <DataDetectiveLogo size="sm" showText={false} />
          </div>

          {/* Analysis Status */}
          {isAnalyzing ? (
            <Card className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto mb-6"></div>
                <h2 className="text-2xl font-bold text-purple-800 mb-2">🔍 Analyzing Your Data</h2>
                <p className="text-purple-600 text-lg mb-4">
                  Our AI detective is examining your data for insights...
                </p>
                <p className="text-purple-500">
                  Research Question: "{formData.researchQuestion}"
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Analysis Results */}
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <BarChart3 className="w-6 h-6" />
                    Analysis Complete!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-700 mb-4">
                    Successfully analyzed {formData.parsedData?.length || 0} dataset(s) for insights.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <FileText className="w-8 h-8 text-green-600 mb-2" />
                      <h4 className="font-semibold text-green-800">Data Processed</h4>
                      <p className="text-green-600 text-sm">
                        {formData.processedFiles?.length || 0} files analyzed
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <Lightbulb className="w-8 h-8 text-green-600 mb-2" />
                      <h4 className="font-semibold text-green-800">Insights Found</h4>
                      <p className="text-green-600 text-sm">3 key patterns identified</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <BarChart3 className="w-8 h-8 text-green-600 mb-2" />
                      <h4 className="font-semibold text-green-800">Visualizations</h4>
                      <p className="text-green-600 text-sm">5 charts generated</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Project Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Research Question:</h4>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {formData.researchQuestion}
                    </p>
                  </div>
                  
                  {formData.businessContext && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Business Context:</h4>
                      <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {formData.businessContext}
                      </p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Mode:</h4>
                    <p className="text-gray-600">
                      {educationalMode ? '🎓 Educational Mode' : '💼 Professional Mode'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      
      <LegalFooter />
    </div>
  );
};

export default Analysis;
