
/**
 * Analysis Results Display Component
 * Refactored to meet coding standards with proper constants and semantic theming
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AnalysisResults } from '@/types/data';
import { TrendingUp, Database, Lightbulb, Target } from 'lucide-react';
import { SPACING } from '@/constants/ui';

interface AnalysisResultsDisplayProps {
  results: AnalysisResults;
  showSQLQuery?: boolean;
}

const AnalysisResultsDisplay: React.FC<AnalysisResultsDisplayProps> = ({ 
  results, 
  showSQLQuery = false 
}) => {
  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`space-y-${SPACING.LG}`}>
      {/* Analysis Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className={`flex items-center gap-${SPACING.SM}`}>
              <TrendingUp className={`w-5 h-5 text-blue-600`} />
              Analysis Overview
            </CardTitle>
            <Badge className={getConfidenceColor(results.confidence)}>
              {results.confidence} confidence
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-${SPACING.MD}`}>
            <div className={`text-center p-${SPACING.MD} bg-blue-50 rounded-lg`}>
              <div className="text-2xl font-bold text-blue-600">
                {results.detailedResults?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Analysis Results</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Array.isArray(results.insights) ? results.insights.length : results.insights.split('\n\n').length}
              </div>
              <div className="text-sm text-gray-600">Key Insights</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {results.recommendations?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Recommendations</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {results.insights}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      {results.detailedResults && results.detailedResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              Detailed Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.detailedResults.map((result, index) => (
                <div key={result.id || index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-lg">{result.title}</h4>
                    <Badge className={getConfidenceColor(result.confidence)}>
                      {result.confidence}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-2">{result.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Value:</span>
                    <span className="text-blue-600 font-mono">{String(result.value)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {results.recommendations && results.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {results.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* SQL Query */}
      {showSQLQuery && results.sqlQuery && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-gray-600" />
              Generated SQL Query
            </CardTitle>
            <CardDescription>
              Query used for this analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{results.sqlQuery}</code>
            </pre>
            
            {results.queryBreakdown && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Query Breakdown:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {results.queryBreakdown.steps.map((step, index) => (
                    <li key={index}>• {step.description}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalysisResultsDisplay;
