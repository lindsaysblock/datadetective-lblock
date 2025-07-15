
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuthState } from '@/hooks/useAuthState';
import { useDatasetPersistence } from '@/hooks/useDatasetPersistence';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useFormPersistence } from '@/hooks/useFormPersistence';

export const useIndexPageState = () => {
  const { user, loading, handleUserChange } = useAuthState();
  const [activeTab, setActiveTab] = useState('dataExploration');
  const [researchQuestion, setResearchQuestion] = useState('');
  const { toast } = useToast();
  const { datasets, saveDataset, loading: datasetsLoading, refreshDatasets } = useDatasetPersistence();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  const { hasStoredData } = useFormPersistence();

  const {
    file,
    uploading,
    parsing,
    parsedData,
    handleFileChange,
    handleFileUpload
  } = useFileUpload();

  useEffect(() => {
    if (projectId) {
      toast({
        title: "Project Loaded",
        description: `Project ID: ${projectId} loaded. Start exploring!`,
      });
    }
  }, [projectId, toast]);

  // Check for incomplete form data and notify user
  useEffect(() => {
    if (!loading && user && hasStoredData()) {
      toast({
        title: "Incomplete Project Detected",
        description: "You have an unfinished project. Visit 'New Project' to continue where you left off.",
      });
    }
  }, [loading, user, hasStoredData, toast]);

  const handleSaveDataset = async () => {
    if (!parsedData || !file) {
      toast({
        title: "Error",
        description: "No data to save. Please upload a file and ensure it's parsed correctly.",
        variant: "destructive",
      });
      return;
    }

    try {
      const datasetId = await saveDataset(file.name, parsedData);
      
      toast({
        title: "Dataset Saved",
        description: `${file.name} has been saved.`,
      });
    } catch (error: any) {
      console.error("Save Dataset Error:", error);
      toast({
        title: "Save Error",
        description: error.message || "Failed to save dataset.",
        variant: "destructive",
      });
    }
  };

  const handleStartAnalysis = () => {
    if (!parsedData) {
      toast({
        title: "No Data",
        description: "Please upload data first before starting analysis.",
        variant: "destructive",
      });
      return;
    }

    if (!researchQuestion.trim()) {
      toast({
        title: "Missing Question",
        description: "Please describe what you want to analyze or discover.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Analysis Started",
      description: `Starting analysis: "${researchQuestion}"`,
    });
  };

  return {
    user,
    loading,
    handleUserChange,
    activeTab,
    setActiveTab,
    researchQuestion,
    setResearchQuestion,
    datasets,
    datasetsLoading,
    file,
    uploading,
    parsing,
    parsedData,
    handleFileChange,
    handleFileUpload,
    handleSaveDataset,
    handleStartAnalysis,
    toast,
    hasIncompleteProject: hasStoredData()
  };
};
