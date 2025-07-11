import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BarChart3, TrendingUp, Users, ShoppingCart } from 'lucide-react';

interface AnalysisActionSectionProps {
  researchQuestion: string;
  setResearchQuestion: (question: string) => void;
  parsedData: any;
  onStartAnalysis: () => void;
}

export const AnalysisActionSection: React.FC<AnalysisActionSectionProps> = ({
  researchQuestion,
  parsedData,
  onStartAnalysis
}) => {
  const isReadyForAnalysis = researchQuestion.trim().length > 0 && parsedData;

  const getDataInsights = () => {
    if (!parsedData) return null;

    const insights = [];
    
    // Check for common e-commerce columns
    const columns = parsedData.columns || parsedData.summary?.columns || [];
    const columnNames = Array.isArray(columns) ? columns.map((col: any) => col.name || col).join(', ') : '';
    
    if (columnNames.includes('action') || columnNames.includes('event')) {
      insights.push({ icon: ShoppingCart, text: 'E-commerce events detected', color: 'bg-green-100 text-green-700' });
    }
    
    if (columnNames.includes('user_id') || columnNames.includes('customer_id')) {
      insights.push({ icon: Users, text: 'User tracking available', color: 'bg-blue-100 text-blue-700' });
    }
    
    if (columnNames.includes('timestamp') || columnNames.includes('date')) {
      insights.push({ icon: TrendingUp, text: 'Time-series analysis ready', color: 'bg-purple-100 text-purple-700' });
    }

    if (columnNames.includes('total_order_value') || columnNames.includes('revenue') || columnNames.includes('price')) {
      insights.push({ icon: BarChart3, text: 'Revenue analysis possible', color: 'bg-orange-100 text-orange-700' });
    }

    return insights;
  };

  const dataInsights = getDataInsights();

  const getAnalysisPreview = () => {
    const question = researchQuestion.toLowerCase();
    
    if (question.includes('purchase') || question.includes('buy') || question.includes('revenue')) {
      return 'Purchase behavior, conversion rates, and revenue analysis';
    }
    
    if (question.includes('product') || question.includes('popular')) {
      return 'Product performance, popularity rankings, and profitability metrics';
    }
    
    if (question.includes('user') || question.includes('customer')) {
      return 'User segmentation, lifetime value, and behavioral patterns';
    }
    
    if (question.includes('time') || question.includes('trend')) {
      return 'Time-based trends, seasonal patterns, and peak activity analysis';
    }
    
    return 'Comprehensive data analysis across multiple dimensions';
  };

  return (
    <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-800">
          <BarChart3 className="w-5 h-5" />
          Ready to Investigate
        </CardTitle>
        <CardDescription>
          Your data and research question are set. Let's generate actionable insights.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Data Quality Indicators */}
        {dataInsights && dataInsights.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Data Capabilities Detected:</h4>
            <div className="flex flex-wrap gap-2">
              {dataInsights.map((insight, index) => (
                <Badge key={index} variant="secondary" className={`${insight.color} flex items-center gap-1`}>
                  <insight.icon className="w-3 h-3" />
                  {insight.text}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Analysis Preview */}
        {researchQuestion && (
          <div className="bg-white/50 p-3 rounded-lg border border-indigo-100">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Analysis Preview:</h4>
            <p className="text-sm text-gray-600">{getAnalysisPreview()}</p>
          </div>
        )}

        {/* Dataset Summary */}
        {parsedData && (
          <div className="bg-white/50 p-3 rounded-lg border border-indigo-100">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Dataset Summary:</h4>
            <p className="text-sm text-gray-600">
              {parsedData.summary?.totalRows || parsedData.rows?.length || 0} rows × {' '}
              {parsedData.summary?.totalColumns || parsedData.columns?.length || 0} columns
            </p>
          </div>
        )}

        <Button 
          onClick={onStartAnalysis}
          disabled={!isReadyForAnalysis}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
          size="lg"
        >
          {!parsedData ? (
            "Upload data to continue"
          ) : !researchQuestion.trim() ? (
            "Enter research question to continue"
          ) : (
            <>
              Start Deep Analysis
              <ArrowRight className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>

        {isReadyForAnalysis && (
          <p className="text-xs text-gray-500 text-center">
            This will run comprehensive analysis including all 9 test question categories
          </p>
        )}
      </CardContent>
    </Card>
  );
};
