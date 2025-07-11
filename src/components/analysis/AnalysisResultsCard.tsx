
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface AnalysisResultsCardProps {
  analysisResults: any;
}

const AnalysisResultsCard: React.FC<AnalysisResultsCardProps> = ({ analysisResults }) => {
  console.log('AnalysisResultsCard received:', analysisResults);

  const getConfidenceColor = (confidence: string) => {
    switch (confidence?.toLowerCase()) {
      case 'high': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const hasDetailedResults = analysisResults?.detailedResults && analysisResults.detailedResults.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center justify-between">
          Analysis Results
          <Badge variant="secondary" className={getConfidenceColor(analysisResults?.confidence)}>
            {analysisResults?.confidence || 'Medium'} Confidence
          </Badge>
        </CardTitle>
        {hasDetailedResults && (
          <div className="text-sm text-gray-600">
            Generated {analysisResults.detailedResults.length} detailed insights
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="insights">Key Insights</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="insights" className="mt-4">
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {analysisResults?.insights || 'Based on your research question and data analysis, here are the key findings from your dataset. The analysis reveals several important patterns and trends that can help inform your decision-making process.'}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="recommendations" className="mt-4">
            <ul className="space-y-3">
              {analysisResults?.recommendations?.map((rec: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{rec}</span>
                </li>
              )) || (
                <>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">Consider implementing A/B testing for better insights</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">Focus on user engagement metrics to drive growth</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">Optimize data collection processes for better accuracy</span>
                  </li>
                </>
              )}
            </ul>
          </TabsContent>

          <TabsContent value="detailed" className="mt-4">
            {hasDetailedResults ? (
              <div className="space-y-4">
                {analysisResults.detailedResults.map((result: any, index: number) => (
                  <div key={result.id || index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">{result.title}</h4>
                      <Badge variant="secondary" className={getConfidenceColor(result.confidence)}>
                        {result.confidence}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{result.description}</p>
                    {result.value !== undefined && (
                      <div className="text-lg font-bold text-blue-600 mb-2">
                        {typeof result.value === 'number' ? result.value.toLocaleString() : result.value}
                      </div>
                    )}
                    <p className="text-sm text-gray-700">{result.insight}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No detailed analysis results available.</p>
                <p className="text-sm mt-2">Run a new analysis to see comprehensive results.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AnalysisResultsCard;
