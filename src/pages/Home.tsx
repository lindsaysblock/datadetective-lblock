
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, History } from 'lucide-react';
import { useAuthState } from '@/hooks/useAuthState';
import DataDetectiveLogo from '@/components/DataDetectiveLogo';
import HelpMenu from '@/components/HelpMenu';
import { BarChart3, Brain, Database, FileText } from 'lucide-react';

const Home = () => {
  const { user, loading } = useAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
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
              <Link to="/" className="flex items-center gap-2">
                <DataDetectiveLogo size="sm" showText={true} />
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/new-project">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Project
                </Button>
              </Link>
              
              <Link to="/query-history">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Projects
                </Button>
              </Link>

              <HelpMenu />
              
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Sign In / Sign Up
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <DataDetectiveLogo />
          </div>

          <div className="mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Uncover insights from your data with{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI-powered analysis
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform raw data into actionable insights with our intelligent data analysis platform. 
              Upload, analyze, and visualize your data with the power of artificial intelligence.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Get Started
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/auth')}
              >
                Sign In
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
              <CardHeader className="text-center">
                <BarChart3 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-lg">Smart Visualizations</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  AI-generated charts and graphs that reveal hidden patterns in your data
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
              <CardHeader className="text-center">
                <Brain className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-lg">AI Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Automated analysis that discovers trends and anomalies automatically
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-pink-200">
              <CardHeader className="text-center">
                <Database className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                <CardTitle className="text-lg">Multiple Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Connect to databases, upload files, or generate sample datasets
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-green-200">
              <CardHeader className="text-center">
                <FileText className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-lg">Export Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Generate professional reports and share insights with your team
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
