
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AnalysisResultsCardProps {
  analysisResults: any;
}

const AnalysisResultsCard: React.FC<AnalysisResultsCardProps> = ({ analysisResults }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Analysis Results</CardTitle>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Confidence: <span className="font-medium capitalize">{analysisResults?.confidence || 'High'}</span></span>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="insights">Key Insights</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
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
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AnalysisResultsCard;
