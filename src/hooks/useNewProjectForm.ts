
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { parseFile, type ParsedData } from '@/utils/dataParser';
import { DataAnalysisContext } from '@/types/data';

export const useNewProjectForm = () => {
  const [step, setStep] = useState(1);
  const [researchQuestion, setResearchQuestion] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [showAnalysisView, setShowAnalysisView] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  const [isProcessingAnalysis, setIsProcessingAnalysis] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [currentProjectName, setCurrentProjectName] = useState('');
  const [educationalMode, setEducationalMode] = useState(false);
  const { toast } = useToast();

  console.log('useNewProjectForm hook called');
  console.log('useNewProjectForm returning step:', step);
  console.log('useNewProjectForm parsedData:', parsedData ? 'has data' : 'no data');

  const addFile = (file: File) => {
    console.log('Adding file:', file.name);
    setFiles(prev => [...prev, file]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    if (files.length === 1) {
      setParsedData(null);
    }
  };

  const handleFileUpload = async (file: File) => {
    console.log('handleFileUpload called with:', file.name);
    setUploading(true);
    setParsing(true);

    try {
      const parsed = await parseFile(file);
      console.log('File parsed successfully:', parsed);
      setParsedData(parsed);
      
      toast({
        title: "File Uploaded Successfully!",
        description: `Processed ${parsed.summary.totalRows} rows and ${parsed.summary.totalColumns} columns.`,
      });
    } catch (error: any) {
      console.error('File upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || 'Failed to process the file.',
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setParsing(false);
    }
  };

  const nextStep = () => {
    console.log('Moving to next step from:', step);
    setStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    console.log('Moving to previous step from:', step);
    setStep(prev => Math.max(prev - 1, 1));
  };

  const startAnalysis = async (context: DataAnalysisContext) => {
    console.log('🚀 Starting analysis with context:', context);
    setIsProcessingAnalysis(true);
    setEducationalMode(context.educationalMode || false);
    
    // Mock analysis process
    setTimeout(() => {
      const mockResults = {
        summary: "Analysis completed successfully",
        insights: [
          "Key pattern detected in the data",
          "Significant correlation found",
          "Outliers identified and analyzed"
        ],
        recommendations: [
          "Consider focusing on high-performing segments",
          "Investigate the outlier cases",
          "Monitor trends over time"
        ],
        questionLog: []
      };
      
      setAnalysisResults(mockResults);
      setAnalysisCompleted(true);
      setIsProcessingAnalysis(false);
      
      toast({
        title: "Analysis Complete!",
        description: "Your data analysis has finished successfully.",
      });
    }, 3000);
  };

  const showResults = () => {
    console.log('Showing analysis results');
    setShowAnalysisView(true);
  };

  const handleBackToProject = () => {
    setShowAnalysisView(false);
  };

  return {
    step,
    researchQuestion,
    additionalContext,
    files,
    parsedData,
    columnMapping,
    uploading,
    parsing,
    showAnalysisView,
    analysisResults,
    analysisCompleted,
    isProcessingAnalysis,
    showProjectDialog,
    currentProjectName,
    educationalMode,
    setResearchQuestion,
    setAdditionalContext,
    setColumnMapping,
    setShowProjectDialog,
    setCurrentProjectName,
    addFile,
    removeFile,
    handleFileUpload,
    nextStep,
    prevStep,
    startAnalysis,
    showResults,
    handleBackToProject
  };
};
