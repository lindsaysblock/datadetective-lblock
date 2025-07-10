
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ArrowRight, Upload, Database, Globe, FileText, CheckCircle2, HelpCircle, Plus, FileSearch } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { useAuthState } from '@/hooks/useAuthState';
import { AnalysisActionSection } from '@/components/data/upload/AnalysisActionSection';
import FileUploadSection from '@/components/data/upload/FileUploadSection';
import ProjectNamingDialog from '@/components/data/upload/ProjectNamingDialog';

interface Dataset {
  name: string;
  type: 'file' | 'database' | 'api';
  file?: File | null;
  url?: string;
}

const NewProject = () => {
  const { user, handleUserChange } = useAuthState();
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [researchQuestion, setResearchQuestion] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [isProcessingAnalysis, setIsProcessingAnalysis] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Simulate parsing the file
      setParsedData({ rows: 100, columns: 10, preview: [] });
    }
  };

  const handleFileUpload = () => {
    if (!file) return;
    setUploading(true);
    setParsing(true);
    
    // Simulate upload/parsing
    setTimeout(() => {
      setUploading(false);
      setParsing(false);
    }, 2000);
  };

  const handleStartAnalysisClick = () => {
    setShowProjectDialog(true);
  };

  const handleProjectConfirm = (projectName: string) => {
    console.log('Starting analysis with project name:', projectName);
    console.log('Research question:', researchQuestion);
    console.log('Additional context:', additionalContext);
    
    setIsProcessingAnalysis(true);
    
    // Simulate processing time
    setTimeout(() => {
      setIsProcessingAnalysis(false);
      setShowProjectDialog(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header user={user} onUserChange={handleUserChange} />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="text-center flex-1 mx-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Start New Project
            </h1>
            <p className="text-blue-600 text-lg">Let's explore your data together</p>
          </div>
          <div className="w-24"></div>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 ${step > 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              {step > 1 ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-5 h-5 rounded-full border border-gray-400"></div>}
              Question
            </div>
            <div className={`flex items-center gap-2 ${step > 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              {step > 2 ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-5 h-5 rounded-full border border-gray-400"></div>}
              Data Source
            </div>
            <div className={`flex items-center gap-2 ${step > 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              {step > 3 ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-5 h-5 rounded-full border border-gray-400"></div>}
              Business Context
            </div>
            <div className={`flex items-center gap-2 ${step > 4 ? 'text-blue-600' : 'text-gray-400'}`}>
              {step > 4 ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-5 h-5 rounded-full border border-gray-400"></div>}
              Analysis
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
        </div>

        {/* Step 1: Question */}
        {step === 1 && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <HelpCircle className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold">What's your question?</h3>
              </div>
              <p className="text-gray-600 mb-4">
                What do you want to answer?
              </p>
              <Textarea
                placeholder="e.g., What are the main trends in customer behavior over time?"
                value={researchQuestion}
                onChange={(e) => setResearchQuestion(e.target.value)}
                className="min-h-[100px] resize-none"
              />
              <div className="flex justify-end mt-4">
                <Button onClick={nextStep}>
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Data Source */}
        {step === 2 && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <Plus className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Data Source</h3>
              </div>
              <FileUploadSection
                file={file}
                uploading={uploading}
                parsing={parsing}
                onFileChange={handleFileChange}
                onFileUpload={handleFileUpload}
              />
              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button onClick={nextStep}>
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Business Context */}
        {step === 3 && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <FileSearch className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold">Business Context</h3>
                <span className="text-sm text-gray-500">(Optional)</span>
              </div>
              <p className="text-gray-600 mb-4">
                Provide any business context or background information about your data
              </p>
              <Textarea
                placeholder="e.g., This data comes from our e-commerce platform and includes customer purchase history from the last 6 months..."
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                className="min-h-[80px] resize-none"
              />
              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button onClick={nextStep}>
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Analysis */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AnalysisActionSection
                researchQuestion={researchQuestion}
                setResearchQuestion={setResearchQuestion}
                parsedData={parsedData}
                onStartAnalysis={handleStartAnalysisClick}
              />

              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <ProjectNamingDialog
          open={showProjectDialog}
          onOpenChange={setShowProjectDialog}
          onConfirm={handleProjectConfirm}
          isProcessing={isProcessingAnalysis}
        />
      </div>
    </div>
  );
};

export default NewProject;
