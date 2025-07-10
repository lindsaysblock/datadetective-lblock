
import { useState, useEffect } from 'react';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { useToast } from '@/hooks/use-toast';
import { useAuthState } from '@/hooks/useAuthState';
import { supabase } from '@/integrations/supabase/client';

export const useNewProjectForm = () => {
  const { saveFormData, getFormData, clearFormData, hasStoredData, isLoading } = useFormPersistence();
  const { toast } = useToast();
  const { user } = useAuthState();
  
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
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [analysisCompleted, setAnalysisCompleted] = useState(false);

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
    // Check if user is authenticated before starting analysis
    if (!user) {
      setShowSignInModal(true);
      return;
    }

    console.log('Starting analysis with user authenticated');
    console.log('Research question:', researchQuestion);
    console.log('Additional context:', additionalContext);
    
    // Start processing analysis immediately
    setIsProcessingAnalysis(true);
    
    // Simulate analysis time
    setTimeout(() => {
      setAnalysisCompleted(true);
      setAnalysisResults({
        insights: "Based on your research question and data analysis, here are the key findings...",
        confidence: "high",
        recommendations: ["Consider implementing A/B testing", "Focus on user engagement metrics"]
      });
      
      // If project name dialog is not open, show results
      if (!showProjectDialog) {
        setShowAnalysisView(true);
        setIsProcessingAnalysis(false);
      }
    }, 3000);
    
    // Show project naming dialog
    setShowProjectDialog(true);
  };

  const handleProjectConfirm = (projectName: string) => {
    console.log('Project named:', projectName);
    setCurrentProjectName(projectName);
    clearFormData();
    
    // If analysis is completed, show results immediately
    if (analysisCompleted) {
      setIsProcessingAnalysis(false);
      setShowProjectDialog(false);
      setShowAnalysisView(true);
    } else {
      // Wait for analysis to complete
      const checkAnalysis = setInterval(() => {
        if (analysisCompleted) {
          setIsProcessingAnalysis(false);
          setShowProjectDialog(false);
          setShowAnalysisView(true);
          clearInterval(checkAnalysis);
        }
      }, 500);
    }
  };

  const handleBackToProject = () => {
    setShowAnalysisView(false);
    setAnalysisCompleted(false);
    setAnalysisResults(null);
    setCurrentProjectName('');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setAuthLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
        setShowSignInModal(false);
        // Proceed with analysis after successful sign in
        setTimeout(() => handleStartAnalysisClick(), 100);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setAuthLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/new-project`
        }
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Check your email for the confirmation link!",
        });
        setShowSignInModal(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setAuthLoading(false);
    }
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
    showSignInModal,
    authLoading,
    email,
    password,
    
    // Actions
    setResearchQuestion,
    setAdditionalContext,
    setEmail,
    setPassword,
    setShowSignInModal,
    nextStep,
    prevStep,
    handleFileChange,
    handleFileUpload,
    handleStartAnalysisClick,
    handleProjectConfirm,
    handleBackToProject,
    handleRestoreData,
    handleStartFresh,
    handleSignIn,
    handleSignUp
  };
};
