
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
  CheckCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const NewProject = () => {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState('');
  const [initialQuestion, setInitialQuestion] = useState('');
  const [step, setStep] = useState(1);

  const handleCreateProject = () => {
    // In a real app, this would create the project in your database/state
    console.log('Creating project:', { projectName, initialQuestion });
    
    // Navigate to main explorer with the new project
    navigate(`/?new-project=true&name=${encodeURIComponent(projectName)}&question=${encodeURIComponent(initialQuestion)}`);
  };

  const sampleQuestions = [
    "What are the most common user behaviors on our platform?",
    "How has our sales performance changed over time?",
    "Which customer segments are most valuable?",
    "What factors influence customer churn?",
    "How do users engage with our new features?",
    "What are the trends in our support ticket data?"
  ];

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
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
                <Plus className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Start New Project
                </h1>
                <p className="text-blue-600 text-lg">Begin your data exploration journey</p>
              </div>
            </div>
          </div>

          {/* Project Setup */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Main Form */}
            <div className="space-y-6">
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-green-600" />
                    Project Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Name *
                    </label>
                    <Input
                      placeholder="e.g., User Behavior Analysis Q1 2024"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="border-blue-200 focus:border-blue-400"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Give your project a descriptive name to find it easily later
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Initial Question *
                    </label>
                    <Textarea
                      placeholder="What are you trying to discover or validate with your data?"
                      value={initialQuestion}
                      onChange={(e) => setInitialQuestion(e.target.value)}
                      className="border-blue-200 focus:border-blue-400 min-h-[100px]"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Describe the main question or hypothesis you want to explore
                    </p>
                  </div>

                  <Button 
                    onClick={() => setStep(2)}
                    disabled={!projectName.trim() || !initialQuestion.trim()}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  >
                    Continue to Data Connection
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sample Questions */}
            <div className="space-y-6">
              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                    Example Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Not sure where to start? Here are some common data exploration questions:
                  </p>
                  <div className="space-y-3">
                    {sampleQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full text-left justify-start h-auto p-4 border-purple-200 hover:bg-purple-50 hover:border-purple-300"
                        onClick={() => setInitialQuestion(question)}
                      >
                        <span className="text-sm leading-relaxed">{question}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Tips */}
              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-blue-800">
                    <Sparkles className="w-5 h-5" />
                    Pro Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-800">
                      Start with a specific, measurable question rather than a broad topic
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-800">
                      Think about the business impact of your question
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-800">
                      Consider what data you'll need to answer your question
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
            Back to Project Details
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

        {/* Project Summary */}
        <Card className="mb-8 border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
          <CardContent className="p-6">
            <h3 className="font-semibold text-green-800 mb-2">Project: {projectName}</h3>
            <p className="text-green-700">{initialQuestion}</p>
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
