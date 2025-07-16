
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, TestTube, Settings, Users } from 'lucide-react';
import Header from '@/components/Header';
import LegalFooter from '@/components/LegalFooter';
import E2ETestRunner from '@/components/testing/E2ETestRunner';
import NewProjectE2ETestRunner from '@/components/testing/NewProjectE2ETestRunner';

const Admin = () => {
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="testing" className="flex items-center gap-2">
                <TestTube className="w-4 h-4" />
                Testing
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
                  <NewProjectE2ETestRunner />
                  <E2ETestRunner />
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
