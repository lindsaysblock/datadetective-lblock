
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuthState } from '@/hooks/useAuthState';
import { useDatasetPersistence } from '@/hooks/useDatasetPersistence';
import { useDataUpload } from '@/hooks/useDataUpload';
import { generateMockDataset } from '@/utils/mockData';

interface AnalysisData {
  columns: any[];
  rows: any[];
  summary: any;
}

export const useQueryBuilderState = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [currentFilename, setCurrentFilename] = useState<string | null>(null);
  const [currentDatasetId, setCurrentDatasetId] = useState<string | null>(null);
  const [findings, setFindings] = useState<any[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [activeTab, setActiveTab] = useState('upload');
  
  const { user, loading, handleUserChange } = useAuthState();
  const { saveDataset } = useDatasetPersistence();
  const {
    uploading,
    uploadProgress,
    uploadStatus,
    uploadError,
    filename: uploadFilename,
    estimatedTime,
    handleFileUpload,
    resetUpload
  } = useDataUpload();
  
  const { toast } = useToast();

  const handleFileProcessed = useCallback(async (file: File) => {
    try {
      resetUpload();
      const parsedData = await handleFileUpload(file);
      
      if (parsedData) {
        setAnalysisData(parsedData);
        setCurrentFilename(file.name);
        setActiveTab('analysis');
        
        toast({
          title: "Data Loaded",
          description: `${file.name} processed successfully.`,
        });
      }
    } catch (error: any) {
      console.error("Error processing file:", error);
      toast({
        title: "File Processing Error",
        description: error.message || "Failed to process the file.",
        variant: "destructive",
      });
    }
  }, [handleFileUpload, resetUpload, toast]);

  const handleSaveToAccount = async () => {
    if (!analysisData || !currentFilename) return;
    
    try {
      const datasetId = await saveDataset(currentFilename, analysisData);
      if (datasetId) {
        setCurrentDatasetId(datasetId);
        toast({
          title: "Dataset Saved",
          description: "Your analysis has been saved to your account.",
        });
      }
    } catch (error: any) {
      console.error('Error saving dataset:', error);
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save dataset",
        variant: "destructive",
      });
    }
  };

  const handleDataSourceLoaded = (data: any, sourceName: string) => {
    const columns = Object.keys(data[0] || {}).map(key => ({
      name: key,
      type: 'string',
      samples: data.slice(0, 5).map((row: any) => row[key])
    }));
    const summary = {
      totalRows: data.length,
      totalColumns: columns.length,
      source: sourceName
    };
    setAnalysisData({ columns, rows: data, summary });
    setCurrentFilename(sourceName);
    setActiveTab('analysis');
    toast({
      title: "Data Source Loaded",
      description: `Data from ${sourceName} loaded successfully.`,
    });
  };

  const handleDatasetSelect = async (dataset: any) => {
    try {
      const analysisData = {
        columns: dataset.metadata?.columns || [],
        rows: dataset.metadata?.sample_rows || [],
        summary: dataset.summary || {}
      };
      
      setAnalysisData(analysisData);
      setCurrentFilename(dataset.original_filename);
      setCurrentDatasetId(dataset.id);
      setActiveTab('analysis');
      
      toast({
        title: "Dataset Loaded",
        description: `${dataset.name} loaded for analysis.`,
      });
    } catch (error: any) {
      console.error('Error loading dataset:', error);
      toast({
        title: "Load Failed",
        description: "Failed to load dataset for analysis",
        variant: "destructive",
      });
    }
  };

  const handleGenerateMockData = () => {
    const mockData = generateMockDataset(100, 3);
    handleDataSourceLoaded(mockData, 'AI Generated Sample Data');
  };

  const handleStartNewProject = () => {
    setAnalysisData(null);
    setCurrentFilename(null);
    setCurrentDatasetId(null);
    setFindings([]);
    resetUpload();
    setActiveTab('upload');
  };

  const handleResumeProject = () => {
    setActiveTab('library');
  };

  return {
    // State
    analysisData,
    currentFilename,
    currentDatasetId,
    findings,
    showOnboarding,
    activeTab,
    user,
    loading,
    uploading,
    uploadProgress,
    uploadStatus: uploadStatus as 'uploading' | 'processing' | 'complete' | 'error',
    uploadError,
    uploadFilename,
    estimatedTime,
    
    // Actions
    setAnalysisData,
    setFindings,
    setShowOnboarding,
    setActiveTab,
    handleUserChange,
    handleFileProcessed,
    handleSaveToAccount,
    handleDataSourceLoaded,
    handleDatasetSelect,
    handleGenerateMockData,
    handleStartNewProject,
    handleResumeProject
  };
};
