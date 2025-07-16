
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, TestTube, Settings, Users, Play, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import LegalFooter from '@/components/LegalFooter';
import E2ETestRunner from '@/components/testing/E2ETestRunner';
import NewProjectE2ETestRunner from '@/components/testing/NewProjectE2ETestRunner';
import OptimizedE2ETestRunner from '@/components/testing/OptimizedE2ETestRunner';
import createDataPipelineTestSuite from '@/utils/testing/dataPipelineTestSuite';

const Admin = () => {
  const [pipelineTestResults, setPipelineTestResults] = useState<any[]>([]);
  const [isRunningPipelineTests, setIsRunningPipelineTests] = useState(false);
  const { toast } = useToast();
  
  const runDataPipelineTests = async () => {
    setIsRunningPipelineTests(true);
    setPipelineTestResults([]);
    
    try {
      toast({
        title: "🔬 Testing Data Pipeline",
        description: "Running comprehensive pipeline and analysis tests...",
      });
      
      const testSuite = createDataPipelineTestSuite();
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

          <Tabs defaultValue="testing" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="testing" className="flex items-center gap-2">
                <TestTube className="w-4 h-4" />
                Testing
              </TabsTrigger>
              <TabsTrigger value="pipeline" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Data Pipeline
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
            </TabsList>

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
                <CardContent className="space-y-6">
                  <OptimizedE2ETestRunner />
                  <NewProjectE2ETestRunner />
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
          </Tabs>
        </div>
      </div>
      
      <LegalFooter />
    </div>
  );
};

export default Admin;
