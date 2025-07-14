
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, TestTube, Settings, BarChart3, Bug } from 'lucide-react';
import AutoE2ETestRunner from '@/components/testing/AutoE2ETestRunner';
import ComprehensiveE2ETestRunner from '@/components/testing/ComprehensiveE2ETestRunner';
import { useAuthState } from '@/hooks/useAuthState';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthState();

  // Simple admin check - you can modify this logic as needed
  const isAdmin = user?.email === 'admin@datadetective.com';

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
              <p className="text-gray-600 mb-6">Please sign in to access the admin panel.</p>
              <Button onClick={() => navigate('/')}>
                Go Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
              <p className="text-gray-600 mb-6">You don't have permission to access the admin panel.</p>
              <Button onClick={() => navigate('/')}>
                Go Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <div className="container mx-auto px-4 py-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Main App
        </Button>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">System administration, testing, and QA tools</p>
        </div>

        <Tabs defaultValue="testing" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="testing" className="flex items-center gap-2">
              <TestTube className="w-4 h-4" />
              Testing
            </TabsTrigger>
            <TabsTrigger value="qa" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              QA Runner
            </TabsTrigger>
            <TabsTrigger value="comprehensive" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              E2E Tests
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Bug className="w-4 h-4" />
              System Health
            </TabsTrigger>
          </TabsList>

          <TabsContent value="testing" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Automated Testing Suite</CardTitle>
                <CardDescription>
                  Run comprehensive end-to-end tests with automatic error resolution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AutoE2ETestRunner />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qa" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>QA Test Runner</CardTitle>
                <CardDescription>
                  Quality assurance testing and validation tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">QA Runner component will be integrated here</p>
                  <Button variant="outline">
                    Launch QA Tests
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comprehensive" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Comprehensive E2E Testing</CardTitle>
                <CardDescription>
                  Advanced end-to-end testing with detailed reporting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ComprehensiveE2ETestRunner />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>System Health Monitor</CardTitle>
                <CardDescription>
                  Monitor application performance and system health
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">System health monitoring tools</p>
                  <Button variant="outline">
                    Run Health Check
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
