
/**
 * Detailed Analysis Results Component
 * Refactored to meet coding standards with proper constants and semantic styling
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { AnalysisResult } from '../../utils/analysis/dataAnalysisEngine';
import { SPACING, TEXT_SIZES, CHART_HEIGHTS } from '@/constants/ui';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface DetailedAnalysisResultsProps {
  results: AnalysisResult[];
}

const DetailedAnalysisResults: React.FC<DetailedAnalysisResultsProps> = ({ results }) => {
  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-success/20 text-success';
      case 'medium': return 'bg-warning/20 text-warning';
      case 'low': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const renderChart = (result: AnalysisResult) => {
    if (!result.chartData || result.chartData.length === 0) {
      return (
        <div className={`h-${CHART_HEIGHTS.MEDIUM} flex items-center justify-center text-muted-foreground`}>
          <p>No chart data available</p>
        </div>
      );
    }

    switch (result.chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={CHART_HEIGHTS.MEDIUM}>
            <BarChart data={result.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={CHART_HEIGHTS.MEDIUM}>
            <LineChart data={result.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={CHART_HEIGHTS.MEDIUM}>
            <PieChart>
              <Pie
                data={result.chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percentage }) => `${name}: ${percentage}%`}
              >
                {result.chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'table':
        return (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className={`text-left p-${SPACING.SM}`}>Metric</th>
                    <th className={`text-right p-${SPACING.SM}`}>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {result.chartData.map((row, index) => (
                    <tr key={index} className="border-b">
                      <td className={`p-${SPACING.SM}`}>{row.name}</td>
                      <td className={`p-${SPACING.SM} text-right`}>{row.value}</td>
                    </tr>
                  ))}
                </tbody>
            </table>
          </div>
        );
      
      default:
        return (
          <div className={`h-${CHART_HEIGHTS.MEDIUM} flex items-center justify-center text-muted-foreground`}>
            <p>Chart type not supported</p>
          </div>
        );
    }
  };

  const categoryResults = results.reduce((acc, result) => {
    // Categorize results based on their IDs
    let category = 'Other';
    
    if (result.id.includes('row') || result.id.includes('count') || result.id.includes('user') || result.id.includes('purchase')) {
      category = 'Counts & Keys';
    } else if (result.id.includes('action') || result.id.includes('authentication')) {
      category = 'Action Breakdown';
    } else if (result.id.includes('time') || result.id.includes('date') || result.id.includes('hour')) {
      category = 'Time Trends';
    } else if (result.id.includes('product') || result.id.includes('profit')) {
      category = 'Product Analysis';
    }
    
    if (!acc[category]) acc[category] = [];
    acc[category].push(result);
    return acc;
  }, {} as Record<string, AnalysisResult[]>);

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className={`p-${SPACING.LG}`}>
          <p className="text-center text-muted-foreground">No detailed analysis results available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>📊 Detailed Analysis Results</CardTitle>
        <p className={`${TEXT_SIZES.SMALL} text-muted-foreground`}>
          Comprehensive analysis across {results.length} metrics
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={Object.keys(categoryResults)[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {Object.keys(categoryResults).map(category => (
              <TabsTrigger key={category} value={category} className="text-xs">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {Object.entries(categoryResults).map(([category, categoryResults]) => (
            <TabsContent key={category} value={category} className={`mt-${SPACING.MD}`}>
              <div className={`space-y-${SPACING.LG}`}>
                {categoryResults.map((result, index) => (
                  <Card key={result.id} className="border-l-4 border-l-primary">
                    <CardHeader className={`pb-${SPACING.SM}`}>
                      <div className="flex items-center justify-between">
                        <CardTitle className={TEXT_SIZES.LARGE}>{result.title}</CardTitle>
                        <Badge className={getConfidenceColor(result.confidence)}>
                          {result.confidence} confidence
                        </Badge>
                      </div>
                      <p className={`${TEXT_SIZES.SMALL} text-muted-foreground`}>{result.description}</p>
                    </CardHeader>
                    <CardContent>
                      {result.chartData && result.chartType && (
                        <div className={`mb-${SPACING.MD}`}>
                          {renderChart(result)}
                        </div>
                      )}
                      
                      <div className={`bg-primary/10 p-${SPACING.SM} rounded-lg`}>
                        <h4 className="font-medium text-primary mb-1">💡 Key Insight:</h4>
                        <p className={`${TEXT_SIZES.SMALL} text-primary/80`}>{result.insight}</p>
                      </div>
                      
                      {typeof result.value === 'object' && result.value !== null && (
                        <div className={`mt-${SPACING.SM} p-${SPACING.SM} bg-muted rounded-lg`}>
                          <h4 className="font-medium text-foreground mb-1">📈 Raw Data:</h4>
                          <pre className={`${TEXT_SIZES.SMALL} text-muted-foreground overflow-x-auto`}>
                            {JSON.stringify(result.value, null, 2)}
                          </pre>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DetailedAnalysisResults;
