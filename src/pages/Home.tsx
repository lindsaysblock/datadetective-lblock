
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, BarChart3, Target, TestTube, Search, ArrowRight, Sparkles, CheckCircle, Users } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur border-b border-blue-200 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Data Explorer
              </h1>
              <p className="text-blue-600 text-lg">Turn your data into clear insights without the technical complexity</p>
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
            Make Data-Driven Decisions Without Any Technical Skills
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
            Ask questions about your data in plain English. Get clear answers, validate your ideas, 
            and discover insights that drive real business results — no SQL, Tableau, or Looker expertise required.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-8 py-4 text-lg shadow-lg">
                <Sparkles className="w-6 h-6 mr-2" />
                Start Exploring Your Data
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50 px-8 py-4 text-lg shadow-lg">
              <ArrowRight className="w-6 h-6 mr-2" />
              See How It Works
            </Button>
          </div>
        </div>

        {/* What You Can Do */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="border border-blue-200 hover:shadow-lg transition-all duration-300 text-center">
            <CardHeader>
              <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Ask Questions Naturally</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                "What's our best performing product?" "Why did sales drop last month?" Just ask in plain English.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-purple-200 hover:shadow-lg transition-all duration-300 text-center">
            <CardHeader>
              <div className="p-3 bg-purple-100 rounded-lg w-fit mx-auto mb-3">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Test Your Ideas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Validate hypotheses and get statistical confidence in your business assumptions.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-green-200 hover:shadow-lg transition-all duration-300 text-center">
            <CardHeader>
              <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-3">
                <TestTube className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Design A/B Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Get guidance on setting up experiments to test new features or strategies.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-orange-200 hover:shadow-lg transition-all duration-300 text-center">
            <CardHeader>
              <div className="p-3 bg-orange-100 rounded-lg w-fit mx-auto mb-3">
                <Search className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle className="text-lg">Find Hidden Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Discover trends and insights in your data that you might have missed.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold mb-12 text-gray-800">Simple as 1-2-3</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h4 className="text-xl font-semibold mb-3">Connect Your Data</h4>
              <p className="text-gray-600">Upload spreadsheets, connect databases, or link your existing tools. We handle the technical setup.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h4 className="text-xl font-semibold mb-3">Ask Questions</h4>
              <p className="text-gray-600">Type your questions in everyday language. Our AI understands what you're looking for.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h4 className="text-xl font-semibold mb-3">Get Clear Answers</h4>
              <p className="text-gray-600">Receive insights with charts, explanations, and confidence levels. Make informed decisions instantly.</p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white/60 backdrop-blur rounded-2xl p-12 mb-16">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">Perfect for Non-Technical Teams</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">No Coding Required</h4>
                  <p className="text-gray-600 text-sm">Zero SQL, Python, or spreadsheet formulas needed</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Instant Results</h4>
                  <p className="text-gray-600 text-sm">Get answers in seconds, not hours or days</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Statistical Validation</h4>
                  <p className="text-gray-600 text-sm">Know how confident you can be in your insights</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Beautiful Visualizations</h4>
                  <p className="text-gray-600 text-sm">Auto-generated charts that tell your data's story</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Team Collaboration</h4>
                  <p className="text-gray-600 text-sm">Share insights and build on each other's discoveries</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Decision Support</h4>
                  <p className="text-gray-600 text-sm">Get recommendations, not just raw numbers</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Example Questions */}
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold mb-8 text-gray-800">Questions You Can Ask</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[
              "Which marketing channel brings the best customers?",
              "Is there a correlation between price and customer satisfaction?",
              "What time of day do users engage most with our app?",
              "Which product features predict customer retention?",
              "How do seasonal trends affect our sales?",
              "What's the optimal pricing strategy for our new product?"
            ].map((question, index) => (
              <div key={index} className="p-4 bg-white/80 rounded-lg border border-gray-200 hover:shadow-md transition-all">
                <p className="text-sm text-gray-700 italic">"{question}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-12 text-white">
          <Users className="w-16 h-16 mx-auto mb-6 text-white/90" />
          <h3 className="text-3xl font-bold mb-4">Stop Waiting for Data Answers</h3>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join business leaders who've eliminated the bottleneck between questions and insights. 
            Start making data-driven decisions today.
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg shadow-lg">
              <Sparkles className="w-6 h-6 mr-2" />
              Start Your Free Exploration
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
