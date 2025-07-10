
import { useState, useEffect } from 'react';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { useToast } from '@/hooks/use-toast';

export const useNewProjectForm = () => {
  const { saveFormData, getFormData, clearFormData, hasStoredData, isLoading } = useFormPersistence();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [researchQuestion, setResearchQuestion] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [isProcessingAnalysis, setIsProcessingAnalysis] = useState(false);
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  const [lastSaved, setLastSaved] = useState('');
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [currentProjectName, setCurrentProjectName] = useState('');
  const [showAnalysisView, setShowAnalysisView] = useState(false);

  // Check for saved data on component mount
  useEffect(() => {
    if (!isLoading && hasStoredData()) {
      const savedData = getFormData();
      setLastSaved(savedData.lastSaved);
      setShowRecoveryDialog(true);
    }
  }, [isLoading, hasStoredData, getFormData]);

  // Auto-save form data when values change
  useEffect(() => {
    if (!isLoading && !showRecoveryDialog) {
      const timeoutId = setTimeout(() => {
        saveFormData({
          researchQuestion,
          additionalContext,
          file: file ? {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified
          } : null,
          parsedData,
          currentStep: step
        });
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [researchQuestion, additionalContext, file, parsedData, step, isLoading, showRecoveryDialog, saveFormData]);

  const handleRestoreData = () => {
    try {
      const savedData = getFormData();
      setResearchQuestion(savedData.researchQuestion || '');
      setAdditionalContext(savedData.additionalContext || '');
      setParsedData(savedData.parsedData);
      setStep(savedData.currentStep || 1);
      
      if (savedData.file && savedData.parsedData) {
        const mockFile = new File([''], savedData.file.name, {
          type: savedData.file.type,
          lastModified: savedData.file.lastModified
        });
        setFile(mockFile);
      }
      
      setShowRecoveryDialog(false);
      
      toast({
        title: "Progress Restored",
        description: "Your previous work has been restored successfully.",
      });
    } catch (error) {
      console.error('Error restoring data:', error);
      toast({
        title: "Restoration Failed",
        description: "Unable to restore previous progress. Starting fresh.",
        variant: "destructive",
      });
      handleStartFresh();
    }
  };

  const handleStartFresh = () => {
    clearFormData();
    setResearchQuestion('');
    setAdditionalContext('');
    setFile(null);
    setParsedData(null);
    setStep(1);
    setShowRecoveryDialog(false);
    
    toast({
      title: "Starting Fresh",
      description: "Previous progress cleared. Starting with a clean slate.",
    });
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setParsedData({ rows: 100, columns: 10, preview: [] });
    }
  };

  const handleFileUpload = () => {
    if (!file) return;
    setUploading(true);
    setParsing(true);
    
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
    
    setCurrentProjectName(projectName);
    setIsProcessingAnalysis(true);
    clearFormData();
    
    setTimeout(() => {
      setIsProcessingAnalysis(false);
      setShowProjectDialog(false);
      
      setAnalysisResults({
        insights: "Based on your research question and data analysis, here are the key findings...",
        confidence: "high",
        recommendations: ["Consider implementing A/B testing", "Focus on user engagement metrics"]
      });
      
      setShowAnalysisView(true);
    }, 3000);
  };

  const handleBackToProject = () => {
    setShowAnalysisView(false);
  };

  return {
    // State
    step,
    researchQuestion,
    additionalContext,
    file,
    uploading,
    parsing,
    parsedData,
    showProjectDialog,
    isProcessingAnalysis,
    showRecoveryDialog,
    lastSaved,
    analysisResults,
    currentProjectName,
    showAnalysisView,
    
    // Actions
    setResearchQuestion,
    setAdditionalContext,
    nextStep,
    prevStep,
    handleFileChange,
    handleFileUpload,
    handleStartAnalysisClick,
    handleProjectConfirm,
    handleBackToProject,
    handleRestoreData,
    handleStartFresh
  };
};
