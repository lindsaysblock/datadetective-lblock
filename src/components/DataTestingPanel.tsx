import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Database, FileJson, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { generateMockUsers, generateMockEvents, generateMockSalesData, generateMockCSVContent } from '../utils/mockDataGenerator';
import { parseRawText } from '../utils/dataParser';

interface TestResult {
  type: 'JSON' | 'CSV' | 'Database';
  success: boolean;
  message: string;
  dataSize?: number;
  columns?: number;
  insights?: string[];
}

const DataTestingPanel: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const runJSONTest = async () => {
    setIsLoading(true);
    try {
      // Generate mock user and event data
      const mockUsers = generateMockUsers(50);
      const mockEvents = generateMockEvents(mockUsers.map(u => u.user_id), 200);
      
      // Test JSON parsing
      const combinedData = [
        ...mockUsers.map(user => ({ ...user, data_type: 'user' })),
        ...mockEvents.map(event => ({ ...event, data_type: 'event' }))
      ];
      
      const jsonString = JSON.stringify(combinedData, null, 2);
      const parsedResult = await parseRawText(jsonString, 'json');
      
      setTestResults(prev => [...prev, {
        type: 'JSON',
        success: true,
        message: 'JSON import successful',
        dataSize: combinedData.length,
        columns: parsedResult.columns.length,
        insights: parsedResult.summary.possibleUserIdColumns && parsedResult.summary.possibleUserIdColumns.length > 0 ? 
          [`Found ${parsedResult.summary.possibleUserIdColumns.length} user ID columns`] : []
      }]);
      
      console.log('JSON Test Result:', parsedResult);
      
    } catch (error) {
      setTestResults(prev => [...prev, {
        type: 'JSON',
        success: false,
        message: `JSON test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }]);
    }
    setIsLoading(false);
  };

  const runCSVTest = async () => {
    setIsLoading(true);
    try {
      // Generate mock CSV data
      const csvContent = generateMockCSVContent();
      const parsedResult = await parseRawText(csvContent, 'csv');
      
      setTestResults(prev => [...prev, {
        type: 'CSV',
        success: true,
        message: 'CSV import successful',
        dataSize: parsedResult.rows.length,
        columns: parsedResult.columns.length,
        insights: [
          `Detected ${parsedResult.columns.filter(c => c.type === 'number').length} numeric columns`,
          `Detected ${parsedResult.columns.filter(c => c.type === 'date').length} date columns`
        ]
      }]);
      
      console.log('CSV Test Result:', parsedResult);
      
    } catch (error) {
      setTestResults(prev => [...prev, {
        type: 'CSV',
        success: false,
        message: `CSV test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }]);
    }
    setIsLoading(false);
  };

  const runDatabaseTest = async () => {
    setIsLoading(true);
    try {
      // Simulate database connection test
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock a successful database response
      const mockDbData = generateMockSalesData(100);
      const mockQueryResult = {
        rows: mockDbData,
        columns: Object.keys(mockDbData[0] || {}).map(key => ({
          name: key,
          type: typeof mockDbData[0]?.[key as keyof typeof mockDbData[0]] === 'number' ? 'number' : 'string',
          samples: []
        }))
      };
      
      setTestResults(prev => [...prev, {
        type: 'Database',
        success: true,
        message: 'Database connection successful',
        dataSize: mockDbData.length,
        columns: mockQueryResult.columns.length,
        insights: ['Successfully connected to mock database', 'Query execution time: 45ms']
      }]);
      
      console.log('Database Test Result:', mockQueryResult);
      
    } catch (error) {
      setTestResults(prev => [...prev, {
        type: 'Database',
        success: false,
        message: `Database test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }]);
    }
    setIsLoading(false);
  };

  const downloadMockData = (type: 'json' | 'csv') => {
    let content: string;
    let filename: string;
    let mimeType: string;

    if (type === 'json') {
      const mockUsers = generateMockUsers(25);
      const mockEvents = generateMockEvents(mockUsers.map(u => u.user_id), 100);
      content = JSON.stringify({ users: mockUsers, events: mockEvents }, null, 2);
      filename = 'mock-user-events.json';
      mimeType = 'application/json';
    } else {
      content = generateMockCSVContent();
      filename = 'mock-sales-data.csv';
      mimeType = 'text/csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Data Import Testing</h2>
        <p className="text-gray-600">Test JSON import, CSV parsing, and database connections with mock data</p>
      </div>

      <Tabs defaultValue="test" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="test">Run Tests</TabsTrigger>
          <TabsTrigger value="download">Download Mock Data</TabsTrigger>
        </TabsList>

        <TabsContent value="test" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="text-center">
                <FileJson className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">JSON Import Test</h3>
                <p className="text-gray-600 mb-4">Test parsing of user and event JSON data</p>
                <Button onClick={runJSONTest} disabled={isLoading} className="w-full">
                  Test JSON Import
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <div className="text-center">
                <FileText className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">CSV Import Test</h3>
                <p className="text-gray-600 mb-4">Test parsing of sales CSV data</p>
                <Button onClick={runCSVTest} disabled={isLoading} className="w-full">
                  Test CSV Import
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <div className="text-center">
                <Database className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Database Test</h3>
                <p className="text-gray-600 mb-4">Test database connection simulation</p>
                <Button onClick={runDatabaseTest} disabled={isLoading} className="w-full">
                  Test Database
                </Button>
              </div>
            </Card>
          </div>

          {testResults.length > 0 && (
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Test Results</h3>
                <Button variant="outline" size="sm" onClick={clearResults}>
                  Clear Results
                </Button>
              </div>
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center gap-3 mb-2">
                      {result.success ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                      <Badge variant="secondary">{result.type}</Badge>
                      <span className={`font-medium ${
                        result.success ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {result.message}
                      </span>
                    </div>
                    {result.success && (
                      <div className="text-sm text-gray-600 ml-8">
                        {result.dataSize && <p>• Data size: {result.dataSize} rows</p>}
                        {result.columns && <p>• Columns: {Array.isArray(result.columns) ? result.columns.map(col => typeof col === 'object' ? col.name : col).join(', ') : result.columns}</p>}
                        {result.insights?.map((insight, i) => (
                          <p key={i}>• {insight}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="download" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="text-center">
                <FileJson className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Sample JSON Data</h3>
                <p className="text-gray-600 mb-4">
                  Download mock user and event data in JSON format for testing
                </p>
                <Button onClick={() => downloadMockData('json')} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download JSON Sample
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Contains 25 users and 100 events
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="text-center">
                <FileText className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Sample CSV Data</h3>
                <p className="text-gray-600 mb-4">
                  Download mock sales data in CSV format for testing
                </p>
                <Button onClick={() => downloadMockData('csv')} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV Sample
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Contains 50 sales records
                </p>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataTestingPanel;
