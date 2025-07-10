
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  BarChart3, 
  Users, 
  Target, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  Sparkles,
  Database,
  FileText,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur border-b border-blue-200 p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Search className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Data Detective
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Start Investigating
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Solve data mysteries without code
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Uncover insights from your data
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                like a detective
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Ask questions in plain English. Get validated insights instantly. No SQL, Tableau, or Looker expertise required. 
              Perfect for testing hypotheses, designing A/B tests, and making data-driven decisions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 text-lg shadow-lg">
                <Search className="w-5 h-5 mr-2" />
                Start Your Investigation
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-blue-300 text-blue-700 hover:bg-blue-50">
              Watch Demo
            </Button>
          </div>

          {/* Step-by-step process */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="border-blue-200 hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">1. Connect Evidence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Upload files, paste data, or connect to Amplitude, databases, and data warehouses. We handle all formats automatically.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">2. Ask Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  "How did the new feature impact user engagement?" Just ask in plain English - no technical knowledge needed.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">3. Get Validated Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Receive instant visualizations with quality scores, confidence levels, and statistical validation you can trust.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Data Sources Section */}
      <section className="py-16 px-6 bg-white/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Connect to Your Evidence Sources
          </h2>
          <p className="text-gray-600 mb-12">
            We work with all your existing data, wherever it lives
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center p-6 bg-white rounded-xl border border-blue-200 hover:shadow-md transition-all">
              <Globe className="w-8 h-8 text-purple-600 mb-3" />
              <span className="font-medium">Amplitude</span>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-xl border border-blue-200 hover:shadow-md transition-all">
              <FileText className="w-8 h-8 text-blue-600 mb-3" />
              <span className="font-medium">CSV/Excel</span>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-xl border border-blue-200 hover:shadow-md transition-all">
              <Database className="w-8 h-8 text-green-600 mb-3" />
              <span className="font-medium">Databases</span>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-xl border border-blue-200 hover:shadow-md transition-all">
              <BarChart3 className="w-8 h-8 text-orange-600 mb-3" />
              <span className="font-medium">Tableau</span>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Perfect for Every Investigation
            </h2>
            <p className="text-gray-600">
              From marketing managers to product owners - solve any data mystery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-blue-200">
              <CardHeader>
                <Target className="w-8 h-8 text-blue-600 mb-3" />
                <CardTitle>Hypothesis Testing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  "Does our new checkout flow increase conversions?" Get statistically validated answers with confidence intervals.
                </p>
                <div className="text-sm text-blue-600 font-medium">
                  Statistical validation included →
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <Users className="w-8 h-8 text-purple-600 mb-3" />
                <CardTitle>A/B Test Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Understand baseline metrics, identify user segments, and determine optimal test duration before launching.
                </p>
                <div className="text-sm text-purple-600 font-medium">
                  Test planning made easy →
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <BarChart3 className="w-8 h-8 text-green-600 mb-3" />
                <CardTitle>Performance Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  "How has user engagement changed since last quarter?" Track trends and spot anomalies automatically.
                </p>
                <div className="text-sm text-green-600 font-medium">
                  Automated insights →
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-6 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Teams Choose Data Detective
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">No Technical Skills Required</h3>
                <p className="text-gray-600">Skip the SQL, Tableau, and Looker learning curve. Ask questions in plain English and get instant answers.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Statistical Validation</h3>
                <p className="text-gray-600">Every insight comes with quality scores, confidence levels, and significance testing to prevent misleading conclusions.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Instant Results</h3>
                <p className="text-gray-600">Get answers in seconds, not hours. Perfect for quick decision-making and hypothesis validation.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Works With Your Data</h3>
                <p className="text-gray-600">Connect to Amplitude, upload files, or paste data directly. We handle all the technical complexity.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Example Questions */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ask Questions Like These
          </h2>
          <p className="text-gray-600 mb-12">
            Real questions from real teams solving real problems
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "How did our new feature impact user retention?",
              "Which user segments have the highest lifetime value?",
              "What's the optimal timing for our email campaigns?",
              "Are users from our latest marketing campaign more engaged?",
              "How do mobile users behave differently than desktop users?",
              "What factors predict customer churn?"
            ].map((question, index) => (
              <div key={index} className="p-6 bg-white rounded-xl border border-blue-200 hover:shadow-md transition-all text-left">
                <p className="text-gray-700 italic">"{question}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Start Your Data Investigation Today
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of teams making data-driven decisions without the technical complexity
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg shadow-lg">
              Begin Investigation
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-blue-200 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-gray-600">
          <p>&copy; 2024 Data Detective. Making data accessible for everyone.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
