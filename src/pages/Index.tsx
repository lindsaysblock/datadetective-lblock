
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, BarChart3, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const features = [
    {
      icon: Upload,
      title: 'Easy Data Upload',
      description: 'Upload CSV files and connect your data sources with our intuitive interface.'
    },
    {
      icon: BarChart3,
      title: 'Smart Analytics',
      description: 'AI-powered analysis that automatically identifies patterns and insights in your data.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and processed securely with enterprise-grade security.'
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get actionable insights in minutes, not hours. Perfect for data-driven decisions.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Transform Your Data Into
            <span className="text-blue-600 block">Actionable Insights</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Upload your data, ask questions in plain English, and get AI-powered analysis 
            with interactive visualizations and detailed explanations.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/new-project">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                Start Analyzing Data
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="lg" className="px-8 py-3">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <feature.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold">Upload Your Data</h3>
              <p className="text-gray-600">
                Upload CSV files or connect to your data sources. We handle the rest.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold">Ask Questions</h3>
              <p className="text-gray-600">
                Ask questions about your data in plain English. No SQL knowledge required.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold">Get Insights</h3>
              <p className="text-gray-600">
                Receive AI-powered analysis with visualizations and actionable recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
