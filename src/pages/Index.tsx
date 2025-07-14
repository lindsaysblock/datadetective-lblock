
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Plus, BarChart3, History, Settings, Database, FileUpload } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Analytics Intelligence Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your data into actionable insights with our comprehensive analytics platform.
            Upload, analyze, and discover patterns in your data with AI-powered intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/new-project">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-600" />
                  Start New Analysis
                </CardTitle>
                <CardDescription>
                  Upload your data and begin comprehensive analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-blue-600 font-medium">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/dashboard">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  Analytics Dashboard
                </CardTitle>
                <CardDescription>
                  View real-time insights and analytics results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-green-600 font-medium">
                  View Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/query-history">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5 text-purple-600" />
                  Query History
                </CardTitle>
                <CardDescription>
                  Access previous analyses and results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-purple-600 font-medium">
                  View History
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/admin">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-orange-600" />
                  System Administration
                </CardTitle>
                <CardDescription>
                  Comprehensive testing and pipeline management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-orange-600 font-medium">
                  Admin Panel
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FileUpload className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-medium">Multi-Format Data Upload</h3>
                  <p className="text-sm text-gray-600">Support for CSV, JSON, Excel, and direct data input</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BarChart3 className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-medium">AI-Powered Analytics</h3>
                  <p className="text-sm text-gray-600">Intelligent pattern recognition and insight generation</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Database className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-medium">Comprehensive Testing</h3>
                  <p className="text-sm text-gray-600">Built-in QA, load testing, and pipeline optimization</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Settings className="w-5 h-5 text-orange-600 mt-1" />
                <div>
                  <h3 className="font-medium">System Monitoring</h3>
                  <p className="text-sm text-gray-600">Real-time performance monitoring and optimization</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/new-project">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-5 h-5 mr-2" />
              Start Your First Analysis
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
