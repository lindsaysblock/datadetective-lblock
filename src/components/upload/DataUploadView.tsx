
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, BarChart3, ArrowLeft, HelpCircle, Plus, History } from 'lucide-react';
import DataDetectiveLogo from '../DataDetectiveLogo';
import HelpMenu from '../HelpMenu';
import FeatureCard from './FeatureCard';
import ErrorDisplay from './ErrorDisplay';
import SuccessDisplay from './SuccessDisplay';
import { ParsedData } from '@/utils/dataParser';

interface DataUploadViewProps {
  onStartUpload: () => void;
  uploadError?: string;
  onClearError: () => void;
  parsedData?: ParsedData;
}

const DataUploadView: React.FC<DataUploadViewProps> = ({
  onStartUpload,
  uploadError,
  onClearError,
  parsedData
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2">
                <DataDetectiveLogo size="sm" showText={true} />
              </Link>
              
              <Link to="/">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
            
            <div className="text-center flex-1 mx-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Start New Project
              </h1>
              <p className="text-blue-600 text-lg">Let's explore your data together</p>
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
              
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Sign In / Sign Up
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
          <FeatureCard
            icon={Upload}
            title="Upload Data"
            description="Drag and drop or select CSV, JSON, and Excel files to upload your dataset"
          />
          <FeatureCard
            icon={FileText}
            title="Process & Validate"
            description="Automatically parse and validate your data structure with intelligent detection"
          />
          <FeatureCard
            icon={BarChart3}
            title="Analyze & Visualize"
            description="Generate insights, charts, and visualizations from your data instantly"
          />
        </div>

        <div className="text-center mb-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 justify-center">
                <Upload className="w-5 h-5" />
                Ready to Begin?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={onStartUpload}
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Start Upload Process
              </Button>
            </CardContent>
          </Card>
        </div>

        <ErrorDisplay error={uploadError} onClear={onClearError} />
        <SuccessDisplay data={parsedData} />
      </div>
    </div>
  );
};

export default DataUploadView;
