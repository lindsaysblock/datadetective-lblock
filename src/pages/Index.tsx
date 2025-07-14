
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, BarChart3, Shield, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import DataDetectiveLogo from '@/components/DataDetectiveLogo';
import HelpMenu from '@/components/HelpMenu';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  React.useEffect(() => {
    if (user && !isLoading) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  const features = [
    {
      icon: Upload,
      title: 'Easy Data Upload',
      description: 'Upload CSV files and connect your data sources with our intuitive interface designed for business users.'
    },
    {
      icon: BarChart3,
      title: 'Smart Analytics',
      description: 'AI-powered analysis that automatically identifies patterns and insights in plain English for business decisions.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your business data is encrypted and processed securely with enterprise-grade security standards.'
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get actionable business insights in minutes, not hours. Perfect for executives and analysts alike.'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <DataDetectiveLogo />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <DataDetectiveLogo size="sm" showText={true} />
            </div>

            <div className="flex items-center gap-3">
              <HelpMenu />
              
              <Button 
                onClick={() => navigate('/auth')}
                variant="outline"
                size="sm"
              >
                Sign In
              </Button>
              
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                size="sm"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="mb-8">
            <DataDetectiveLogo />
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Transform Your Data Into
            <span className="text-blue-600 block">Actionable Business Insights</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Empower your business decisions with AI-powered data analysis. Upload your data, 
            ask questions in plain English, and get clear insights that drive results.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              Start Analyzing Data
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="px-8 py-3"
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <feature.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How Data Detective Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold">Upload Your Business Data</h3>
              <p className="text-gray-600">
                Upload CSV files, Excel spreadsheets, or connect to your data sources. 
                We handle the technical complexity for you.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold">Ask Business Questions</h3>
              <p className="text-gray-600">
                Ask questions about your data in plain English. "What are our top-performing products?" 
                "Which regions need attention?"
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold">Get Clear Insights</h3>
              <p className="text-gray-600">
                Receive AI-powered analysis with clear visualizations and actionable 
                recommendations you can act on immediately.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Unlock Your Data's Potential?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of business professionals who trust Data Detective for their data analysis needs.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
          >
            Get Started Today
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
