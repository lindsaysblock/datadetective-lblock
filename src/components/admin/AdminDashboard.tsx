
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Settings, TestTube, Play, Bug, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QARunner from '../QARunner';
import AutoRefactorPrompts from '../AutoRefactorPrompts';
import LoadTestRunner from '../LoadTestRunner';
import FinalQARunner from '../FinalQARunner';
import E2ETestRunner from '../testing/E2ETestRunner';
import DiagnosticTestRunner from '../testing/DiagnosticTestRunner';
import { forceRefresh } from '../../utils/forceRefresh';
import { emergencyStateReset, removeMaintenanceMessages } from '../../utils/emergencyStateReset';

const AdminDashboard: React.FC = () => {
  useEffect(() => {
    // Force refresh components on mount to clear any cached disabled states
    forceRefresh();
    
    // Remove any maintenance messages immediately
    removeMaintenanceMessages();
    
    // Set up continuous monitoring
    const interval = setInterval(removeMaintenanceMessages, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b">
          <CardTitle className="flex items-center gap-2 text-red-800">
            <Shield className="w-6 h-6" />
            Admin Dashboard
          </CardTitle>
          <CardDescription className="text-red-600">
            Development and QA tools for system monitoring and testing
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="e2e-testing" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="qa" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Quality Assurance
                <span className="ml-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
              </TabsTrigger>
              <TabsTrigger value="load-testing" className="flex items-center gap-2">
                <TestTube className="w-4 h-4" />
                Load Testing
                <span className="ml-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
              </TabsTrigger>
              <TabsTrigger value="e2e-testing" className="flex items-center gap-2">
                <Bug className="w-4 h-4" />
                E2E Testing
                <span className="ml-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
              </TabsTrigger>
              <TabsTrigger value="final-qa" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Final QA & Compliance
              </TabsTrigger>
              <TabsTrigger value="emergency" className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-4 h-4" />
                Emergency Reset
              </TabsTrigger>
            </TabsList>

            <TabsContent value="qa" className="mt-6">
              <div className="space-y-6">
                <QARunner />
                <AutoRefactorPrompts />
              </div>
            </TabsContent>

            <TabsContent value="load-testing" className="mt-6">
              <LoadTestRunner />
            </TabsContent>

            <TabsContent value="e2e-testing" className="mt-6">
              <div className="space-y-6">
                <DiagnosticTestRunner />
                <E2ETestRunner />
              </div>
            </TabsContent>

            <TabsContent value="final-qa" className="mt-6">
              <FinalQARunner />
            </TabsContent>

            <TabsContent value="emergency" className="mt-6">
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Emergency System Reset
                  </CardTitle>
                  <CardDescription>
                    Nuclear option to completely reset application state and clear all maintenance messages
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-800 mb-2">⚠️ Warning</h3>
                    <p className="text-red-700 text-sm">
                      This will clear ALL application data, caches, and force a complete reload. 
                      Only use if you're seeing persistent maintenance messages.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      onClick={removeMaintenanceMessages}
                      variant="outline"
                      className="w-full"
                    >
                      🔧 Remove Maintenance Messages Only
                    </Button>
                    
                    <Button 
                      onClick={emergencyStateReset}
                      variant="destructive"
                      className="w-full"
                    >
                      🚨 EMERGENCY RESET (Nuclear Option)
                    </Button>
                  </div>
                  
                  <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                    <strong>What this does:</strong><br/>
                    • Clears localStorage & sessionStorage<br/>
                    • Resets component cache<br/>
                    • Removes all maintenance messages<br/>
                    • Forces complete page reload
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
