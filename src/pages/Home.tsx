
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Database, BarChart3, Brain, Users, Shield, ArrowRight, Upload, Search, TrendingUp } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur border-b border-blue-200 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Data Explorer
              </h1>
              <p className="text-blue-600 text-lg">Discover validated insights from your user behavior data</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Turn Your Data Into Actionable Insights
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Your personal data detective that helps you understand user behaviors with AI-powered analysis, 
            statistical validation, and beautiful visualizations.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-8 py-4 text-lg shadow-lg">
                <Sparkles className="w-6 h-6 mr-2" />
                Start Exploring
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50 px-8 py-4 text-lg shadow-lg">
              <ArrowRight className="w-6 h-6 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="p-3 bg-blue-100 rounded-lg w-fit mb-3">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Connect Any Data Source</CardTitle>
              <CardDescription>
                Upload CSV files, connect databases, or integrate with your existing analytics platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">CSV Files</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">Databases</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">APIs</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-purple-200 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="p-3 bg-purple-100 rounded-lg w-fit mb-3">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl">AI-Powered Analysis</CardTitle>
              <CardDescription>
                Ask questions in natural language and get insights with statistical validation and confidence scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">Natural Language</span>
                <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">Statistical Validation</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-green-200 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="p-3 bg-green-100 rounded-lg w-fit mb-3">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-xl">Beautiful Visualizations</CardTitle>
              <CardDescription>
                Create charts, graphs, and reports that clearly communicate your findings to stakeholders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">Charts</span>
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">Reports</span>
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">Dashboards</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Use Cases */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-8 text-gray-800">What You Can Discover</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white/60 backdrop-blur rounded-xl border border-blue-100 hover:shadow-md transition-all">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold mb-2">User Behavior Patterns</h4>
              <p className="text-sm text-gray-600">Understand how users interact with your product</p>
            </div>
            <div className="p-6 bg-white/60 backdrop-blur rounded-xl border border-blue-100 hover:shadow-md transition-all">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Growth Trends</h4>
              <p className="text-sm text-gray-600">Identify what's driving your business growth</p>
            </div>
            <div className="p-6 bg-white/60 backdrop-blur rounded-xl border border-blue-100 hover:shadow-md transition-all">
              <Search className="w-8 h-8 text-purple-600 mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Hidden Insights</h4>
              <p className="text-sm text-gray-600">Discover patterns you never knew existed</p>
            </div>
            <div className="p-6 bg-white/60 backdrop-blur rounded-xl border border-blue-100 hover:shadow-md transition-all">
              <Shield className="w-8 h-8 text-orange-600 mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Validated Results</h4>
              <p className="text-sm text-gray-600">Get confidence scores and statistical validation</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Unlock Your Data's Potential?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of data-driven teams making better decisions with validated insights
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg shadow-lg">
              <Sparkles className="w-6 h-6 mr-2" />
              Get Started for Free
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
