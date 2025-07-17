
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, History, Search, Database, TrendingUp } from 'lucide-react';
import { useAuthState } from '@/hooks/useAuthState';
import DataDetectiveLogo from '@/components/DataDetectiveLogo';
import HelpMenu from '@/components/HelpMenu';

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <DataDetectiveLogo />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
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
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Sign In / Sign Up
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="mb-8">
              <DataDetectiveLogo />
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Uncover insights from your data with{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI-powered analysis
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              Transform raw data into actionable insights with our intelligent data analysis platform. 
              Upload, analyze, and visualize your data with the power of artificial intelligence.
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-4 justify-center mb-20">
              <Button 
                size="lg" 
                onClick={() => navigate('/auth')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-lg"
              >
                Get Started
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/auth')}
                className="px-8 py-4 text-lg rounded-lg"
              >
                Sign In
              </Button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Smart Analysis */}
            <Card className="bg-white border border-gray-100 hover:shadow-md transition-all duration-200">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Smart Analysis
                </h3>
                <p className="text-gray-600">
                  AI-powered insights from your data
                </p>
              </CardContent>
            </Card>

            {/* Multiple Formats */}
            <Card className="bg-white border border-gray-100 hover:shadow-md transition-all duration-200">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Database className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Multiple Formats
                </h3>
                <p className="text-gray-600">
                  CSV, JSON, Excel and more
                </p>
              </CardContent>
            </Card>

            {/* Visual Reports */}
            <Card className="bg-white border border-gray-100 hover:shadow-md transition-all duration-200">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Visual Reports
                </h3>
                <p className="text-gray-600">
                  Interactive charts and dashboards
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
