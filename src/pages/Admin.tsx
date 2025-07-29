
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, TestTube, Settings, Users, Play, Activity, Bug } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import LegalFooter from '@/components/LegalFooter';
import E2ETestRunner from '@/components/testing/E2ETestRunner';
import OptimizedQARunner from '@/components/testing/OptimizedQARunner';
import DiskIOBandwidthTest from '@/components/testing/DiskIOBandwidthTest';
import createEnhancedDataPipelineTestSuite from '@/utils/testing/enhancedDataPipelineTestSuite';

const Admin = () => {
  const [pipelineTestResults, setPipelineTestResults] = useState<any[]>([]);
  const [isRunningPipelineTests, setIsRunningPipelineTests] = useState(false);
  const [debugResults, setDebugResults] = useState<any[]>([]);
  const { toast } = useToast();
  
  const runDataPipelineTests = async () => {
    setIsRunningPipelineTests(true);
    setPipelineTestResults([]);
    
    try {
      toast({
        title: "🔬 Testing Data Pipeline",
        description: "Running comprehensive pipeline and analysis tests...",
      });
      
      const testSuite = createEnhancedDataPipelineTestSuite();
      const results = await testSuite.runAllTests();
      
      setPipelineTestResults(results);
      
      const passed = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      toast({
        title: "🔬 Pipeline Tests Complete",
        description: `${passed} passed, ${failed} failed`,
        variant: failed > 0 ? "destructive" : "default",
      });
    } catch (error) {
      toast({
        title: "Pipeline Test Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    } finally {
      setIsRunningPipelineTests(false);
    }
  };

  const testDataValidation = () => {
    // Data validation test logic from DataValidationDebug
    const parsedData = [
      {
        "id": "Sample_Behavior_Data_with_Commerce_Purchases.csv-1752694579685-0",
        "name": "Sample_Behavior_Data_with_Commerce_Purchases.csv",
        "rows": [
          {
            "timestamp": "2025-07-01 05:45:34.664282",
            "session_id": "5b8d89b1-8769-4e69-a2b0-7051d0e811c1",
            "user_id": "7f8c156e-4142-4807-bf08-b09a69493672",
            "user_type": "logged_in",
            "product_id": "e18b7971-87ca-4c99-bcf2-5efcda680e62",
            "category": "Category_7",
            "action": "view",
            "price": "196.73",
            "cost": "116.66",
            "quantity": "",
            "discount": "0.0",
            "shipping_cost": "0.0",
            "payment_method": "",
            "total_order_value": "0.0",
            "time_spent_sec": "119.79"
          }
        ],
        "columns": [
          {
            "name": "timestamp",
            "type": "date",
            "samples": ["2025-07-01 05:45:34.664282"]
          },
          {
            "name": "session_id", 
            "type": "string",
            "samples": ["5b8d89b1-8769-4e69-a2b0-7051d0e811c1"]
          }
        ],
        "rowCount": 10,
        "summary": {
          "totalRows": 10,
          "totalColumns": 15
        }
      }
    ];

    console.log('🔍 Testing validation with actual data structure:', parsedData);
    
    const validationResults = parsedData.map((data, index) => {
      const hasData = !!data;
      const hasRowCount = data?.rowCount > 0;
      const hasRows = data?.rows && data?.rows.length > 0;
      const hasColumns = !!data?.columns;
      const isColumnsArray = Array.isArray(data?.columns);
      const hasColumnsLength = data?.columns?.length > 0;
      
      const rowCondition = hasRowCount || hasRows;
      const columnCondition = hasColumns && isColumnsArray && hasColumnsLength;
      const finalResult = hasData && rowCondition && columnCondition;
      
      return {
        index,
        hasData,
        hasRowCount,
        hasRows,
        hasColumns,
        isColumnsArray,
        hasColumnsLength,
        rowCondition,
        columnCondition,
        finalResult,
        data: data
      };
    });

    console.log('🔍 Validation results:', validationResults);
    
    const hasValidData = parsedData.some(data => 
      data && 
      (data.rowCount > 0 || (data.rows && data.rows.length > 0)) && 
      data.columns && 
      Array.isArray(data.columns) && 
      data.columns.length > 0
    );
    
    console.log('🔍 Final hasValidData result:', hasValidData);
    
    setDebugResults(validationResults);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
              <Shield className="w-10 h-10 text-purple-600" />
              Admin Dashboard
            </h1>
            <p className="text-xl text-gray-600">
              System administration and testing tools
            </p>
          </div>

          <Tabs defaultValue="optimized" className="space-y-6">
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="optimized" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Optimized QA
              </TabsTrigger>
              <TabsTrigger value="testing" className="flex items-center gap-2">
                <TestTube className="w-4 h-4" />
                Testing
              </TabsTrigger>
              <TabsTrigger value="pipeline" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Data Pipeline
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="debug" className="flex items-center gap-2">
                <Bug className="w-4 h-4" />
                Debug
              </TabsTrigger>
            </TabsList>

            <TabsContent value="optimized" className="space-y-6">
              <OptimizedQARunner />
            </TabsContent>

            <TabsContent value="testing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TestTube className="w-5 h-5" />
                    E2E Testing Suite
                  </CardTitle>
                  <CardDescription>
                    Comprehensive end-to-end testing for all application flows
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <E2ETestRunner />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pipeline" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Data Detective E2E Pipeline Test Suite
                  </CardTitle>
                  <CardDescription>
                    Comprehensive testing of the entire data pipeline from upload to analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={runDataPipelineTests}
                    disabled={isRunningPipelineTests}
                    className="w-full"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isRunningPipelineTests ? 'Running Tests...' : 'Run Data Detective E2E Pipeline Tests'}
                  </Button>
                  
                  {pipelineTestResults.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold">Test Results:</h3>
                      {pipelineTestResults.map((result, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded border ${
                            result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{result.testName}</span>
                            <Badge variant={result.success ? 'default' : 'destructive'}>
                              {result.success ? 'PASS' : 'FAIL'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                          {result.error && (
                            <p className="text-sm text-red-600 mt-1">Error: {result.error}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <DiskIOBandwidthTest />
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user accounts and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">User management features coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>Configure application settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">System settings coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>System Analytics</CardTitle>
                  <CardDescription>View system performance and usage analytics</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Analytics dashboard coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="debug" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bug className="w-5 h-5" />
                    Data Validation Debug
                  </CardTitle>
                  <CardDescription>Test and debug data validation logic</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={testDataValidation} className="mb-4">
                    Test Validation Logic
                  </Button>
                  
                  {debugResults.length > 0 && (
                    <div className="space-y-4">
                      {debugResults.map((result, index) => (
                        <div key={index} className="bg-muted p-4 rounded-lg">
                          <h3 className="font-semibold mb-2">Data Item {index}:</h3>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>Has Data: {result.hasData ? '✅' : '❌'}</div>
                            <div>Has Row Count: {result.hasRowCount ? '✅' : '❌'}</div>
                            <div>Has Rows: {result.hasRows ? '✅' : '❌'}</div>
                            <div>Has Columns: {result.hasColumns ? '✅' : '❌'}</div>
                            <div>Is Columns Array: {result.isColumnsArray ? '✅' : '❌'}</div>
                            <div>Has Columns Length: {result.hasColumnsLength ? '✅' : '❌'}</div>
                            <div>Row Condition: {result.rowCondition ? '✅' : '❌'}</div>
                            <div>Column Condition: {result.columnCondition ? '✅' : '❌'}</div>
                            <div className="col-span-2 font-bold">
                              Final Result: {result.finalResult ? '✅ VALID' : '❌ INVALID'}
                            </div>
                          </div>
                          <details className="mt-2">
                            <summary className="cursor-pointer">View Raw Data</summary>
                            <pre className="mt-2 text-xs bg-background p-2 rounded overflow-auto">
                              {JSON.stringify(result.data, null, 2)}
                            </pre>
                          </details>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <LegalFooter />
    </div>
  );
};

export default Admin;
