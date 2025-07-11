
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Settings, TestTube, Play } from 'lucide-react';
import QARunner from '../QARunner';
import AutoRefactorPrompts from '../AutoRefactorPrompts';
import LoadTestRunner from '../LoadTestRunner';
import FinalQARunner from '../FinalQARunner';

const AdminDashboard: React.FC = () => {
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
          <Tabs defaultValue="qa" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="qa" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Quality Assurance
              </TabsTrigger>
              <TabsTrigger value="load-testing" className="flex items-center gap-2">
                <TestTube className="w-4 h-4" />
                Load Testing
              </TabsTrigger>
              <TabsTrigger value="final-qa" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Final QA & Compliance
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

            <TabsContent value="final-qa" className="mt-6">
              <FinalQARunner />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
