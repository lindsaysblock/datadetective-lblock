
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { AnalysisResults } from '@/types/data';

interface AnalysisResultsDisplayProps {
  results: AnalysisResults;
  showSQLQuery?: boolean;
}

const AnalysisResultsDisplay: React.FC<AnalysisResultsDisplayProps> = ({ 
  results, 
  showSQLQuery = false 
}) => {
  const getConfidenceIcon = (confidence: string) => {
    switch (confidence?.toLowerCase()) {
      case 'high': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'medium': return <TrendingUp className="w-4 h-4 text-yellow-600" />;
      case 'low': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <TrendingUp className="w-4 h-4 text-gray-600" />;
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence?.toLowerCase()) {
      case 'high': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Analysis Results</CardTitle>
          <Badge variant="outline" className={`${getConfidenceColor(results.confidence)} flex items-center gap-1`}>
            {getConfidenceIcon(results.confidence)}
            {results.confidence || 'Medium'} Confidence
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="insights">Key Insights</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="details">Detailed Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="insights" className="mt-4">
            <div className="prose prose-sm max-w-none">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                  {results.insights}
                </pre>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="recommendations" className="mt-4">
            <div className="space-y-3">
              {results.recommendations?.map((rec, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{rec}</span>
                </div>
              )) || (
                <p className="text-gray-500 text-center py-4">No specific recommendations available</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="details" className="mt-4">
            {results.detailedResults && results.detailedResults.length > 0 ? (
              <div className="space-y-4">
                {results.detailedResults.map((result, index) => (
                  <Card key={result.id || index} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{result.title}</CardTitle>
                        <Badge variant="outline" className={getConfidenceColor(result.confidence)}>
                          {result.confidence}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{result.description}</p>
                    </CardHeader>
                    <CardContent>
                      {result.value !== undefined && (
                        <div className="mb-2 p-2 bg-gray-50 rounded">
                          <span className="text-lg font-semibold text-blue-600">
                            {typeof result.value === 'number' ? result.value.toLocaleString() : String(result.value)}
                          </span>
                        </div>
                      )}
                      <p className="text-sm text-gray-700">{result.insight}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No detailed results available</p>
                <p className="text-sm mt-1">Upload data to see comprehensive analysis</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {showSQLQuery && results.sqlQuery && (
          <div className="mt-6 p-4 bg-gray-900 rounded-lg">
            <h4 className="text-white font-medium mb-2">Generated SQL Query</h4>
            <pre className="text-green-400 text-sm overflow-x-auto">
              <code>{results.sqlQuery}</code>
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalysisResultsDisplay;
