
/**
 * Enhanced Question-Answer Component
 * Universal component that handles any data source and file type using OpenAI
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Brain, Loader2, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react';
import { EnhancedAnalysisEngine, type EnhancedAnalysisContext, type EnhancedAnalysisResult } from '@/services/enhancedAnalysisEngine';
import { MultiProviderApiKeyModal } from './MultiProviderApiKeyModal';
import { useToast } from '@/hooks/use-toast';
import { ParsedData } from '@/utils/dataParser';

interface UniversalQAComponentProps {
  data?: ParsedData | ParsedData[];
  files?: File[];
  databaseTables?: string[];
  userId?: string;
  className?: string;
}

export const UniversalQAComponent: React.FC<UniversalQAComponentProps> = ({
  data,
  files,
  databaseTables,
  userId,
  className = ''
}) => {
  const [question, setQuestion] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<EnhancedAnalysisResult | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [engine] = useState(() => new EnhancedAnalysisEngine());
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!question.trim()) {
      toast({
        title: "Question Required",
        description: "Please enter a question to analyze your data.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const context: EnhancedAnalysisContext = {
        question: question.trim(),
        files,
        parsedData: data ? (Array.isArray(data) ? data : [data]) : undefined,
        databaseTables,
        userId
      };

      const analysisResult = await engine.analyzeWithQuestion(context);

      if (analysisResult.requiresApiKey) {
        setShowApiKeyModal(true);
        return;
      }

      setResult(analysisResult);

      if (analysisResult.success) {
        toast({
          title: "Analysis Complete! 🎉",
          description: "Your question has been analyzed using OpenAI GPT.",
        });
      } else {
        toast({
          title: "Analysis Failed",
          description: analysisResult.error || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Error",
        description: "An unexpected error occurred during analysis.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApiKeySubmit = (apiKey: string) => {
    engine.setOpenAIApiKey(apiKey);
    toast({
      title: "OpenAI API Key Configured",
      description: "GPT integration is now active. Try your analysis again!",
    });
    
    // Automatically retry the analysis
    setTimeout(() => {
      handleAnalyze();
    }, 500);
  };

  const getDataSourceInfo = () => {
    const sources: string[] = [];
    let totalRecords = 0;
    let fileTypes: string[] = [];

    if (data) {
      const dataArray = Array.isArray(data) ? data : [data];
      totalRecords += dataArray.reduce((sum, d) => sum + d.rowCount, 0);
      sources.push('Uploaded Files');
    }

    if (files && files.length > 0) {
      sources.push(`${files.length} File(s)`);
      fileTypes = files.map(f => f.name.split('.').pop()?.toUpperCase() || 'Unknown');
    }

    if (databaseTables && databaseTables.length > 0) {
      sources.push('Database');
    }

    return { sources, totalRecords, fileTypes };
  };

  const dataSourceInfo = getDataSourceInfo();

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Ask Questions About Your Data
            <Badge variant="outline" className="ml-auto text-xs">
              Powered by OpenAI
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Data Source Info */}
          <Alert>
            <AlertDescription>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">Data Sources:</span>
                {dataSourceInfo.sources.map((source, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {source}
                  </Badge>
                ))}
                {dataSourceInfo.fileTypes.length > 0 && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      Types: {dataSourceInfo.fileTypes.join(', ')}
                    </span>
                  </>
                )}
                {dataSourceInfo.totalRecords > 0 && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      {dataSourceInfo.totalRecords.toLocaleString()} records
                    </span>
                  </>
                )}
              </div>
            </AlertDescription>
          </Alert>

          {/* Question Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Research Question</label>
            <Textarea
              placeholder="Ask anything about your data... For example:
• What are the main trends in my data?
• Which factors drive the highest performance?
• Are there any patterns or anomalies I should know about?
• How do different segments compare?
• What insights can help improve my business?
• Can you identify any correlations in the data?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Analyze Button */}
          <Button
            onClick={handleAnalyze}
            disabled={!question.trim() || isAnalyzing || (!data && !files && !databaseTables)}
            className="w-full"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing with OpenAI GPT...
              </>
            ) : (
              <>
                <MessageSquare className="w-4 h-4 mr-2" />
                Analyze with AI
              </>
            )}
          </Button>

          {/* No Data Warning */}
          {!data && !files && !databaseTables && (
            <Alert>
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                No data sources available. Upload files or connect database tables to start analyzing.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-500" />
              )}
              AI Analysis Results
              {result.confidence && (
                <Badge variant="outline" className="ml-auto">
                  {Math.round(result.confidence * 100)}% confidence
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.success ? (
              <>
                {/* Main Answer */}
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Brain className="w-4 h-4 text-primary" />
                    Answer:
                  </h4>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="whitespace-pre-wrap">{result.answer}</p>
                  </div>
                </div>

                {/* Insights */}
                {result.insights && result.insights.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold">Key Insights:</h4>
                    <ul className="space-y-1">
                      {result.insights.map((insight, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-primary mt-1">•</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {result.recommendations && result.recommendations.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold">Recommendations:</h4>
                    <ul className="space-y-1">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-green-500 mt-1">→</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* SQL Queries */}
                {result.sqlQueries && result.sqlQueries.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold">Generated SQL Queries:</h4>
                    <div className="space-y-2">
                      {result.sqlQueries.map((query, index) => (
                        <pre key={index} className="p-3 bg-gray-900 text-green-400 text-xs rounded-lg overflow-x-auto">
                          {query}
                        </pre>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Alert variant="destructive">
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>
                  {result.error || 'Analysis failed for unknown reason'}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* API Key Modal */}
      <MultiProviderApiKeyModal
        open={showApiKeyModal}
        onOpenChange={setShowApiKeyModal}
        onSuccess={() => {
          toast({
            title: "AI Providers Configured",
            description: "Multi-AI integration is now active. Try your analysis again!",
          });
          setTimeout(() => handleAnalyze(), 500);
        }}
      />
    </div>
  );
};
