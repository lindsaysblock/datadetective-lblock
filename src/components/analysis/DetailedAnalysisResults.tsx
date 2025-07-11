
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { AnalysisResult } from '../../utils/analysis/dataAnalysisEngine';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface DetailedAnalysisResultsProps {
  results: AnalysisResult[];
}

const DetailedAnalysisResults: React.FC<DetailedAnalysisResultsProps> = ({ results }) => {
  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const renderChart = (result: AnalysisResult) => {
    if (!result.chartData || result.chartData.length === 0) {
      return (
        <div className="h-48 flex items-center justify-center text-gray-500">
          <p>No chart data available</p>
        </div>
      );
    }

    switch (result.chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={result.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={result.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={200}>
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
                  <th className="text-left p-2">Metric</th>
                  <th className="text-right p-2">Value</th>
                </tr>
              </thead>
              <tbody>
                {result.chartData.map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{row.name}</td>
                    <td className="p-2 text-right">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      
      default:
        return (
          <div className="h-48 flex items-center justify-center text-gray-500">
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
        <CardContent className="p-6">
          <p className="text-center text-gray-500">No detailed analysis results available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>📊 Detailed Analysis Results</CardTitle>
        <p className="text-sm text-gray-600">
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
            <TabsContent key={category} value={category} className="mt-4">
              <div className="space-y-6">
                {categoryResults.map((result, index) => (
                  <Card key={result.id} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{result.title}</CardTitle>
                        <Badge className={getConfidenceColor(result.confidence)}>
                          {result.confidence} confidence
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{result.description}</p>
                    </CardHeader>
                    <CardContent>
                      {result.chartData && result.chartType && (
                        <div className="mb-4">
                          {renderChart(result)}
                        </div>
                      )}
                      
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-1">💡 Key Insight:</h4>
                        <p className="text-sm text-blue-700">{result.insight}</p>
                      </div>
                      
                      {typeof result.value === 'object' && result.value !== null && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-800 mb-1">📈 Raw Data:</h4>
                          <pre className="text-xs text-gray-600 overflow-x-auto">
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
