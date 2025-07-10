
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  ArrowLeft, 
  Sparkles, 
  Target, 
  Database,
  FileText,
  Lightbulb,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const NewProject = () => {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState('');
  const [researchQuestion, setResearchQuestion] = useState('');
  const [step, setStep] = useState(1);

  const handleCreateProject = () => {
    // In a real app, this would create the project in your database/state
    console.log('Creating project:', { projectName, researchQuestion });
    
    // Navigate to main explorer with the new project
    navigate(`/?new-project=true&name=${encodeURIComponent(projectName)}&question=${encodeURIComponent(researchQuestion)}`);
  };

  const sampleQuestions = [
    "What factors are driving customer churn in our business?",
    "How effective are our marketing campaigns across different channels?", 
    "Which product features correlate with higher user engagement?",
    "What are the patterns in our sales performance over time?",
    "How do different customer segments behave on our platform?",
    "What operational inefficiencies can we identify in our processes?"
  ];

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/history">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to History
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl shadow-lg">
                <HelpCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  What Are You Trying to Answer?
                </h1>
                <p className="text-blue-600 text-lg">Start with your research question</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Research Question Form */}
            <div className="space-y-6">
              <Card className="border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-green-800">
                    <Target className="w-6 h-6" />
                    Your Research Question
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      What question are you trying to answer with data? *
                    </label>
                    <Textarea
                      placeholder="e.g., What factors are causing our customer retention to decline, and which segments are most at risk?"
                      value={researchQuestion}
                      onChange={(e) => setResearchQuestion(e.target.value)}
                      className="border-green-200 focus:border-green-400 min-h-[120px] text-base"
                    />
                    <p className="text-sm text-green-700 mt-2 font-medium">
                      💡 Tip: Be specific about what you want to discover or validate
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Name *
                    </label>
                    <Input
                      placeholder="Give your research a memorable name"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="border-green-200 focus:border-green-400"
                    />
                  </div>

                  <Button 
                    onClick={() => setStep(2)}
                    disabled={!projectName.trim() || !researchQuestion.trim()}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-lg py-6"
                    size="lg"
                  >
                    Continue to Data Setup
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Guidance and Examples */}
            <div className="space-y-6">
              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                    Example Research Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Click any example to use it as a starting point:
                  </p>
                  <div className="space-y-3">
                    {sampleQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full text-left justify-start h-auto p-4 border-purple-200 hover:bg-purple-50 hover:border-purple-300"
                        onClick={() => setResearchQuestion(question)}
                      >
                        <span className="text-sm leading-relaxed">{question}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Best Practices */}
              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-blue-800">
                    <Sparkles className="w-5 h-5" />
                    Question Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-800">
                      <strong>Be specific:</strong> Instead of "analyze sales," ask "what drives sales differences between regions?"
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-800">
                      <strong>Focus on decisions:</strong> What action will you take based on the answer?
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-800">
                      <strong>Include context:</strong> Consider timeframes, segments, or conditions that matter
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="outline" 
            onClick={() => setStep(1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Research Question
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl shadow-lg">
              <Database className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Connect Your Data
              </h1>
              <p className="text-blue-600 text-lg">Upload files or connect data sources</p>
            </div>
          </div>
        </div>

        {/* Research Question Summary */}
        <Card className="mb-8 border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
          <CardContent className="p-6">
            <h3 className="font-semibold text-green-800 mb-2">Research Question: {projectName}</h3>
            <p className="text-green-700 italic">"{researchQuestion}"</p>
          </CardContent>
        </Card>

        {/* Data Connection Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-blue-200 hover:border-blue-300 transition-all duration-200 cursor-pointer hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600" />
                Upload Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Upload CSV, JSON, or Excel files to start analyzing your data
              </p>
              <Button 
                className="w-full" 
                onClick={handleCreateProject}
              >
                Choose Files
              </Button>
            </CardContent>
          </Card>

          <Card className="border-purple-200 hover:border-purple-300 transition-all duration-200 cursor-pointer hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Database className="w-5 h-5 text-purple-600" />
                Connect Database
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Connect to your database, data warehouse, or analytics platform
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleCreateProject}
              >
                Setup Connection
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Skip Option */}
        <div className="text-center mt-8">
          <Button 
            variant="ghost" 
            onClick={handleCreateProject}
            className="text-blue-600 hover:text-blue-800"
          >
            Skip for now - I'll add data later
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewProject;
